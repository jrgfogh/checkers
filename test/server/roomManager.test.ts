/**
 * @jest-environment node
 */

import { RoomManager } from "../../server/gameRoom";
import type { SocketLike } from "../../server/gameRoom";

function sock(id: string): SocketLike { return { id }; }

describe("RoomManager", () => {
  let manager: RoomManager;

  beforeEach(() => {
    manager = new RoomManager();
  });

  afterEach(() => {
    manager.stop();
  });

  describe("createRoom", () => {
    it("creates a room and assigns creator as black", () => {
      const room = manager.createRoom(sock("socket-1"));
      expect(room.id).toHaveLength(6);
      expect(room.blackPlayer).toBe("socket-1");
      expect(room.whitePlayer).toBeNull();
      expect(room.status).toBe("waiting");
      expect(room.gameState.board).toHaveLength(64);
      expect(room.gameState.turn).toBe("black");
    });

    it("generates unique room IDs", () => {
      const ids = new Set<string>();
      for (let i = 0; i < 50; i++) {
        const room = manager.createRoom(sock(`socket-${i}`));
        ids.add(room.id);
      }
      expect(ids.size).toBe(50);
    });

    it("increments room count", () => {
      expect(manager.roomCount).toBe(0);
      manager.createRoom(sock("socket-1"));
      expect(manager.roomCount).toBe(1);
      manager.createRoom(sock("socket-2"));
      expect(manager.roomCount).toBe(2);
    });
  });

  describe("joinRoom", () => {
    it("second player joins as white and starts the game", () => {
      const room = manager.createRoom(sock("socket-1"));
      const joined = manager.joinRoom(room.id, sock("socket-2"));
      expect(joined).not.toBeNull();
      expect(joined!.whitePlayer).toBe("socket-2");
      expect(joined!.status).toBe("playing");
    });

    it("returns null for nonexistent room", () => {
      expect(manager.joinRoom("XXXXXX", sock("socket-1"))).toBeNull();
    });

    it("returns null for a room that is already full", () => {
      const room = manager.createRoom(sock("socket-1"));
      manager.joinRoom(room.id, sock("socket-2"));
      expect(manager.joinRoom(room.id, sock("socket-3"))).toBeNull();
    });
  });

  describe("getRoomForSocket", () => {
    it("returns the room a socket belongs to", () => {
      const room = manager.createRoom(sock("socket-1"));
      expect(manager.getRoomForSocket(sock("socket-1"))).toBe(room);
    });

    it("returns undefined for unknown socket", () => {
      expect(manager.getRoomForSocket(sock("unknown"))).toBeUndefined();
    });

    it("works for both players", () => {
      const room = manager.createRoom(sock("socket-1"));
      manager.joinRoom(room.id, sock("socket-2"));
      expect(manager.getRoomForSocket(sock("socket-1"))!.id).toBe(room.id);
      expect(manager.getRoomForSocket(sock("socket-2"))!.id).toBe(room.id);
    });
  });

  describe("getPlayerColor", () => {
    it("returns black for creator", () => {
      const room = manager.createRoom(sock("socket-1"));
      expect(manager.getPlayerColor(room, sock("socket-1"))).toBe("black");
    });

    it("returns white for joiner", () => {
      const room = manager.createRoom(sock("socket-1"));
      manager.joinRoom(room.id, sock("socket-2"));
      expect(manager.getPlayerColor(room, sock("socket-2"))).toBe("white");
    });

    it("returns null for unknown socket", () => {
      const room = manager.createRoom(sock("socket-1"));
      expect(manager.getPlayerColor(room, sock("unknown"))).toBeNull();
    });
  });

  describe("handleDisconnect", () => {
    it("removes waiting rooms on disconnect", () => {
      manager.createRoom(sock("socket-1"));
      const result = manager.handleDisconnect(sock("socket-1"), () => {});
      expect(result).toBeNull();
      expect(manager.roomCount).toBe(0);
    });

    it("keeps playing rooms alive with a timer", () => {
      const room = manager.createRoom(sock("socket-1"));
      manager.joinRoom(room.id, sock("socket-2"));
      const result = manager.handleDisconnect(sock("socket-1"), () => {});
      expect(result).not.toBeNull();
      expect(result!.status).toBe("playing");
    });

    it("calls timeout callback after grace period", () => {
      jest.useFakeTimers();
      const room = manager.createRoom(sock("socket-1"));
      manager.joinRoom(room.id, sock("socket-2"));
      const onTimeout = jest.fn();
      manager.handleDisconnect(sock("socket-1"), onTimeout);
      jest.advanceTimersByTime(60_000);
      expect(onTimeout).toHaveBeenCalledWith(expect.objectContaining({ id: room.id }));
      jest.useRealTimers();
    });

    it("returns null for unknown socket", () => {
      expect(manager.handleDisconnect(sock("unknown"), () => {})).toBeNull();
    });
  });

  describe("handleReconnect", () => {
    it("transfers socket ID and clears timer", () => {
      jest.useFakeTimers();
      const room = manager.createRoom(sock("socket-1"));
      manager.joinRoom(room.id, sock("socket-2"));
      const onTimeout = jest.fn();
      manager.handleDisconnect(sock("socket-1"), onTimeout);

      const reconnected = manager.handleReconnect("socket-1", sock("socket-1-new"));
      expect(reconnected).not.toBeNull();
      expect(reconnected!.blackPlayer).toBe("socket-1-new");
      expect(manager.getRoomForSocket(sock("socket-1-new"))).toBe(room);
      expect(manager.getRoomForSocket(sock("socket-1"))).toBeUndefined();

      // Timer should be cancelled
      jest.advanceTimersByTime(60_000);
      expect(onTimeout).not.toHaveBeenCalled();
      jest.useRealTimers();
    });

    it("returns null for unknown old socket", () => {
      expect(manager.handleReconnect("unknown", sock("new"))).toBeNull();
    });
  });

  describe("updateGameState", () => {
    it("updates game state and lastActivity", () => {
      const room = manager.createRoom(sock("socket-1"));
      const before = room.lastActivity;
      const newState = { board: Array(64).fill(null), turn: "white" as const };
      manager.updateGameState(room, newState);
      expect(room.gameState).toBe(newState);
      expect(room.lastActivity).toBeGreaterThanOrEqual(before);
    });
  });

  describe("finishRoom", () => {
    it("sets status to finished", () => {
      const room = manager.createRoom(sock("socket-1"));
      manager.finishRoom(room);
      expect(room.status).toBe("finished");
    });
  });
});
