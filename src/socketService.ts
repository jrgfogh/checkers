import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../server/protocol";

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: TypedSocket | null = null;
let previousSocketId: string | null = null;

function getSocket(): TypedSocket {
  if (!socket) {
    socket = io({ autoConnect: false });
    socket.on("connect", () => {
      const currentId = socket!.id;
      if (previousSocketId && currentId && currentId !== previousSocketId) {
        socket!.emit("reconnect-to-game", { previousSocketId });
      }
      if (currentId) {
        previousSocketId = currentId;
      }
    });
  }
  return socket;
}

export function connect(): void {
  getSocket().connect();
}

export function disconnect(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  previousSocketId = null;
}

export function createGame(): void {
  getSocket().emit("create-game");
}

export function joinGame(roomId: string): void {
  getSocket().emit("join-game", { roomId });
}

export function sendMove(from: number, to: number): void {
  getSocket().emit("move", { from, to });
}

export function resign(): void {
  getSocket().emit("resign");
}

export function onGameCreated(cb: (payload: { roomId: string; color: "black" | "white" }) => void): void {
  getSocket().on("game-created", cb);
}

export function onGameStart(cb: (payload: { gameState: string; color: "black" | "white" }) => void): void {
  getSocket().on("game-start", cb);
}

export function onGameState(cb: (payload: { gameState: string }) => void): void {
  getSocket().on("game-state", cb);
}

export function onOpponentMoved(cb: (payload: { from: number; to: number; gameState: string }) => void): void {
  getSocket().on("opponent-moved", cb);
}

export function onMoveAccepted(cb: (payload: { from: number; to: number; gameState: string }) => void): void {
  getSocket().on("move-accepted", cb);
}

export function onGameOver(cb: (payload: { winner: "black" | "white"; reason: string }) => void): void {
  getSocket().on("game-over", cb);
}

export function onOpponentDisconnected(cb: () => void): void {
  getSocket().on("opponent-disconnected", cb);
}

export function onOpponentReconnected(cb: () => void): void {
  getSocket().on("opponent-reconnected", cb);
}

export function onError(cb: (payload: { message: string }) => void): void {
  getSocket().on("error", cb);
}

export function offAll(): void {
  if (socket) {
    socket.removeAllListeners();
  }
}
