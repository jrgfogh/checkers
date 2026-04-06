# Multiplayer Protocol

The checkers multiplayer server uses [Socket.IO](https://socket.io/) over WebSockets. All game state is managed server-side; the server validates every move before broadcasting it.

Board squares are numbered 0–63 (row-major, top-left = 0). Game state is exchanged as a [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)-like string produced by `checkersFEN.ts`.

## Game Lifecycle

### 1. Creating a Game

The first player (who will play **black**) sends:

| Direction | Event | Payload |
|-----------|-------|---------|
| Client → Server | `create-game` | *(none)* |
| Server → Client | `game-created` | `{ roomId: string, color: "black" }` |

The server creates a room in `"waiting"` status and returns a 6-character room ID that the player can share with an opponent.

### 2. Joining a Game

The second player (who will play **white**) sends:

| Direction | Event | Payload |
|-----------|-------|---------|
| Client → Server | `join-game` | `{ roomId: string }` |
| Server → Both | `game-start` | `{ gameState: string, color: "black" \| "white" }` |

The room ID is case-insensitive. On success, the server moves the room to `"playing"` status and sends `game-start` to **both** players. Each player's payload contains their assigned color and the initial board state as a FEN string.

### 3. Making a Move

On each turn the active player sends:

| Direction | Event | Payload |
|-----------|-------|---------|
| Client → Server | `move` | `{ from: number, to: number }` |
| Server → Mover | `move-accepted` | `{ from: number, to: number, gameState: string }` |
| Server → Opponent | `opponent-moved` | `{ from: number, to: number, gameState: string }` |

The server validates:
- The `from` and `to` squares are integers in 0–63.
- There is an active game for this socket.
- It is the sender's turn.
- The piece at `from` belongs to the sender.
- The move is legal according to the game engine.

If any check fails, the server replies with an `error` event (see below). If the move is legal, the server updates its authoritative game state and sends the resulting FEN to both players via separate events.

### 4. Resigning

| Direction | Event | Payload |
|-----------|-------|---------|
| Client → Server | `resign` | *(none)* |
| Server → Both | `game-over` | `{ winner: "black" \| "white", reason: "resignation" }` |

The room moves to `"finished"` status.

### 5. Disconnection

When a player's socket disconnects during an active game:

| Direction | Event | Payload |
|-----------|-------|---------|
| Server → Opponent | `opponent-disconnected` | *(none)* |

The server starts a **60-second** reconnection grace period. If the disconnected player does not reconnect in time:

| Direction | Event | Payload |
|-----------|-------|---------|
| Server → Both | `game-over` | `{ winner: "black" \| "white", reason: "disconnect timeout" }` |

If a player disconnects from a `"waiting"` room (before an opponent joins), the room is removed immediately.

## Error Handling

Any invalid action results in:

| Direction | Event | Payload |
|-----------|-------|---------|
| Server → Client | `error` | `{ message: string }` |

Common error messages:

| Situation | Message |
|-----------|---------|
| Player already in a game | `"You are already in a game."` |
| Bad room ID format | `"Invalid room ID."` |
| Room not found or full | `"Room not found or already full."` |
| Bad move payload | `"Invalid move payload."` |
| No active game | `"No active game."` |
| Out-of-turn move | `"Not your turn."` |
| Wrong piece | `"Not your piece."` |
| Illegal move | `"Illegal move."` |

## Room Housekeeping

- Rooms that have had no activity for **30 minutes** are automatically cleaned up.
- Room IDs use the characters `A-Z` (excluding I and O) and `2-9` (excluding 0 and 1) to avoid ambiguity.
