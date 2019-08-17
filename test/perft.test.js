// @flow

import each from 'jest-each';

import MoveGenerator, { MoveKind, movesFrom, movePiece } from '../src/moveGenerator';
import type { GameModel } from '../src/moveGenerator';

import { parse, startPosition } from "../src/checkersFEN";

function perft(state: GameModel, depth: number) {
    if (depth == 0)
        return 1;
    var result = 0;
    for (var square = 0; square < 64; square++) {
        if (state.board[square] && state.board[square].color === state.turn) {
            const moves = movesFrom(state, square);
            for (var i = 0; i < moves.length; i += 2) {
                const nextState = movePiece(state, square, moves[i]);
                if (nextState.turn != state.turn)
                    result += perft(nextState, depth - 1);
                else
                    result += perft(nextState, depth);
            }
        }
    }
    return result;
}

function divide(startState: GameModel, depth: number): number[] {
    const result = [];
    var i = 0;
    for (var square = 0; square < 64; square++) {
        if (startState.board[square] && startState.board[square].color === startState.turn) {
            const moves = movesFrom(startState, square);
            if (depth > 1)
                for (var i = 0; i < moves.length; i += 2)
                    result.push(perft(movePiece(startState, square, moves[i]), depth - 1));
        }
    }
    return result;
}

const startState = parse(startPosition);

describe("perft", () => {
    each([[7, 1],
          [49, 2],
          [302, 3],
          [1469, 4],
          [7361, 5],
          [36768, 6],
        // NOTE(jorgen.fogh): Running these will take a long time:
        // [179740, 7],
        // [845931, 8],
        // [3963680, 9],
        // [18391564, 10],
        // [85242128, 11],
        // [388623673, 12]
          ]).it("should return %d at depth %d from the start position", (expected: number, depth: number) => {
        expect(perft(startState, depth)).toBe(expected);
    });
});

describe("divide", () => {
    each([[[7, 7, 7, 7, 7, 7, 7], 2],
          [[40, 48, 40, 40, 47, 40, 47], 3],
          [[858, 1345, 918, 874, 1299, 860, 1207], 5],
          [[4133, 6638, 4659, 4265, 6805, 4289, 5979], 6],
          [[19933, 31825, 22848, 20647, 33918, 20633, 29936], 7],
        // NOTE(jorgen.fogh): Running these will take a long time:
        // [179740, 7],
        // [845931, 8],
        // [3963680, 9],
        // [18391564, 10],
        // [85242128, 11],
        // [388623673, 12]
          ]).it("should return %d at depth %d", (expected: number[], depth: number) => {
        expect(divide(startState, depth)).toEqual(expected);
    });
});