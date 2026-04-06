# Flow Type Analysis & TypeScript Migration Map

## Current Flow Types in Source

### moveGenerator.js

**Exported Types:**
```flow
export type PieceModel = {
    kind: "king" | "man";
    color: "white" | "black";
};

export type GameModel = {
    board: Array<?PieceModel>,
    secondMove?: number,
    turn : "black" | "white"
};
```

**Class Properties:**
```flow
class MoveGenerator {
    state: GameModel;
    history: (?PieceModel)[][];  // Array of nullable pieces
}
```

**Method Parameter & Return Types:**
- `movesFrom(square: number): number[]`
- `movesForKingFrom(square: number): number[]`
- `pushMainDiagonalForKing(square: number, moves: number[]): void`
- `canMove(piece: PieceModel): boolean`

### ui.js

**Exported Types:**
```flow
type PieceProps = PieceModel;

type SquareProps = {
  color: "white" | "black",
  selected: boolean,
  canMoveTo: boolean,
  piece?: ?PieceModel,  // Nullable optional
  turn: "white" | "black",
  onClick: () => void
};

type BoardProps = GameModel & {
  viewpoint : "black" | "white",
  movePiece: (from: number, to: number) => void
};
```

**React Hooks:**
```flow
useState<?number>(null)      // Nullable number state
useState<boolean[]>(Array(64).fill(false))  // Boolean array state
```

**Function Signatures:**
- `Piece(props: PieceModel)`
- `Square(props: SquareProps): ReactNode`
- `Board(props: BoardProps): ReactNode`
- Local functions with types: `moveSelectedTo(square: number): void`

### checkersFEN.js

**Function Types:**
```flow
function validateFen(fenString: string): void
function isOdd(n: number): boolean
function fenIndexToGameIndex(fenIndex): number  // Missing type annotation
function gameIndexToFenIndex(gameIndex): number // Missing type annotation
function parsePiece(board, color, fenPiece): void  // Missing param types
function parsePlayer(board, fenSegment): void  // Missing param types

export function parse(fenString: string): GameModel
export function unparse(gameState: GameModel): string
```

**Type Imports:**
```flow
import type { PieceModel, GameModel } from './moveGenerator';
```

---

## TypeScript Equivalents & Conversion Guide

### Flow → TypeScript Cheat Sheet

| Flow Syntax | TypeScript Equivalent | Notes |
|------------|----------------------|-------|
| `type Foo = {...}` | `type Foo = {...}` or `interface Foo {...}` | Use interface for objects, type for unions |
| `?Type` | `Type \| null` | Explicit null union |
| `?Type` (param) | `Type \| undefined` | In function params, usually means optional |
| `Array<T>` | `T[]` (preferred) or `Array<T>` | Both valid, prefer `T[]` |
| `(...args) => ReturnType` | `(...args) => ReturnType` | Same syntax |
| `void` | `void` | Same |
| Union `Type1 \| Type2` | `Type1 \| Type2` | Same syntax |
| Exact object `{&#124;..&#124;}` | Just `{...}` | TS doesn't have exact types |

### Recommended TypeScript Structure

#### Step 1: Create Central Type Definitions
**File:** `src/types/game.ts`
```typescript
export type PieceKind = 'king' | 'man';
export type Color = 'white' | 'black';

export interface Piece {
  kind: PieceKind;
  color: Color;
}

export interface GameState {
  board: (Piece | null)[];
  secondMove?: number;
  turn: Color;
}
```

#### Step 2: Update moveGenerator.ts
```typescript
import type { Piece, GameState, PieceKind, Color } from '../types/game';

export const MoveKind = {
  Simple: 0,
  Crowning: 1,
  Jump: 2
} as const;

export default class MoveGenerator {
  private state: GameState;
  private history: (Piece | null)[][];

  constructor(state: GameState) {
    this.state = state;
    this.history = [];
  }

  movesFrom(square: number): number[] {
    if (this.state.secondMove && this.state.secondMove !== square) {
      return [];
    }
    if (!this.state.board[square]) {
      throw new Error(`There is no piece in square ${square}`);
    }
    
    const piece = this.state.board[square];
    if (piece!.kind === 'king') {
      return this.movesForKingFrom(square);
    }
    if (this.state.turn === 'black') {
      return this.movesForBlackManFrom(square);
    }
    return this.movesForWhiteManFrom(square);
  }

  private movesForKingFrom(square: number): number[] {
    // ...
  }

  private canMove(piece: Piece): boolean {
    // ...
  }
}
```

#### Step 3: Update ui.tsx
```typescript
import React, { useState } from 'react';
import type { Piece, GameState, Color } from './types/game';

interface PieceProps {
  color: Color;
  kind: 'king' | 'man';
}

const Piece: React.FC<PieceProps> = ({ color, kind }) => (
  <div className={`piece ${color}-piece ${kind}`}>
    <div className="piece-center" />
  </div>
);

interface SquareProps {
  color: 'white' | 'black';
  selected: boolean;
  canMoveTo: boolean;
  piece?: Piece | null;
  turn: Color;
  onClick: () => void;
}

export const Square: React.FC<SquareProps> = ({
  color,
  selected,
  canMoveTo,
  piece,
  turn,
  onClick,
}) => {
  const squareClasses = ['square', color];
  if (selected) squareClasses.push('selected');
  
  let squareContent: React.ReactNode | undefined;
  if (canMoveTo && turn) {
    squareContent = <div className={`piece ghost-piece ${turn}-piece`} />;
    squareClasses.push('destination');
  } else if (piece) {
    squareContent = <Piece color={piece.color} kind={piece.kind} />;
  }

  return (
    <div
      role="button"
      className={squareClasses.join(' ')}
      onClick={onClick}
    >
      {squareContent}
    </div>
  );
};

interface BoardProps extends GameState {
  viewpoint: 'black' | 'white';
  movePiece: (from: number, to: number) => void;
}

export default function Board({
  board,
  turn,
  secondMove,
  viewpoint,
  movePiece,
}: BoardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [canMoveTo, setCanMoveTo] = useState<boolean[]>(
    Array(64).fill(false)
  );

  const moveSelectedTo = (square: number): void => {
    if (selected === null) {
      throw new Error('This line should be unreachable!');
    }
    movePiece(selected, square);
  };

  // Rest of component...
}
```

#### Step 4: Update checkersFEN.ts
```typescript
import type { Piece, GameState, Color, PieceKind } from './types/game';

function validateFen(fenString: string): void {
  if (fenString === '') {
    throw new Error(
      'Invalid checkers FEN string: ""\nThe string is too short.'
    );
  }
  if (fenString[0] !== 'B' && fenString[0] !== 'W') {
    throw new Error(
      `Invalid checkers FEN string: "${fenString}"\n` +
      `The turn must be either "W" or "B", not "${fenString[0]}".`
    );
  }
}

function isOdd(n: number): boolean {
  return (n & 0x1) === 1;
}

function fenIndexToGameIndex(fenIndex: number): number {
  const fenRow = Math.floor((fenIndex - 1) / 4);
  return isOdd(fenRow) ? 65 - 2 * fenIndex : 64 - 2 * fenIndex;
}

function gameIndexToFenIndex(gameIndex: number): number {
  return Math.floor((65 - gameIndex) / 2);
}

function parsePiece(
  board: (Piece | null)[],
  color: Color,
  fenPiece: string
): void {
  let kind: PieceKind;
  let fenIndex: number;
  
  if (fenPiece[0] === 'K') {
    fenIndex = parseInt(fenPiece.substring(1), 10);
    kind = 'king';
  } else {
    fenIndex = parseInt(fenPiece, 10);
    kind = 'man';
  }
  
  board[fenIndexToGameIndex(fenIndex)] = { color, kind };
}

function parsePlayer(board: (Piece | null)[], fenSegment: string): void {
  const color: Color = fenSegment[0] === 'W' ? 'white' : 'black';
  if (fenSegment.length > 1) {
    const fenPieces = fenSegment.substring(1).split(',');
    for (const fenPiece of fenPieces) {
      parsePiece(board, color, fenPiece);
    }
  }
}

export function parse(fenString: string): GameState {
  validateFen(fenString);

  const board: (Piece | null)[] = Array(64).fill(null);
  for (const fenSegment of fenString.split(':')) {
    parsePlayer(board, fenSegment);
  }

  const turn: Color = fenString[0] === 'W' ? 'white' : 'black';
  return {
    board,
    turn,
  };
}

export function unparse(gameState: GameState): string {
  const whitePieces: string[] = [];
  const blackPieces: string[] = [];

  for (let i = 63; i >= 0; i--) {
    const piece = gameState.board[i];
    if (piece !== null) {
      const fenIndex = gameIndexToFenIndex(i);
      const fenPiece = piece.kind === 'king' ? `K${fenIndex}` : `${fenIndex}`;
      
      if (piece.color === 'white') {
        whitePieces.push(fenPiece);
      } else {
        blackPieces.push(fenPiece);
      }
    }
  }

  return `W:W${whitePieces.join(',')},B${blackPieces.join(',')}`;
}

export const startPosition =
  'B:W1,2,3,4,5,6,7,8,9,10,11,12:B21,22,23,24,25,26,27,28,29,30,31,32';
```

---

## Migration Checklist

- [ ] Create `src/types/game.ts` with centralized type definitions
- [ ] Install TypeScript & type definitions:
  ```bash
  npm install --save-dev typescript ts-jest @types/react @types/react-dom
  ```
- [ ] Create `tsconfig.json` (already created)
- [ ] Fix `.babelrc` (already done)
- [ ] Update `webpack.config.js` to resolve `.ts/.tsx`
- [ ] Rename files gradually:
  - [ ] `src/moveGenerator.js` → `moveGenerator.ts`
  - [ ] `src/checkersFEN.js` → `checkersFEN.ts`
  - [ ] `src/ui.js` → `ui.tsx`
  - [ ] `src/checkers.js` → `checkers.tsx`
- [ ] Convert test files to TypeScript
- [ ] Update Jest config to use `ts-jest`
- [ ] Remove Flow-related packages:
  - [ ] `flow-bin`
  - [ ] `flow-typed`
  - [ ] `.flowconfig`
  - [ ] `flow-typed/` directory
- [ ] Verify build and tests pass

---

## Common TypeScript Patterns for This Codebase

### Nullable State in React
```typescript
// Flow: useState<?number>(null)
// TypeScript:
const [selected, setSelected] = useState<number | null>(null);
```

### Union Types (Color, PieceKind)
```typescript
// Define once, reuse everywhere
type Color = 'white' | 'black';
type PieceKind = 'king' | 'man';

// In functions
function getPieceColor(piece: Piece): Color {
  return piece.color;
}
```

### Array Types
```typescript
// Flow: Array<?PieceModel> or Array<GameModel>
// TypeScript:
const board: (Piece | null)[] = [];
const history: GameState[] = [];
```

### Function Types
```typescript
// In props/callbacks
interface GameProps {
  onMove: (from: number, to: number) => void;
  onGameEnd?: (winner: Color) => void;
}
```

### React Component Props
```typescript
// Preferred pattern
interface ComponentProps {
  prop1: string;
  prop2?: number;
  onClick: () => void;
}

export function Component({ prop1, prop2, onClick }: ComponentProps) {
  // Implementation
}
```
