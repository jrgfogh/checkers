import each from 'jest-each';

import MoveGenerator, { MoveKind, movesFrom, movePiece } from '../src/moveGenerator';

const emptyBoard = Array(64).fill(null)
const rowLength = 8

describe("Move Generator", () => {
    it("should require a board", () => {
        expect(() => new MoveGenerator(null, "white")).toThrowError("A valid board state is required.")
    })

    describe("Black man", () => {
        describe("Simple moves", () => {
            each([9, 10, 11, 12, 13, 14]).it("should generate two simple moves for unobstructed at square %d", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Simple,
                    square + rowLength - 1, MoveKind.Simple
                ])
            })

            each([0, 8, 16, 24, 32, 40]).it("should generate one simple move for unobstructed at square %d", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Simple
                ])
            })

            each([7, 15, 23, 31, 39, 47]).it("should generate one simple move for unobstructed at square %d", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength - 1, MoveKind.Simple
                ])
            })

            each([49, 50, 51, 52, 53, 54]).it("should generate two crowning move for unobstructed at square %d", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Crowning,
                    square + rowLength - 1, MoveKind.Crowning
                ])
            })

            each([48]).it("should generate one crowning move for unobstructed at square %d", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Crowning
                ])
            })

            each([55]).it("should generate one crowning move for unobstructed at square %d", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength - 1, MoveKind.Crowning
                ])
            })

            each([0, 48]).it("should generate no moves for obstructed at square %d", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([])
            })

            each([7, 55]).it("should generate no moves for obstructed at square %d", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([])
            })
        })

        describe("Jumps", () => {
            each([2, 20, 45]).it("should generate two jumps from square %d when possible", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength - 1] = { color: "white", kind: "man" }
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + 2 * (rowLength - 1), MoveKind.Jump,
                    square + 2 * (rowLength + 1), MoveKind.Jump
                ]);
            });

            each([0, 8, 16, 24, 32, 40]).it("should generate one jump from square %d when possible", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + 2 * (rowLength + 1), MoveKind.Jump
                ]);
            });

            each([7, 15, 23, 31, 39, 47]).it("should generate one jump from square %d when possible", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength - 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + 2 * (rowLength - 1), MoveKind.Jump
                ]);
            });


            each([0]).it("should not generate ane jumps from square %d when obstructed", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                board[square + 2 * (rowLength + 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });
        })
    })

    describe("White man", () => {
        each([49, 50, 51, 52, 53, 54]).it("should generate two simple moves for unobstructed at square %d", (square) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            const generator = new MoveGenerator(board)

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Simple,
                square - rowLength - 1, MoveKind.Simple
            ])
        })

        each([23, 31, 39, 47, 55, 63]).it("should generate one simple move for unobstructed at square %d", (square) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            const generator = new MoveGenerator(board)

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength - 1, MoveKind.Simple
            ])
        })

        each([16, 24, 32, 40, 48, 56]).it("should generate one simple move for unobstructed at square %d", (square) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            const generator = new MoveGenerator(board)

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Simple
            ])
        })

        each([9, 10, 11, 12, 13, 14]).it("should generate two crowning move for unobstructed at square %d", (square) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            const generator = new MoveGenerator(board)

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Crowning,
                square - rowLength - 1, MoveKind.Crowning
            ])
        })

        each([8]).it("should generate one crowning move for unobstructed at square %d", (square) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            const generator = new MoveGenerator(board)

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Crowning
            ])
        })

        each([15]).it("should generate one crowning move for unobstructed at square %d", (square) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            const generator = new MoveGenerator(board)

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength - 1, MoveKind.Crowning
            ])
        })

        each([63]).it("should generate no moves for obstructed at square %d", (square) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[square - rowLength - 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator(board)

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([])
        })

        each([56]).it("should generate no moves for obstructed at square %d", (square) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[square - rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator(board)

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([])
        })
    })


    describe("King", () => {
        describe("Main diagonal", () => {
            each("white", "black").it("should generate 7 diagonal simple moves for %s king in square 0", (color) => {
                const board = emptyBoard.slice()
                board[0] = { color: color, kind: "king" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(0);
                const expected = [];
                for (let i = 0; i < 7; i++)
                    expected.push(0 + (rowLength + 1) * (i + 1), MoveKind.Simple);
                expect(moves).toEqual(expected);
            })

            it("should generate 7 diagonal simple moves for king in square 63", () => {
                const board = emptyBoard.slice()
                board[63] = { color: "black", kind: "king" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(63);
                const expected = [];
                for (let i = 0; i < 7; i++)
                    expected.push(63 - (rowLength + 1) * (i + 1), MoveKind.Simple);
                expect(moves).toEqual(expected);
            })

            each([1, 2, 3, 4, 5, 6, 7]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "king" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)
                const expected = [];
                for (let i = 0; i < 7 - square; i++)
                    expected.push(square + (rowLength + 1) * (i + 1), MoveKind.Simple);
                expect(moves).toEqual(expected);
            })

            each([10]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    1, MoveKind.Simple,
                    19, MoveKind.Simple,
                    28, MoveKind.Simple,
                    37, MoveKind.Simple,
                    46, MoveKind.Simple,
                    55, MoveKind.Simple
                ]);
            })

            each([20]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    11, MoveKind.Simple,
                    2, MoveKind.Simple,
                    29, MoveKind.Simple,
                    38, MoveKind.Simple,
                    47, MoveKind.Simple
                ]);
            })

            each([33]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    24, MoveKind.Simple,
                    42, MoveKind.Simple,
                    51, MoveKind.Simple,
                    60, MoveKind.Simple
                ]);
            })

            it("should generate no moves for completely obstructed king in cell 0", () => {
                const board = emptyBoard.slice()
                board[0] = { color: "white", kind: "king" }
                board[0 + rowLength + 1] = { color: "black", kind: "man" }
                board[0 + 2 * (rowLength + 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(0)
                expect(moves).toEqual([]);
            })

            it("should generate no moves for completely obstructed king in cell 63", () => {
                const board = emptyBoard.slice()
                board[63] = { color: "white", kind: "king" }
                board[63 - rowLength - 1] = { color: "black", kind: "man" }
                board[63 - 2 * (rowLength + 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(63)
                expect(moves).toEqual([]);
            })
        })

        describe("Secondary diagonal", () => {
            it("should generate 7 diagonal simple moves for %s king in square 7", () => {
                const board = emptyBoard.slice()
                board[7] = { color: "black", kind: "king" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(7);
                const expected = [];
                for (let i = 1; i <= 7; i++)
                    expected.push(7 + (rowLength - 1) * i, MoveKind.Simple);
                expect(moves).toEqual(expected);
            })

            it("should generate 7 diagonal simple moves for %s king in square 56", () => {
                const board = emptyBoard.slice()
                board[56] = { color: "black", kind: "king" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(56);
                const expected = [];
                for (let i = 1; i <= 7; i++)
                    expected.push(56 - (rowLength - 1) * i, MoveKind.Simple);
                expect(moves).toEqual(expected);
            })

            each([0, 1, 2, 3, 4, 5, 6]).it("should generate secondary diagonal simple moves for king in square %d, when he's obstructed on the main diagonal", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "king" }
                board[square + rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)
                const expected = [];
                for (let i = 1; i <= square; i++)
                    expected.push(square + (rowLength - 1) * i, MoveKind.Simple);
                expect(moves).toEqual(expected);
            })

            each([10]).it("should generate secondary diagonal simple moves for king in square %d, when he's obstructed on the main diagonal", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength + 1] = { color: "black", kind: "man" }
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    3, MoveKind.Simple,
                    17, MoveKind.Simple,
                    24, MoveKind.Simple
                ]);
            })

            each([55]).it("should generate secondary diagonal simple moves for king in square %d, when he's obstructed on the main diagonal", (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength + 1] = { color: "black", kind: "man" }
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    62, MoveKind.Simple
                ]);
            })
        })
    })

    describe("Move piece destructively", () => {
        each([0, 1, 2, 3]).it("normal move should leave originating square %d empty", (square) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board)

            generator.movePiece(square, square + rowLength + 1, MoveKind.Simple);

            expect(board[square]).toBe(null)
        })

        each([[0, "man"], [1, "king"]]).it("normal move from square %d %s should put piece in destination cell", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            const generator = new MoveGenerator(board)

            generator.movePiece(square, square + rowLength + 1, MoveKind.Simple);

            expect(board[square + rowLength + 1]).toEqual({ color: "black", kind: kind })
        })

        each([52, 54]).it("crowning move from square %d should make destination piece a king", (square) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board);

            generator.movePiece(square, square + rowLength + 1, MoveKind.Crowning);

            expect(board[square + rowLength + 1]).toEqual({ color: "black", kind: "king" })
        })
    })

    describe("Move piece observationally purely", () => {
        each([0, 1, 2, 3]).it("normal move should leave originating square %d empty", (square) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }

            const result = movePiece(board, square, square + rowLength + 1);

            expect(result[square]).toBe(null)
        })

        each([[0, "man"], [1, "king"]]).it("normal move from square %d %s should put piece in destination cell", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }

            const result = movePiece(board, square, square + rowLength + 1);

            expect(result[square + rowLength + 1]).toEqual({ color: "black", kind: kind })
        })

        each([52, 54]).it("crowning move from square %d should make destination piece a king", (square) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }

            const result = movePiece(board, square, square + rowLength + 1);

            expect(result[square + rowLength + 1]).toEqual({ color: "black", kind: "king" })
        })

        it("should throw for a move from an empty square", () => {
            const board = emptyBoard.slice()

            expect(() => movePiece(board, 3, 12)).toThrowError("Attempted to move from an empty square.");
        })
    })

    describe("Functional movesFrom()", () => {
        it("should generate 7 diagonal simple moves for king in square 63", () => {
            const board = emptyBoard.slice()
            board[63] = { color: "black", kind: "king" }

            const moves = movesFrom(board, 63);
            const expected = [];
            for (let i = 0; i < 7; i++)
                expected.push(63 - (rowLength + 1) * (i + 1), MoveKind.Simple);
            expect(moves).toEqual(expected);
        })      
    })
})