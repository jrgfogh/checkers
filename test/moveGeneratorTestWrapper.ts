import MoveGenerator, {
  MoveKind,
  movesFrom,
  movePiece
} from "../src/moveGenerator";

export function coordinate(checkersCoordinate: number): number {
  if (!Number.isInteger(checkersCoordinate) || checkersCoordinate < 1 || checkersCoordinate > 32)
    throw Error(`Invalid checkers coordinate: ${checkersCoordinate}.`);
  const offset = 32 - checkersCoordinate;
  const row = Math.floor(offset / 4);
  return row * 8 + (row % 2 === 0 ? 1 : 0) + 2 * (offset % 4);
}

export default MoveGenerator;
export { MoveGenerator, MoveKind, movesFrom, movePiece };
