import MoveGenerator, {
  MoveKind,
  movesFrom,
  movePiece
} from "../src/moveGenerator";

export function coordinate(checkersCoordinate: number): number {
  if (!Number.isInteger(checkersCoordinate) || checkersCoordinate < 1 || checkersCoordinate > 32)
    throw Error(`Invalid checkers coordinate: ${checkersCoordinate}.`);
  return 65 - 2 * checkersCoordinate;
}

export { MoveGenerator, MoveKind, movesFrom, movePiece };
