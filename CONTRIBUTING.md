# Contributing to Checkers

Thank you for your interest in contributing to the Checkers project! This guide covers development setup, TypeScript conventions, and the migration from Flow to TypeScript.

## Development Setup

### Prerequisites
- Node.js 16+ (LTS recommended)
- npm 7+

### Initial Setup
```sh
npm install
npm start  # Start dev server with hot reload on http://localhost:8080
```

### Available Commands
```sh
npm test              # Run Jest test suite
npm test -- --coverage  # Run tests with coverage report
npm run build         # Production build to dist/
npm start             # Development server with HMR
```

## TypeScript Migration Status

We are migrating from [Flow](https://flow.org/) to [TypeScript](https://www.typescriptlang.org/). Flow is no longer maintained (last update 2019), and TypeScript provides better tooling, community support, and IDE integration.

### Current Phase: 1 (Prepare for TypeScript)
See [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for the full 4-phase migration plan.

### TypeScript Conventions (Post-Migration)

#### Strict Mode Required
All code must follow TypeScript strict mode:
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

#### No `any` Type Without Justification
```typescript
// ❌ BAD
const value: any = getData();

// ✅ GOOD
interface GameData {
  board: Board;
  turn: 'white' | 'black';
}
const value: GameData = getData();

// ✅ OK ONLY if truly necessary (comment required)
// @ts-expect-error - External library lacks types
const legacy: any = externalLib.getValue();
```

#### React Components
Use explicit function signatures or `React.FC`:
```typescript
// ✅ PREFERRED: Explicit function signature
interface SquareProps {
  color: 'white' | 'black';
  selected: boolean;
  onClick: () => void;
}

export function Square({ color, selected, onClick }: SquareProps) {
  return <div className={`square ${color}`} onClick={onClick} />;
}

// ✅ ALTERNATIVE: React.FC with Props interface
export const Square: React.FC<SquareProps> = ({ color, selected, onClick }) => (
  <div className={`square ${color}`} onClick={onClick} />
);
```

#### Shared Type Definitions
Define game domain types in a central location:
```typescript
// src/types/game.ts
export interface Piece {
  owner: 'black' | 'white';
  isKing: boolean;
}

export interface Board {
  squares: (Piece | null)[];
}

export interface GameState {
  board: Board;
  turn: 'black' | 'white';
  secondMove?: number;
}

// src/engine/moveGenerator.ts
import type { Board, Piece, GameState } from '../types/game';

export function generateMoves(board: Board, from: number): number[] {
  // Implementation with full type safety
}
```

#### Props Type Naming
- Append `Props` suffix: `SquareProps`, `BoardProps`, `GameProps`
- Export interfaces used by tests or other modules
- Keep props type definition in same file as component

```typescript
export interface GameProps {
  board: Board;
  turn: 'white' | 'black';
  onMove: (from: number, to: number) => void;
}

export function Game({ board, turn, onMove }: GameProps) {
  // Component code
}
```

## Code Quality Standards

### Testing
- New features require accompanying unit tests
- Game engine logic must have 100% test coverage
- Tests use Jest + @testing-library/react for components

### Type Safety
- No disabling `strict` mode checks without team discussion
- Prefer **type narrowing** over type assertions:
  ```typescript
  // ❌ BAD
  const piece = board[index] as Piece;

  // ✅ GOOD
  const piece = board[index];
  if (piece && piece.isKing) {
    // piece is narrowed to Piece type here
  }
  ```

### Formatting
- Run `npm run format` (Prettier v3+) before committing
- 2-space indentation
- Single quotes in strings where possible
- Max line length: 100 characters (soft limit)

## File Structure

```
src/
├── types/
│   └── game.ts                 # Shared game domain types
├── engine/
│   ├── moveGenerator.ts        # Game move logic
│   └── checkersFEN.ts          # FEN parsing/serialization
├── ui/
│   ├── Game.tsx                # Main React component
│   ├── Board.tsx               # Board display
│   ├── Square.tsx              # Square component
│   └── index.ts                # Re-exports
├── checkers.tsx                # Entry point (was checkers.js)
└── checkers.css

test/
├── engine/
│   ├── moveGenerator.test.ts
│   └── checkersFEN.test.ts
└── ui/
    ├── Game.test.tsx
    └── ui.test.tsx
```

## Pull Request Guidelines

### Before Submitting
1. Run `npm test` — all tests must pass
2. Run `npm run build` — production build must succeed
3. Check `npm run type-check` (TypeScript validation)
4. Update `test/__snapshots__/` if UI changes
5. Add/update tests for new functionality

### PR Title Format
- Feature: `[Feature] Add <description>`
- Fix: `[Fix] Resolve <description>`
- TypeScript migration: `[TypeScript] Migrate <file.js>`
- Dependency update: `[Deps] Update <package-name>`
- Documentation: `[Docs] <description>`

### PR Description Template
```markdown
## Description
Brief explanation of changes and why they're needed.

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] TypeScript migration
- [ ] Dependency update
- [ ] Documentation

## Testing
How to verify the changes work:
- [ ] Unit tests added/updated
- [ ] Game scenarios tested manually
- [ ] Build and test suite pass

## Related Issues
Fixes #(issue number) or Relates to #(issue number)
```

## TypeScript Migration Help

**When migrating a file to TypeScript:**

1. **Check for Flow types** (search `type` keyword in file)
2. **Convert types to TypeScript syntax**:
   - `type` → `type` or `interface`
   - `?Type` → `Type | null`
   - `Type[]` stays as-is
   - Function types: `(a: string) => number`
3. **Remove `// @flow` comment**
4. **Update imports**: Remove Flow type imports, use TypeScript `import type`
5. **Test thoroughly** before merging

Example conversion:
```javascript
// BEFORE (Flow)
// @flow
import type { GameModel } from './moveGenerator';

type BoardProps = {|
  game: GameModel,
  onMove: (number, number) => void
|};

export function Board(props: BoardProps) {
  // ...
}
```

```typescript
// AFTER (TypeScript)
import type { GameModel } from './moveGenerator';

interface BoardProps {
  game: GameModel;
  onMove: (from: number, to: number) => void;
}

export function Board({ game, onMove }: BoardProps) {
  // ...
}
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Jest Testing TypeScript](https://jestjs.io/docs/getting-started#using-typescript)
- [Project TypeScript Migration Guide](.github/copilot-instructions.md)

## Questions?

Open an issue or discussion in the [GitHub repository](https://github.com/jrgfogh/checkers).
