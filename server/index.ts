import express from "express";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import path from "path";
import { RoomManager } from "./gameRoom";
import { registerSocketHandlers } from "./socketHandlers";
import type { ClientToServerEvents, ServerToClientEvents } from "./protocol";

const PORT = parseInt(process.env.PORT || "3000", 10);

const app = express();
app.use(express.static(path.join(__dirname, "..", "dist")));

const httpServer = createServer(app);
const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || false,
  },
});

const roomManager = new RoomManager();
roomManager.start();

registerSocketHandlers(io, roomManager);

httpServer.listen(PORT, () => {
  console.log(`Checkers server listening on port ${PORT}`);
});

process.on("SIGTERM", () => {
  roomManager.stop();
  httpServer.close();
});
