/**
 * @jest-environment node
 */

import { createServer, Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { io as ioClient, Socket as ClientSocket } from "socket.io-client";
import { RoomManager } from "../../server/gameRoom";
import { registerSocketHandlers } from "../../server/socketHandlers";
import type { ClientToServerEvents, ServerToClientEvents } from "../../server/protocol";

type TypedClientSocket = ClientSocket<ServerToClientEvents, ClientToServerEvents>;

function waitForEvent<T>(socket: TypedClientSocket, event: string): Promise<T> {
  return new Promise((resolve) => {
    (socket as any).once(event, (data: T) => resolve(data));
  });
}

describe("Socket handlers", () => {
  let httpServer: HttpServer;
  let ioServer: SocketServer;
  let roomManager: RoomManager;
  let port: number;

  beforeEach((done) => {
    roomManager = new RoomManager();
    httpServer = createServer();
    ioServer = new SocketServer(httpServer);
    registerSocketHandlers(ioServer as any, roomManager);
    httpServer.listen(0, () => {
      const addr = httpServer.address();
      port = typeof addr === "object" && addr ? addr.port : 0;
      done();
    });
  });

  afterEach((done) => {
    roomManager.stop();
    ioServer.close();
    httpServer.close(done);
  });

  function createClient(): TypedClientSocket {
    return ioClient(`http://localhost:${port}`, {
      transports: ["websocket"],
      forceNew: true,
    }) as TypedClientSocket;
  }

  function connectClient(): Promise<TypedClientSocket> {
    return new Promise((resolve) => {
      const client = createClient();
      client.on("connect", () => resolve(client));
    });
  }

  afterEach(() => {
    // cleanup is handled by the ioServer.close()
  });

  describe("create-game", () => {
    it("creates a game and returns room ID", async () => {
      const client = await connectClient();
      try {
        const promise = waitForEvent<{ roomId: string }>(client, "game-created");
        client.emit("create-game");
        const data = await promise;
        expect(data.roomId).toHaveLength(6);
      } finally {
        client.disconnect();
      }
    });

    it("rejects creating a second game", async () => {
      const client = await connectClient();
      try {
        const createdPromise = waitForEvent<{ roomId: string }>(client, "game-created");
        client.emit("create-game");
        await createdPromise;

        const errorPromise = waitForEvent<{ message: string }>(client, "error");
        client.emit("create-game");
        const error = await errorPromise;
        expect(error.message).toMatch(/already in a game/i);
      } finally {
        client.disconnect();
      }
    });
  });

  describe("join-game", () => {
    it("joins a game and both players receive game-start", async () => {
      const creator = await connectClient();
      const joiner = await connectClient();
      try {
        const createdPromise = waitForEvent<{ roomId: string }>(creator, "game-created");
        creator.emit("create-game");
        const { roomId } = await createdPromise;

        const creatorStartPromise = waitForEvent<{ gameState: string; color: string }>(creator, "game-start");
        const joinerStartPromise = waitForEvent<{ gameState: string; color: string }>(joiner, "game-start");
        joiner.emit("join-game", { roomId });

        const [creatorStart, joinerStart] = await Promise.all([creatorStartPromise, joinerStartPromise]);
        expect(creatorStart.color).toBe("black");
        expect(joinerStart.color).toBe("white");
        expect(creatorStart.gameState).toBe(joinerStart.gameState);
      } finally {
        creator.disconnect();
        joiner.disconnect();
      }
    });

    it("returns error for invalid room ID", async () => {
      const client = await connectClient();
      try {
        const errorPromise = waitForEvent<{ message: string }>(client, "error");
        client.emit("join-game", { roomId: "ZZZZZZ" });
        const error = await errorPromise;
        expect(error.message).toMatch(/not found/i);
      } finally {
        client.disconnect();
      }
    });
  });

  describe("move", () => {
    async function setupGame(): Promise<[TypedClientSocket, TypedClientSocket]> {
      const black = await connectClient();
      const white = await connectClient();

      const createdPromise = waitForEvent<{ roomId: string }>(black, "game-created");
      black.emit("create-game");
      const { roomId } = await createdPromise;

      const blackStartPromise = waitForEvent<any>(black, "game-start");
      const whiteStartPromise = waitForEvent<any>(white, "game-start");
      white.emit("join-game", { roomId });
      await Promise.all([blackStartPromise, whiteStartPromise]);

      return [black, white];
    }

    it("allows valid move from black (first turn)", async () => {
      const [black, white] = await setupGame();
      try {
        // Black man at square 17 can move to 26 or 24
        const blackMovePromise = waitForEvent<{ from: number; to: number; gameState: string }>(black, "move-accepted");
        const whiteMovePromise = waitForEvent<{ from: number; to: number; gameState: string }>(white, "opponent-moved");

        black.emit("move", { from: 17, to: 26 });

        const [blackResult, whiteResult] = await Promise.all([blackMovePromise, whiteMovePromise]);
        expect(blackResult.from).toBe(17);
        expect(blackResult.to).toBe(26);
        expect(whiteResult.gameState).toBe(blackResult.gameState);
      } finally {
        black.disconnect();
        white.disconnect();
      }
    });

    it("rejects move when not your turn", async () => {
      const [black, white] = await setupGame();
      try {
        // White tries to move on black's turn (white piece at 40)
        const errorPromise = waitForEvent<{ message: string }>(white, "error");
        white.emit("move", { from: 40, to: 33 });
        const error = await errorPromise;
        expect(error.message).toMatch(/not your turn/i);
      } finally {
        black.disconnect();
        white.disconnect();
      }
    });

    it("rejects move of opponent's piece", async () => {
      const [black, white] = await setupGame();
      try {
        // Black tries to move a white piece (white piece at square 40)
        const errorPromise = waitForEvent<{ message: string }>(black, "error");
        black.emit("move", { from: 40, to: 33 });
        const error = await errorPromise;
        expect(error.message).toMatch(/not your piece/i);
      } finally {
        black.disconnect();
        white.disconnect();
      }
    });

    it("rejects illegal move", async () => {
      const [black, white] = await setupGame();
      try {
        const errorPromise = waitForEvent<{ message: string }>(black, "error");
        // Black piece at 17, try to move to 27 (not a legal destination)
        black.emit("move", { from: 17, to: 27 });
        const error = await errorPromise;
        expect(error.message).toMatch(/illegal move/i);
      } finally {
        black.disconnect();
        white.disconnect();
      }
    });
  });

  describe("resign", () => {
    it("ends the game with opponent as winner", async () => {
      const black = await connectClient();
      const white = await connectClient();
      try {
        const createdPromise = waitForEvent<{ roomId: string }>(black, "game-created");
        black.emit("create-game");
        const { roomId } = await createdPromise;

        const blackStartPromise = waitForEvent<any>(black, "game-start");
        const whiteStartPromise = waitForEvent<any>(white, "game-start");
        white.emit("join-game", { roomId });
        await Promise.all([blackStartPromise, whiteStartPromise]);

        const blackOverPromise = waitForEvent<{ winner: string; reason: string }>(black, "game-over");
        const whiteOverPromise = waitForEvent<{ winner: string; reason: string }>(white, "game-over");
        black.emit("resign");

        const [blackOver, whiteOver] = await Promise.all([blackOverPromise, whiteOverPromise]);
        expect(blackOver.winner).toBe("white");
        expect(blackOver.reason).toBe("resignation");
        expect(whiteOver.winner).toBe("white");
      } finally {
        black.disconnect();
        white.disconnect();
      }
    });
  });

  describe("disconnect", () => {
    it("ends the game when a player disconnects", async () => {
      const black = await connectClient();
      const white = await connectClient();
      try {
        const createdPromise = waitForEvent<{ roomId: string }>(black, "game-created");
        black.emit("create-game");
        const { roomId } = await createdPromise;

        const blackStartPromise = waitForEvent<any>(black, "game-start");
        const whiteStartPromise = waitForEvent<any>(white, "game-start");
        white.emit("join-game", { roomId });
        await Promise.all([blackStartPromise, whiteStartPromise]);

        const gameOverPromise = waitForEvent<{ winner: string; reason: string }>(white, "game-over");
        black.disconnect();
        const gameOver = await gameOverPromise;
        expect(gameOver.winner).toBe("white");
        expect(gameOver.reason).toBe("opponent disconnected");
      } finally {
        white.disconnect();
      }
    });
  });

  describe("input validation", () => {
    it("rejects move with out-of-range square", async () => {
      const client = await connectClient();
      try {
        const createdPromise = waitForEvent<any>(client, "game-created");
        client.emit("create-game");
        await createdPromise;

        const errorPromise = waitForEvent<{ message: string }>(client, "error");
        client.emit("move", { from: -1, to: 100 });
        const error = await errorPromise;
        expect(error.message).toMatch(/invalid/i);
      } finally {
        client.disconnect();
      }
    });
  });
});
