import { useState, useCallback, useEffect, useRef } from "react";
import * as socketService from "./socketService";
import { parse, startPosition } from "./checkersFEN";
import { Game } from "./ui";
import type { GameModel } from "./moveGenerator";
import type { LobbyRoom } from "../server/protocol";

function gameUrl(roomId: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set("room", roomId);
  return url.toString();
}

function setGameUrl(roomId: string): void {
  window.history.replaceState(null, "", gameUrl(roomId));
}

type LobbyState =
  | { phase: "menu" }
  | { phase: "offline" }
  | { phase: "waiting"; roomId: string }
  | { phase: "joining" }
  | { phase: "playing"; game: GameModel; color: "black" | "white" };

export function Lobby() {
  const [state, setState] = useState<LobbyState>({ phase: "menu" });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rooms, setRooms] = useState<LobbyRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const roomToJoin = useRef<string | null>(null);

  useEffect(() => {
    socketService.connect();

    socketService.onGameCreated(({ roomId }) => {
      setGameUrl(roomId);
      setState({ phase: "waiting", roomId });
    });

    socketService.onGameStart(({ gameState, color }) => {
      if (roomToJoin.current) {
        setGameUrl(roomToJoin.current);
        roomToJoin.current = null;
      }
      setState({ phase: "playing", game: parse(gameState), color });
    });

    socketService.onError(({ message }) => {
      setErrorMsg(message);
    });

    socketService.onLobbyUpdate(({ rooms: updatedRooms }) => {
      setRooms(updatedRooms);
    });

    const roomId = new URLSearchParams(window.location.search).get("room");
    if (roomId) {
      roomToJoin.current = roomId;
      setState({ phase: "joining" });
      socketService.joinGame(roomId);
    }

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleCreate = useCallback(() => {
    setErrorMsg(null);
    socketService.createGame();
  }, []);

  const handleJoin = useCallback(() => {
    setErrorMsg(null);
    if (!selectedRoomId) return;
    roomToJoin.current = selectedRoomId;
    setState({ phase: "joining" });
    socketService.joinGame(selectedRoomId);
  }, [selectedRoomId]);

  const handleCopyLink = useCallback(async (roomId: string) => {
    try {
      await navigator.clipboard.writeText(gameUrl(roomId));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, []);

  if (state.phase === "offline") {
    const initialGame = parse(startPosition);
    return <Game board={initialGame.board} viewpoint="black" turn={initialGame.turn} />;
  }

  if (state.phase === "playing") {
    return <Game board={state.game.board} viewpoint={state.color} turn={state.game.turn} mode="online" />;
  }

  const activeRooms = rooms.filter((r) => r.status === "waiting" || r.status === "playing");
  const finishedRooms = rooms.filter((r) => r.status === "finished");
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null;
  const canJoin = selectedRoom !== null && selectedRoom.status === "waiting";

  return (
    <div className="lobby">
      {errorMsg && <p className="error">{errorMsg}</p>}

      {(state.phase === "menu" || state.phase === "joining") && (
        <div>
          <div className="lobby-actions">
            <button onClick={handleCreate}>New Game</button>
            <button onClick={handleJoin} disabled={!canJoin}>
              Join Game
            </button>
            <button onClick={() => setState({ phase: "offline" })}>Play Offline</button>
          </div>

          <section className="lobby-section">
            <h3>Games in Progress</h3>
            {activeRooms.length === 0 ? (
              <p className="lobby-empty">No games available. Start a new one!</p>
            ) : (
              <ul className="room-list" role="listbox">
                {activeRooms.map((room) => (
                  <li
                    key={room.id}
                    role="option"
                    aria-selected={room.id === selectedRoomId}
                    className={
                      "room-item" +
                      (room.id === selectedRoomId ? " selected" : "") +
                      (room.status === "playing" ? " room-playing" : " room-waiting")
                    }
                    onClick={() =>
                      setSelectedRoomId(room.id === selectedRoomId ? null : room.id)
                    }
                  >
                    <span className="room-id">{room.id}</span>
                    <span className="room-status">
                      {room.status === "waiting" ? "Waiting for player" : "In progress"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {finishedRooms.length > 0 && (
            <section className="lobby-section">
              <h3>Finished Games</h3>
              <ul className="room-list room-list-finished">
                {finishedRooms.map((room) => (
                  <li key={room.id} className="room-item room-finished">
                    <span className="room-id">{room.id}</span>
                    <span className="room-status">Finished</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {state.phase === "waiting" && (
        <div>
          <p>Waiting for opponent...</p>
          <p className="room-code">Room code: <strong>{state.roomId}</strong></p>
          <p>Share this link with your opponent:</p>
          <div className="game-link">
            <input
              aria-label="Game link"
              readOnly
              value={gameUrl(state.roomId)}
              onFocus={(event) => event.currentTarget.select()}
            />
            <button onClick={() => void handleCopyLink(state.roomId)}>Copy link</button>
          </div>
          {copied && <p role="status">Link copied!</p>}
        </div>
      )}
    </div>
  );
}
