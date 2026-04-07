import type { GameModel } from "../src/moveGenerator";
import { parse, startPosition } from "../src/checkersFEN";

export type SocketLike = { readonly id: string };

export type GameRoom = {
  id: string;
  blackPlayer: SocketLike | null;
  whitePlayer: SocketLike | null;
  gameState: GameModel;
  status: "waiting" | "playing" | "finished";
  lastActivity: number;
};

const ROOM_ID_LENGTH = 6;
const STALE_ROOM_MS = 30 * 60 * 1000; // 30 minutes

export class RoomManager {
  private rooms = new Map<string, GameRoom>();
  private socketToRoom = new Map<SocketLike, GameRoom>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  start(): void {
    this.cleanupInterval = setInterval(() => this.cleanupStaleRooms(), 60_000);
  }

  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.rooms.clear();
    this.socketToRoom.clear();
  }

  createRoom(socket: SocketLike): GameRoom {
    const id = this.generateRoomId();
    const room: GameRoom = {
      id,
      blackPlayer: socket,
      whitePlayer: null,
      gameState: parse(startPosition),
      status: "waiting",
      lastActivity: Date.now(),
    };
    this.rooms.set(id, room);
    this.socketToRoom.set(socket, room);
    return room;
  }

  joinRoom(roomId: string, socket: SocketLike): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== "waiting" || room.whitePlayer !== null) {
      return null;
    }
    room.whitePlayer = socket;
    room.status = "playing";
    room.lastActivity = Date.now();
    this.socketToRoom.set(socket, room);
    return room;
  }

  getRoomForSocket(socket: SocketLike): GameRoom | undefined {
    return this.socketToRoom.get(socket);
  }

  getPlayerColor(room: GameRoom, socket: SocketLike): "black" | "white" | null {
    if (room.blackPlayer === socket) return "black";
    if (room.whitePlayer === socket) return "white";
    return null;
  }

  handleDisconnect(socket: SocketLike): GameRoom | null {
    const room = this.getRoomForSocket(socket);
    if (!room) {
      return null;
    }

    if (room.status === "waiting") {
      this.removeRoom(room);
      return null;
    }

    if (room.status === "playing") {
      room.status = "finished";
      return room;
    }

    return null;
  }

  updateGameState(room: GameRoom, gameState: GameModel): void {
    room.gameState = gameState;
    room.lastActivity = Date.now();
  }

  finishRoom(room: GameRoom): void {
    room.status = "finished";
  }

  private removeRoom(room: GameRoom): void {
    if (room.blackPlayer) this.socketToRoom.delete(room.blackPlayer);
    if (room.whitePlayer) this.socketToRoom.delete(room.whitePlayer);
    this.rooms.delete(room.id);
  }

  private cleanupStaleRooms(): void {
    const now = Date.now();
    for (const [_id, room] of this.rooms) {
      if (now - room.lastActivity > STALE_ROOM_MS) {
        this.removeRoom(room);
      }
    }
  }

  private generateRoomId(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let id: string;
    do {
      id = "";
      for (let i = 0; i < ROOM_ID_LENGTH; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
      }
    } while (this.rooms.has(id));
    return id;
  }

  // Exposed for testing
  get roomCount(): number {
    return this.rooms.size;
  }
}
