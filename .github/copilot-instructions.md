# Checkers Project

## Stack

- React 19 + TypeScript 6 (strict) + Jest 30 + Webpack 5 + Babel 7
- Migration from Flow completed April 2026

## Build & Test

```sh
npm install        # install dependencies
npm start          # dev server at http://localhost:8080
npm run build      # production build ? dist/checkers.bundle.js
npm test           # run all tests (657)
npm run type-check # tsc without emit
```

## File Structure

```
src/
+-- checkers.tsx       # entry point (createRoot)
+-- checkersFEN.ts     # FEN parsing/unparsing
+-- moveGenerator.ts   # game engine + exported types
+-- ui.tsx             # React components
test/
+-- checkersFEN.test.ts
+-- moveGenerator.test.ts
+-- perft.test.ts
+-- ui.test.tsx
```

## Conventions

- `tsconfig.json` uses `"strict": true` — no redundant individual strict flags
- Game state types (`PieceModel`, `GameModel`) are defined and exported from `src/moveGenerator.ts`
- Tests use ts-jest with `tsconfig.test.json` (relaxes `noUnusedLocals`/`noUnusedParameters`)
- Webpack uses Babel for transpilation; `ForkTsCheckerWebpackPlugin` handles type-checking in parallel
