import type { Server, Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "./protocol";
import type { RoomManager } from "./gameRoom";
import { movesFrom, movePiece } from "../src/moveGenerator";
import { unparse } from "../src/checkersFEN";

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;

function isValidSquare(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 63;
}

export function registerSocketHandlers(io: TypedServer, roomManager: RoomManager): void {
  io.on("connection", (socket: TypedSocket) => {
    socket.on("create-game", () => {
      if (roomManager.getRoomForSocket(socket.id)) {
        socket.emit("error", { message: "You are already in a game." });
        return;
      }
      const room = roomManager.createRoom(socket.id);
      socket.join(room.id);
      socket.emit("game-created", { roomId: room.id, color: "black" });
    });

    socket.on("join-game", (payload) => {
      if (!payload || typeof payload.roomId !== "string") {
        socket.emit("error", { message: "Invalid room ID." });
        return;
      }
      if (roomManager.getRoomForSocket(socket.id)) {
        socket.emit("error", { message: "You are already in a game." });
        return;
      }
      const roomId = payload.roomId.toUpperCase().trim();
      const room = roomManager.joinRoom(roomId, socket.id);
      if (!room) {
        socket.emit("error", { message: "Room not found or already full." });
        return;
      }
      socket.join(room.id);
      const fen = unparse(room.gameState);
      socket.emit("game-start", { gameState: fen, color: "white" });
      socket.to(room.id).emit("game-start", { gameState: fen, color: "black" });
    });

    socket.on("move", (payload) => {
      if (!payload || !isValidSquare(payload.from) || !isValidSquare(payload.to)) {
        socket.emit("error", { message: "Invalid move payload." });
        return;
      }
      const room = roomManager.getRoomForSocket(socket.id);
      if (!room || room.status !== "playing") {
        socket.emit("error", { message: "No active game." });
        return;
      }
      const color = roomManager.getPlayerColor(room, socket.id);
      if (color !== room.gameState.turn) {
        socket.emit("error", { message: "Not your turn." });
        return;
      }
      const piece = room.gameState.board[payload.from];
      if (!piece || piece.color !== color) {
        socket.emit("error", { message: "Not your piece." });
        return;
      }
      const moves = movesFrom(room.gameState, payload.from);
      let isLegal = false;
      for (let i = 0; i < moves.length; i += 2) {
        if (moves[i] === payload.to) {
          isLegal = true;
          break;
        }
      }
      if (!isLegal) {
        socket.emit("error", { message: "Illegal move." });
        return;
      }
      const newState = movePiece(room.gameState, payload.from, payload.to);
      roomManager.updateGameState(room, newState);
      const fen = unparse(newState);
      socket.to(room.id).emit("opponent-moved", {
        from: payload.from,
        to: payload.to,
        gameState: fen,
      });
      socket.emit("move-accepted", {
        from: payload.from,
        to: payload.to,
        gameState: fen,
      });
    });

    socket.on("resign", () => {
      const room = roomManager.getRoomForSocket(socket.id);
      if (!room || room.status !== "playing") return;
      const color = roomManager.getPlayerColor(room, socket.id);
      if (!color) return;
      const winner = color === "black" ? "white" : "black";
      roomManager.finishRoom(room);
      io.to(room.id).emit("game-over", { winner, reason: "resignation" });
    });

    socket.on("disconnect", () => {
      const room = roomManager.handleDisconnect(socket.id, (timedOutRoom) => {
        io.to(timedOutRoom.id).emit("game-over", {
          winner: timedOutRoom.blackPlayer === socket.id ? "white" : "black",
          reason: "disconnect timeout",
        });
      });
      if (room && room.status === "playing") {
        socket.to(room.id).emit("opponent-disconnected");
      }
    });
  });
}
