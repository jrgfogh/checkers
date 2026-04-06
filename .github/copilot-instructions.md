---
name: TypeScript Migration & Dependency Management
description: "Guidance for migrating from JavaScript/Flow to TypeScript and managing dependency versions in a React checkers game project. Use when: contributing to type safety improvements, updating dependencies, or migrating code to TypeScript."
---

# Checkers Project: TypeScript Migration & Dependency Management

## Project Overview

- **Current Stack**: React 18 + Jest + Webpack 5 + Babel 7 with Flow types
- **Type System**: Flow (static type checker) — **deprecated and abandoned**
- **Target**: TypeScript migration with modern tooling
- **Structure**: Game engine (no AI) + React UI, fully tested

## Dependency Status & Update Strategy

### Current Issues

1. **Flow is dead** — v0.101.1 (2019) → Migrate to TypeScript for type safety
2. **Mixed major versions** — Some packages far behind latest:
   - `@babel/preset-flow`: ^7.27.1 (becomes obsolete post-migration)
   - `webpack-cli`: ^6.0.1 (latest is ^7+)
   - `prettier`: ^1.19.1 (v2-3 available; config format changed)
   - `jest-each`: ^30.0.5 (aligned with Jest 30)
3. **Babel complexity** — `@babel/preset-flow` + loader chain can be simplified post-TS

### Upgrade Timeline (Phased)

#### Phase 1: Prepare for TypeScript (Before TS Activation)
- [ ] Update build tooling:
  - `webpack-cli`: ^6.0.1 → ^7.0.0 (latest stable, TS-compatible)
  - `@babel/core`, `@babel/cli`: ^7.28.0 → ^7.24+ (maintain 7.x, skip 8 for stability)
  - `prettier`: ^1.19.1 → ^3.2+ (simplify config, improve formatting)
- [ ] Fix `.babelrc` syntax (trailing comma) and remove Flow preset
- [ ] Install TypeScript & type definitions:
  ```json
  "@typescript-eslint/eslint-plugin": "^6.0"
  "@typescript-eslint/parser": "^6.0"
  "typescript": "^5.3+"
  "fork-ts-checker-webpack-plugin": "^9.0"
  ```
- [ ] Add `tsconfig.json` in root:
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "module": "ESNext",
      "jsx": "react-jsx",
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "strict": true,
      "moduleResolution": "bundler",
      "skipLibCheck": true,
      "allowSyntheticDefaultImports": true,
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "resolveJsonModule": true,
      "outDir": "./dist",
      "declarationMap": true,
      "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "coverage", "dist"]
  }
  ```

#### Phase 2: Migrate Source Code to TypeScript
- [ ] Rename files (gradual): `src/*.js` → `src/*.ts` / `src/*.tsx`
  - `checkers.js` → `checkers.tsx` (has JSX)
  - `ui.js` → `ui.tsx` (React components)
  - `checkersFEN.js` → `checkersFEN.ts` (utility functions)
  - `moveGenerator.js` → `moveGenerator.ts` (engine logic)
- [ ] Remove all `// @flow` comments and Flow type annotations
- [ ] Update type syntax: `type`, `interface`, props types
- [ ] Update Webpack config to resolve `.ts` / `.tsx`:
  ```js
  module: {
    rules: [{
      test: /\.[tj]sx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: { presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env'] }
    }]
  }
  ```

#### Phase 3: Update Tests & Tooling
- [ ] Migrate test files: `test/*.test.js` → `test/*.test.ts`
- [ ] Update Jest config to resolve TS:
  ```js
  module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testMatch: ['<rootDir>/test/**/*.test.ts']
  };
  ```
- [ ] Remove Flow type definitions (`flow-typed/`)
- [ ] Update `.babelrc` → `babel.config.js` with TS preset

#### Phase 4: Final Cleanup & Optimization
- [ ] Remove obsolete packages:
  - `flow-bin`, `flow-typed`, `@babel/preset-flow`, `babel-core` (bridge)
- [ ] Verify build & test pass: `npm test && npm run build`
- [ ] Add pre-commit hooks (optional):
  ```
  "husky": "^9.0"
  "lint-staged": "^15.0"
  ```
- [ ] Document in `CONTRIBUTING.md`: TS conventions, strict mode, no `any` without reason

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
3. **React components**: Use `React.FC<Props>` or function signatures
4. **Props interfaces**: Define in same file, export for tests
5. **Game state types**: Central `types/game.ts` for shared models

### Example Pattern
```typescript
// types/game.ts
export interface Board {
  squares: (Piece | null)[];
}

export interface Piece {
  owner: 'black' | 'white';
  isKing: boolean;
}

// src/moveGenerator.ts
import type { Board, Piece } from './types/game';

export function generateMoves(board: Board, from: number): number[] {
  // Type-safe implementation
}
```

## File Structure (Post-Migration)

```
src/
├── types/
│   └── game.ts           # Shared interfaces
├── engine/
│   ├── moveGenerator.ts
│   └── checkersFEN.ts
├── ui/
│   ├── Game.tsx          # Main component
│   └── index.tsx         # Re-exports
├── checkers.tsx          # Entry point (was .jsx)
└── checkers.css

test/
├── types/
├── engine/
│   ├── moveGenerator.test.ts
│   └── checkersFEN.test.ts
└── ui/
    └── ui.test.tsx
```

## Common Migration Pitfalls & Solutions

| Issue | Solution |
|-------|----------|
| Webpack can't resolve `.ts` files | Add `.ts` / `.tsx` to `resolve.extensions` |
| Jest fails on TS tests | Use `ts-jest` preset in Jest config |
| React types missing | Install `@types/react` + `@types/react-dom` |
| Build output has `.js` but need `.d.ts` | Add `"declaration": true` to `tsconfig.json` |
| Flow comments cause TS errors | Remove all `// @flow` and Flow type syntax |
| Circular imports (TS strict) | Reorganize imports, use barrel exports in `index.ts` |

## Related Resources

- [TypeScript Handbook: React](https://www.typescriptlang.org/docs/handbook/react.html)
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Jest + TypeScript Setup](https://jestjs.io/docs/getting-started#using-typescript)
- [Webpack + TypeScript](https://webpack.js.org/guides/typescript/)
- **This Project's CI**: [`.github/workflows/`](../.github/workflows/) — validate builds here

## Questions Before You Start

If migrating a specific file, consider:
1. Does it export or import Flow types? (Search `type` keyword)
2. Are there complex React patterns (Hooks, Context, HOCs)?
3. Are tests already comprehensive? (Reduces migration risk)
4. Any dynamic typing (`any` / `Object`) that needs typing?

Reach out in PRs with `[TypeScript]` prefix for migration-specific reviews.
