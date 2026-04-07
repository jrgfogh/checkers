import type { GameModel } from "../src/moveGenerator";
import { parse, startPosition } from "../src/checkersFEN";

type SocketId = string;

export type GameRoom = {
  id: string;
  blackPlayer: SocketId | null;
  whitePlayer: SocketId | null;
  gameState: GameModel;
  status: "waiting" | "playing" | "finished";
  createdAt: number;
  lastActivity: number;
  disconnectTimers: Map<SocketId, ReturnType<typeof setTimeout>>;
};

const ROOM_ID_LENGTH = 6;
const STALE_ROOM_MS = 30 * 60 * 1000; // 30 minutes
const RECONNECT_GRACE_MS = 60 * 1000; // 60 seconds

export class RoomManager {
  private rooms = new Map<string, GameRoom>();
  private socketToRoom = new Map<SocketId, string>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  start(): void {
    this.cleanupInterval = setInterval(() => this.cleanupStaleRooms(), 60_000);
  }

  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    for (const room of this.rooms.values()) {
      for (const timer of room.disconnectTimers.values()) {
        clearTimeout(timer);
      }
    }
    this.rooms.clear();
    this.socketToRoom.clear();
  }

  createRoom(socketId: SocketId): GameRoom {
    const id = this.generateRoomId();
    const room: GameRoom = {
      id,
      blackPlayer: socketId,
      whitePlayer: null,
      gameState: parse(startPosition),
      status: "waiting",
      createdAt: Date.now(),
      lastActivity: Date.now(),
      disconnectTimers: new Map(),
    };
    this.rooms.set(id, room);
    this.socketToRoom.set(socketId, id);
    return room;
  }

  joinRoom(roomId: string, socketId: SocketId): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== "waiting" || room.whitePlayer !== null) {
      return null;
    }
    room.whitePlayer = socketId;
    room.status = "playing";
    room.lastActivity = Date.now();
    this.socketToRoom.set(socketId, roomId);
    return room;
  }

  getRoom(roomId: string): GameRoom | undefined {
    return this.rooms.get(roomId);
  }

  getRoomForSocket(socketId: SocketId): GameRoom | undefined {
    const roomId = this.socketToRoom.get(socketId);
    if (!roomId) return undefined;
    return this.rooms.get(roomId);
  }

  getPlayerColor(room: GameRoom, socketId: SocketId): "black" | "white" | null {
    if (room.blackPlayer === socketId) return "black";
    if (room.whitePlayer === socketId) return "white";
    return null;
  }

  handleDisconnect(socketId: SocketId, onTimeout: (room: GameRoom) => void): GameRoom | null {
    const room = this.getRoomForSocket(socketId);
    if (!room) {
      this.socketToRoom.delete(socketId);
      return null;
    }

    if (room.status === "waiting") {
      this.removeRoom(room.id);
      return null;
    }

    if (room.status === "playing") {
      const timer = setTimeout(() => {
        room.status = "finished";
        onTimeout(room);
      }, RECONNECT_GRACE_MS);
      room.disconnectTimers.set(socketId, timer);
    }

    return room;
  }

  handleReconnect(oldSocketId: SocketId, newSocketId: SocketId): GameRoom | null {
    const roomId = this.socketToRoom.get(oldSocketId);
    if (!roomId) return null;
    const room = this.rooms.get(roomId);
    if (!room || room.status === "finished") return null;

    const timer = room.disconnectTimers.get(oldSocketId);
    if (timer) {
      clearTimeout(timer);
      room.disconnectTimers.delete(oldSocketId);
    }

    if (room.blackPlayer === oldSocketId) {
      room.blackPlayer = newSocketId;
    } else if (room.whitePlayer === oldSocketId) {
      room.whitePlayer = newSocketId;
    } else {
      return null;
    }

    this.socketToRoom.delete(oldSocketId);
    this.socketToRoom.set(newSocketId, roomId);
    return room;
  }

  updateGameState(roomId: string, gameState: GameModel): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.gameState = gameState;
      room.lastActivity = Date.now();
    }
  }

  finishRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.status = "finished";
    }
  }

  private removeRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    for (const timer of room.disconnectTimers.values()) {
      clearTimeout(timer);
    }
    if (room.blackPlayer) this.socketToRoom.delete(room.blackPlayer);
    if (room.whitePlayer) this.socketToRoom.delete(room.whitePlayer);
    this.rooms.delete(roomId);
  }

  private cleanupStaleRooms(): void {
    const now = Date.now();
    for (const [id, room] of this.rooms) {
      if (now - room.lastActivity > STALE_ROOM_MS) {
        this.removeRoom(id);
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
