---
name: TypeScript & Dependency Management
description: "Guidance for type safety, dependency updates, and contributing to this React checkers game project. Use when: adding features, updating dependencies, or contributing to the codebase."
---

# Checkers Project: TypeScript & Dependency Management

## Project Overview

- **Current Stack**: React 18 + Jest 30 + Webpack 5 + Babel 7 + TypeScript 5 (strict)
- **Type System**: TypeScript — migration from Flow completed April 2026
- **Structure**: Game engine (no AI) + React UI, fully tested (657 tests)

## Current Dependency Versions

All packages are up to date as of the TypeScript migration:

| Package | Version |
|---------|---------|
| `typescript` | ^5.3.3 |
| `react` / `react-dom` | ^18.2.0 |
| `webpack` / `webpack-cli` | ^5.101.0 / ^7.0.0 |
| `jest` / `ts-jest` | ^30.0.5 / ^29.1.1 |
| `prettier` | ^3.2.2 |
| `@babel/core` | ^7.28.0 |
| `fork-ts-checker-webpack-plugin` | ^9.0.2 |

## Dependency Management Guidelines

### Version Pinning Strategy
- **Patch updates** (`1.2.x`): Auto-merge, frequent
- **Minor updates** (`1.x.0`): Review, test before merge
- **Major updates** (`x.0.0`): Manual testing + integration tests required
- **Dev-only packages** (Babel, Webpack): Stable major versions preferred (Babel 7, Webpack 5)

### How to Update a Package
1. Check breaking changes: `npm view <package> CHANGELOG`
2. Update `package.json` with new version range
3. Run `npm install`
4. Run full test suite: `npm test && npm run build`
5. Check for deprecation warnings in install output

## Dependency Management Guidelines

### Version Pinning Strategy
- **Patch updates** (`1.2.x`): Auto-merge, frequent
- **Minor updates** (`1.x.0`): Review, test before merge
- **Major updates** (`x.0.0`): Manual testing + integration tests required
- **Dev-only packages** (Babel, Webpack): Stable major versions preferred (Babel 7 → stay, Webpack 5 → stable)

### How to Update a Package
1. Check breaking changes: `npm view <package> CHANGELOG`
2. Update `package.json` with new version range
3. Run `npm install` (creates new `package-lock.json`)
4. Run full test suite: `npm test && npm run build`
5. Check for deprecation warnings in install output

### CI/CD Integration
- GitHub Actions should run before merge:
  ```yaml
  - npm install
  - npm test
  - npm run build
  ```

## Build & Test Commands

```sh
# Full dev environment setup
npm install

# Development server (HMR, live reload)
npm start
# Opens http://localhost:8080

# Production build (minified)
npm run build
# Output: dist/checkers.bundle.js

# Run tests once
npm test

# Run tests with coverage
npm test -- --coverage
```

## Type Safety Conventions (Post-Migration)

1. **Strict mode required**: `"strict": true` in `tsconfig.json`
2. **No `any` type** unless unavoidable (document why)
3. **React components**: Use `React.FC<Props>` or function signatures with explicit prop types
4. **Props interfaces**: Define in same file, export for tests
5. **Game state types**: Defined and exported from `src/moveGenerator.ts`

### Example Pattern
```typescript
// src/moveGenerator.ts
export type PieceModel = {
  kind: "king" | "man";
  color: "white" | "black";
};

export type GameModel = {
  board: (PieceModel | null)[];
  secondMove?: number;
  turn: "black" | "white";
};
```

## File Structure

```
src/
├── checkers.tsx       # App entry point
├── checkers.css       # Styles
├── checkersFEN.ts     # FEN string parsing/unparsing
├── moveGenerator.ts   # Core game engine + exported types
└── ui.tsx             # React components (Piece, Square, Board, Game)

test/
├── __snapshots__/
├── checkersFEN.test.ts
├── moveGenerator.test.ts
├── perft.test.ts
└── ui.test.tsx
```

## Build & Test Commands

```sh
# Full dev environment setup
npm install

# Development server (HMR, live reload)
npm start
# Opens http://localhost:8080

# Production build (minified)
npm run build
# Output: dist/checkers.bundle.js

# Run tests once
npm test

# Run tests with coverage
npm test -- --coverage

# Type-check without emitting
npm run type-check
```

## CI/CD Integration
- GitHub Actions workflow at `.github/workflows/typescript-validation.yml`
- Runs on every push/PR: `npm install` → `npm test` → `npm run build`

## Related Resources

- [TypeScript Handbook: React](https://www.typescriptlang.org/docs/handbook/react.html)
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Jest + TypeScript Setup](https://jestjs.io/docs/getting-started#using-typescript)
- [Webpack + TypeScript](https://webpack.js.org/guides/typescript/)
