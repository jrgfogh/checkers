// @flow

import each from 'jest-each';

import MoveGenerator, { MoveKind, movesFrom, movePiece } from '../src/moveGenerator';
import type { GameModel } from '../src/moveGenerator';

import { parse } from "../src/checkersFEN";

function perftState(state: GameModel, depth: number) {
    if (depth === 0)
        return 1;
    var result = 0;
    for (var square = 0; square < 64; square++) {
        if (state.board[square] && state.board[square].color === state.turn) {
            const moves = movesFrom(state, square);
            for (var i = 0; i < moves.length; i += 2) {
                const nextState = movePiece(state, square, moves[i]);
                result += perftState(nextState, depth - 1);
            }
        }
    }
    return result;
}

function perft(depth: number): number {
    const board = parse(
        ".m.m.m.m" +
        "m.m.m.m." +
        ".m.m.m.m" +
        "........" +
        "........" +
        "M.M.M.M." +
        ".M.M.M.M" +
        "M.M.M.M." +
        " w").pieces;
    return perftState({ board: board, turn: "black" }, depth);
}

describe("perft", () => {
    each([[7, 1],
          [49, 2],
          [302, 3],
          [1469, 4],
          [7361, 5],
          [36768, 6],
        // [179740, 7],
        // [845931, 8],
        // [3963680, 9],
        // [18391564, 10],
        // [85242128, 11],
        // [388623673, 12]
          ]).it("should return %d at depth %d", (expected: number, depth: number) => {
        expect(perft(depth)).toBe(expected);
    });
});