import InternalMoveGenerator, {
  MoveKind,
  movesFrom as internalMovesFrom,
  movePiece as internalMovePiece
} from "../src/moveGenerator";

import type { GameModel } from "../src/moveGenerator";

type CoordinateGameModel = Omit<GameModel, "board" | "secondMove"> & {
  board: (GameModel["board"][number])[];
  secondMove?: number;
};

function toBoardIndex(square: number): number {
  if (!Number.isInteger(square) || square < 1 || square > 32)
    throw Error(`Invalid checker square: ${square}.`);
  const offset = 32 - square;
  const row = Math.floor(offset / 4);
  const column = (row % 2 === 0 ? 1 : 0) + 2 * (offset % 4);
  return row * 8 + column;
}

function toCheckersCoordinate(square: number): number {
  return Math.floor((65 - square) / 2);
}

function toInternalState(state: CoordinateGameModel): GameModel {
  const board: GameModel["board"] = Array(64).fill(null);
  for (let square = 1; square <= 32; square++)
    board[toBoardIndex(square)] = state.board[square];
  return {
    board,
    turn: state.turn,
    ...(state.secondMove === undefined ? {} : { secondMove: toBoardIndex(state.secondMove) })
  };
}

function syncState(state: CoordinateGameModel, internalState: GameModel): void {
  for (let square = 1; square <= 32; square++)
    state.board[square] = internalState.board[toBoardIndex(square)];
  state.turn = internalState.turn;
  state.secondMove = internalState.secondMove === undefined
    ? undefined
    : toCheckersCoordinate(internalState.secondMove);
}

function toCheckersMoves(moves: number[]): number[] {
  return moves.map((move, index) => index % 2 === 0 ? toCheckersCoordinate(move) : move);
}

export function squareAt(square: number, rowOffset: number, columnOffset: number): number {
  const index = toBoardIndex(square);
  const row = Math.floor(index / 8) + rowOffset;
  const column = (index % 8) + columnOffset;
  if (row < 0 || row > 7 || column < 0 || column > 7)
    throw Error(`Square offset is outside the board: ${square}, ${rowOffset}, ${columnOffset}.`);
  return toCheckersCoordinate(row * 8 + column);
}

export default class MoveGenerator {
  readonly state: CoordinateGameModel;
  private readonly generator: InternalMoveGenerator;

  constructor(state: CoordinateGameModel) {
    this.state = state;
    this.generator = new InternalMoveGenerator(toInternalState(state));
  }

  movesFrom(square: number): number[] {
    return toCheckersMoves(this.generator.movesFrom(toBoardIndex(square)));
  }

  movePiece(from: number, to: number, moveKind: number): void {
    this.generator.movePiece(toBoardIndex(from), toBoardIndex(to), moveKind);
    syncState(this.state, this.generator.state);
  }

  undoMove(): void {
    this.generator.undoMove();
    syncState(this.state, this.generator.state);
  }
}

export function movesFrom(state: CoordinateGameModel, from: number): number[] {
  return toCheckersMoves(internalMovesFrom(toInternalState(state), toBoardIndex(from)));
}

export function movePiece(state: CoordinateGameModel, from: number, to: number): CoordinateGameModel {
  const internalState = toInternalState(state);
  const result = internalMovePiece(internalState, toBoardIndex(from), toBoardIndex(to));
  const coordinateBoard = Array(33).fill(null);
  const coordinateState: CoordinateGameModel = {
    board: coordinateBoard,
    turn: result.turn,
    ...(result.secondMove === undefined ? {} : { secondMove: toCheckersCoordinate(result.secondMove) })
  };
  syncState(coordinateState, result);
  return coordinateState;
}

export { MoveKind };
