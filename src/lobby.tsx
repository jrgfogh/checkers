import { useState, useCallback, useEffect } from "react";
import * as socketService from "./socketService";
import { parse } from "./checkersFEN";
import { Game } from "./ui";
import type { GameModel } from "./moveGenerator";

type LobbyState =
  | { phase: "menu" }
  | { phase: "waiting"; roomId: string }
  | { phase: "joining" }
  | { phase: "playing"; game: GameModel; color: "black" | "white" };

export function Lobby() {
  const [state, setState] = useState<LobbyState>({ phase: "menu" });
  const [joinInput, setJoinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    socketService.connect();

    socketService.onGameCreated(({ roomId, color }) => {
      setState({ phase: "waiting", roomId });
      void color;
    });

    socketService.onGameStart(({ gameState, color }) => {
      setState({ phase: "playing", game: parse(gameState), color });
    });

    socketService.onError(({ message }) => {
      setErrorMsg(message);
    });

    return () => {
      socketService.offAll();
      socketService.disconnect();
    };
  }, []);

  const handleCreate = useCallback(() => {
    setErrorMsg(null);
    socketService.createGame();
  }, []);

  const handleJoin = useCallback(() => {
    setErrorMsg(null);
    if (!joinInput.trim()) return;
    setState({ phase: "joining" });
    socketService.joinGame(joinInput.trim());
  }, [joinInput]);

  if (state.phase === "playing") {
    return <Game board={state.game.board} viewpoint={state.color} turn={state.game.turn} mode="online" />;
  }

  return (
    <div className="lobby">
      <h2>Checkers Online</h2>
      {errorMsg && <p className="error">{errorMsg}</p>}

      {state.phase === "menu" && (
        <div>
          <button onClick={handleCreate}>Create Game</button>
          <div className="join-section">
            <input
              type="text"
              placeholder="Room code"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
            <button onClick={handleJoin}>Join Game</button>
          </div>
        </div>
      )}

      {state.phase === "waiting" && (
        <div>
          <p>Waiting for opponent...</p>
          <p className="room-code">Room code: <strong>{state.roomId}</strong></p>
          <p>Share this code with your opponent.</p>
        </div>
      )}

      {state.phase === "joining" && (
        <p>Joining game...</p>
      )}
    </div>
  );
}
