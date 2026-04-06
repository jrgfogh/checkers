export type ClientToServerEvents = {
  "create-game": () => void;
  "join-game": (payload: { roomId: string }) => void;
  "move": (payload: { from: number; to: number }) => void;
  "resign": () => void;
};

export type ServerToClientEvents = {
  "game-created": (payload: { roomId: string; color: "black" | "white" }) => void;
  "game-start": (payload: { gameState: string; color: "black" | "white" }) => void;
  "game-state": (payload: { gameState: string }) => void;
  "opponent-moved": (payload: { from: number; to: number; gameState: string }) => void;
  "game-over": (payload: { winner: "black" | "white"; reason: string }) => void;
  "opponent-disconnected": () => void;
  "opponent-reconnected": () => void;
  "error": (payload: { message: string }) => void;
};
