import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../server/protocol";

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: TypedSocket | null = null;

function getSocket(): TypedSocket {
  if (!socket) {
    socket = io({ autoConnect: false });
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

export function onGameCreated(cb: (payload: { roomId: string }) => void): void {
  getSocket().on("game-created", cb);
}

export function onGameStart(cb: (payload: { gameState: string; color: "black" | "white" }) => void): void {
  getSocket().on("game-start", cb);
}

export function onOpponentMoved(cb: (payload: { from: number; to: number; gameState: string }) => void): void {
  getSocket().on("opponent-moved", cb);
}

export function offOpponentMoved(cb: (payload: { from: number; to: number; gameState: string }) => void): void {
  if (socket) socket.off("opponent-moved", cb);
}

export function onMoveAccepted(cb: (payload: { from: number; to: number; gameState: string }) => void): void {
  getSocket().on("move-accepted", cb);
}

export function offMoveAccepted(cb: (payload: { from: number; to: number; gameState: string }) => void): void {
  if (socket) socket.off("move-accepted", cb);
}

export function onGameOver(cb: (payload: { winner: "black" | "white"; reason: string }) => void): void {
  getSocket().on("game-over", cb);
}

export function offGameOver(cb: (payload: { winner: "black" | "white"; reason: string }) => void): void {
  if (socket) socket.off("game-over", cb);
}

export function onError(cb: (payload: { message: string }) => void): void {
  getSocket().on("error", cb);
}
