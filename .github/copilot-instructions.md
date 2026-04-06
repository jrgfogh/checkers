# Checkers Project

## Stack

- React 19 + TypeScript 6 (strict) + Jest 30 + Webpack 5 + Babel 7
- Express 5 + Socket.IO 4 for the multiplayer server
- Migration from Flow completed April 2026

## Build & Test

```sh
npm install              # install dependencies
npm start                # dev server at http://localhost:8080
npm run build            # production build → dist/checkers.bundle.js
npm test                 # run all tests
npm run type-check       # tsc --noEmit (client)
npm run type-check:server # tsc --noEmit (server)
npm run build:server     # compile server → dist-server/
npm run dev:server       # run server in dev mode (tsx)
```

## File Structure

```
src/
├── checkers.tsx       # entry point (createRoot)
├── checkersFEN.ts     # FEN parsing/unparsing
├── moveGenerator.ts   # game engine + exported types
├── ui.tsx             # Board + Game React components
├── lobby.tsx          # Lobby component (menu, create/join game flow)
├── socketService.ts   # Socket.IO client wrapper (singleton socket)
server/
├── index.ts           # Express + Socket.IO server entry point
├── protocol.ts        # Shared event type definitions (ClientToServerEvents, ServerToClientEvents)
├── gameRoom.ts        # RoomManager – in-memory game room management
├── socketHandlers.ts  # Socket event handlers (move validation, resign, disconnect, reconnect)
test/
├── checkersFEN.test.ts
├── moveGenerator.test.ts
├── perft.test.ts
├── ui.test.tsx
├── server/
│   ├── roomManager.test.ts
│   └── socketHandlers.test.ts
```

## Conventions

- `tsconfig.json` uses `"strict": true` — no redundant individual strict flags
- Game state types (`PieceModel`, `GameModel`) are defined and exported from `src/moveGenerator.ts`
- Tests use ts-jest with `tsconfig.test.json` (relaxes `noUnusedLocals`/`noUnusedParameters`)
- Webpack uses Babel for transpilation; `ForkTsCheckerWebpackPlugin` handles type-checking in parallel
- `socketService.ts` holds a singleton Socket.IO socket; all components share it

## Known Issues

- `socketService.offAll()` calls `socket.removeAllListeners()`, which removes **all** listeners on the shared socket — not just those registered by the calling component. If `Lobby` and `Game` both register listeners, one component's cleanup can destroy the other's listeners. Prefer scoped `socket.off(event, handler)` when adding new listener registrations.
