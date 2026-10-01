import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import MoveGenerator, {
  MoveKind,
  movesFrom as rawMovesFrom,
  movePiece as rawMovePiece
} from "../src/moveGenerator";

import type { GameModel } from "../src/moveGenerator";

type LoggedSquare = {
  boardIndex: number;
  checkersCoordinate: number | null;
};

const coordinateLogPath =
  process.env.CHECKERS_TEST_COORDINATE_LOG_PATH ??
  path.join(
    os.tmpdir(),
    `checkers-test-coordinates-${process.pid}-${process.env.JEST_WORKER_ID ?? "0"}.ndjson`
  );

function currentTestName(): string {
  return expect.getState().currentTestName ?? "unknown test";
}

function isPlayableSquare(square: number): boolean {
  return square >= 0 && square < 64 && ((Math.floor(square / 8) + square) & 0x1) === 1;
}

function toCheckersCoordinate(square: number): number | null {
  if (!isPlayableSquare(square))
    return null;
  return Math.floor((65 - square) / 2);
}

function logSquare(square: number): LoggedSquare {
  return {
    boardIndex: square,
    checkersCoordinate: toCheckersCoordinate(square)
  };
}

function logMoves(moves: number[]) {
  const result: { destination: LoggedSquare; moveKind: number }[] = [];
  for (let i = 0; i < moves.length; i += 2)
    result.push({
      destination: logSquare(moves[i]),
      moveKind: moves[i + 1]
    });
  return result;
}

function appendCoordinateLog(entry: object): void {
  try {
    fs.appendFileSync(coordinateLogPath, JSON.stringify(entry) + "\n");
  } catch {
    // Logging is best-effort and must not break the tests.
  }
}

export default class LoggedMoveGenerator extends MoveGenerator {
  override movesFrom(square: number): number[] {
    const moves = super.movesFrom(square);
    appendCoordinateLog({
      testName: currentTestName(),
      api: "MoveGenerator.movesFrom",
      source: logSquare(square),
      moves: logMoves(moves)
    });
    return moves;
  }

  override movePiece(from: number, to: number, moveKind: number): void {
    appendCoordinateLog({
      testName: currentTestName(),
      api: "MoveGenerator.movePiece",
      from: logSquare(from),
      to: logSquare(to),
      moveKind
    });
    super.movePiece(from, to, moveKind);
  }
}

export function movesFrom(state: GameModel, from: number): number[] {
  const moves = rawMovesFrom(state, from);
  appendCoordinateLog({
    testName: currentTestName(),
    api: "movesFrom",
    source: logSquare(from),
    moves: logMoves(moves)
  });
  return moves;
}

export function movePiece(state: GameModel, from: number, to: number): GameModel {
  appendCoordinateLog({
    testName: currentTestName(),
    api: "movePiece",
    from: logSquare(from),
    to: logSquare(to)
  });
  return rawMovePiece(state, from, to);
}

export { MoveKind, coordinateLogPath };
