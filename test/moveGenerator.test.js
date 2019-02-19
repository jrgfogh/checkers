// @flow

import each from 'jest-each';

import MoveGenerator, { MoveKind, movesFrom, movePiece } from '../src/moveGenerator';

const emptyBoard = Array(64).fill(null)
const rowLength = 8

describe("Move Generator", () => {
    describe("Constructor", () => {
        it("should require a GameModel", () => {
            // $FlowExpectError
            () => new MoveGenerator();
            // $FlowExpectError
            () => new MoveGenerator(null);
        })

        it("should reject an invalid board", () => {
            // $FlowExpectError
            () => new MoveGenerator({ board: ["invalid"], turn: "white" });
        })
    })

    describe("Black man", () => {
        describe("Simple moves", () => {
            each([9, 10, 11, 12, 13, 14]).it("should generate two simple moves for unobstructed at square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Simple,
                    square + rowLength - 1, MoveKind.Simple
                ])
            })

            each([0, 8, 16, 24, 32, 40]).it("should generate one simple move for unobstructed at square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Simple
                ])
            })

            each([7, 15, 23, 31, 39, 47]).it("should generate one simple move for unobstructed at square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength - 1, MoveKind.Simple
                ])
            })

            each([49, 50, 51, 52, 53, 54]).it("should generate two crowning move for unobstructed at square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Crowning,
                    square + rowLength - 1, MoveKind.Crowning
                ])
            })

            each([48]).it("should generate one crowning move for unobstructed at square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Crowning
                ])
            })

            each([55]).it("should generate one crowning move for unobstructed at square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength - 1, MoveKind.Crowning
                ])
            })

            each([0, 48]).it("should generate no moves for obstructed at square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([])
            })

            each([7, 55]).it("should generate no moves for obstructed at square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([])
            })
        })

        describe("Jumps", () => {
            each([2, 20]).it("should generate two jumps from square %d when possible", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Pieces to jump over.
                board[square + rowLength - 1] = { color: "white", kind: "man" }
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + 2 * (rowLength - 1), MoveKind.Jump,
                    square + 2 * (rowLength + 1), MoveKind.Jump
                ]);
            });

            each([0, 8, 16, 24, 32]).it("should generate one jump from square %d when possible", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Piece to jump over.
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + 2 * (rowLength + 1), MoveKind.Jump
                ]);
            });

            each([7, 15, 23, 31, 39]).it("should generate one jump from square %d when possible", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Piece to jump over.
                board[square + rowLength - 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + 2 * (rowLength - 1), MoveKind.Jump
                ]);
            });

            each([0]).it("should not generate any jumps from square %d when obstructed", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Piece to *not* jump over.
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                // Piece blocking the jump.
                board[square + 2 * (rowLength + 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([30]).it("should not generate a jump over the right side of the board from square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Piece to *not* jump over.
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                // Piece blocking the other diagonal
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([33]).it("should not generate a jump over the left side of the board from square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Piece to *not* jump over.
                board[square + rowLength - 1] = { color: "white", kind: "man" }
                // Piece blocking the other diagonal
                board[square + rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([42, 43, 44, 45]).it("should generate two crowning jumps from square %d when possible", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Pieces to jump over.
                board[square + rowLength - 1] = { color: "white", kind: "man" }
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + 2 * (rowLength - 1), MoveKind.CrowningJump,
                    square + 2 * (rowLength + 1), MoveKind.CrowningJump
                ]);
            });

            each([40, 41]).it("should generate one crowning jump from square %d when possible", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Piece to jump over.
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + 2 * (rowLength + 1), MoveKind.CrowningJump
                ]);
            });
        })
    })

    describe("White man", () => {
        each([49, 50, 51, 52, 53, 54]).it("should generate two simple moves for unobstructed at square %d", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" })

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Simple,
                square - rowLength - 1, MoveKind.Simple
            ])
        })

        each([23, 31, 39, 47, 55, 63]).it("should generate one simple move for unobstructed at square %d", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" })

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength - 1, MoveKind.Simple
            ])
        })

        each([16, 24, 32, 40, 48, 56]).it("should generate one simple move for unobstructed at square %d", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" })

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Simple
            ])
        })

        each([9, 10, 11, 12, 13, 14]).it("should generate two crowning move for unobstructed at square %d", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" })

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Crowning,
                square - rowLength - 1, MoveKind.Crowning
            ])
        })

        each([8]).it("should generate one crowning move for unobstructed at square %d", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" })

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Crowning
            ])
        })

        each([15]).it("should generate one crowning move for unobstructed at square %d", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" })

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength - 1, MoveKind.Crowning
            ])
        })

        each([63]).it("should generate no moves for obstructed at square %d", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[square - rowLength - 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" })

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([])
        })

        each([56]).it("should generate no moves for obstructed at square %d", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[square - rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" })

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([])
        })

        describe("Jumps", () => {
            each([61, 29, 45]).it("should generate two jumps from square %d when possible", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Pieces to jump over.
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square - 2 * (rowLength - 1), MoveKind.Jump,
                    square - 2 * (rowLength + 1), MoveKind.Jump
                ]);
            });

            each([31, 39, 47, 55, 63]).it("should generate one jump from square %d when possible", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Piece to jump over.
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square - 2 * (rowLength + 1), MoveKind.Jump
                ]);
            });

            each([63]).it("should not generate any jumps from square %d when obstructed", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Piece to *not* jump over.
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                // Piece blocking the jump.
                board[square - 2 * (rowLength + 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([40]).it("should not generate any jumps from square %d when obstructed", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Piece to *not* jump over.
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                // Piece blocking the jump.
                board[square - 2 * (rowLength - 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([30]).it("should not generate a jump over the right side of the board from square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Piece to *not* jump over.
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                // Piece blocking the other diagonal
                board[square - rowLength - 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([41]).it("should not generate a jump over the left side of the board from square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Piece to *not* jump over.
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                // Piece blocking the other diagonal
                board[square - rowLength + 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([18, 19, 20, 21]).it("should generate two crowning jumps from square %d when possible", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Pieces to jump over.
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square - 2 * (rowLength - 1), MoveKind.CrowningJump,
                    square - 2 * (rowLength + 1), MoveKind.CrowningJump
                ]);
            });

            each([22, 23]).it("should generate one crowning jump from square %d when possible", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Pieces to jump over.
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square - 2 * (rowLength + 1), MoveKind.CrowningJump
                ]);
            });

            each([16]).it("should generate one crowning jump from square %d when possible", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Pieces to jump over.
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square - 2 * (rowLength - 1), MoveKind.CrowningJump
                ]);
            });
        });
    });

    describe("King", () => {
        describe("Main diagonal", () => {
            each("white", "black").it("should generate 7 diagonal simple moves for %s king in square 0", (color) => {
                const board = emptyBoard.slice()
                board[0] = { color: color, kind: "king" }
                const generator = new MoveGenerator({ board: board, turn: color })

                const moves = generator.movesFrom(0);
                const expected = [];
                for (let i = 0; i < 7; i++)
                    expected.push(0 + (rowLength + 1) * (i + 1), MoveKind.Simple);
                expect(moves).toEqual(expected);
            })

            it("should generate 7 diagonal simple moves for king in square 63", () => {
                const board = emptyBoard.slice()
                board[63] = { color: "black", kind: "king" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(63);
                const expected = [];
                for (let i = 0; i < 7; i++)
                    expected.push(63 - (rowLength + 1) * (i + 1), MoveKind.Simple);
                expect(moves).toEqual(expected);
            })

            each([2, 3, 4, 5, 6, 7]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "king" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                board[square + 2 * (rowLength - 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                const expected = [];
                for (let i = 0; i < 7 - square; i++)
                    expected.push(square + (rowLength + 1) * (i + 1), MoveKind.Simple);
                expect(moves).toEqual(expected);
            })

            each([10]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                board[square + 2 * (rowLength - 1)] = { color: "black", kind: "man" }
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

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

            each([20]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                board[square + 2 * (rowLength - 1)] = { color: "black", kind: "man" }
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                board[square - 2 * (rowLength - 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    11, MoveKind.Simple,
                    2, MoveKind.Simple,
                    29, MoveKind.Simple,
                    38, MoveKind.Simple,
                    47, MoveKind.Simple
                ]);
            })

            each([33]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                board[square - 2 * (rowLength - 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

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
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(0)
                expect(moves).toEqual([]);
            })

            it("should generate no moves for completely obstructed king in cell 63", () => {
                const board = emptyBoard.slice()
                board[63] = { color: "white", kind: "king" }
                board[63 - rowLength - 1] = { color: "black", kind: "man" }
                board[63 - 2 * (rowLength + 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(63)
                expect(moves).toEqual([]);
            })
        })

        describe("Secondary diagonal", () => {
            it("should generate 7 diagonal simple moves for %s king in square 7", () => {
                const board = emptyBoard.slice()
                board[7] = { color: "black", kind: "king" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(7);
                const expected = [];
                for (let i = 1; i <= 7; i++)
                    expected.push(7 + (rowLength - 1) * i, MoveKind.Simple);
                expect(moves).toEqual(expected);
            })

            it("should generate 7 diagonal simple moves for %s king in square 56", () => {
                const board = emptyBoard.slice()
                board[56] = { color: "black", kind: "king" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(56);
                const expected = [];
                for (let i = 1; i <= 7; i++)
                    expected.push(56 - (rowLength - 1) * i, MoveKind.Simple);
                expect(moves).toEqual(expected);
            })

            each([0, 1, 2, 3, 4, 5, 6]).it("should generate secondary diagonal simple moves for king in square %d, when he's obstructed on the main diagonal", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "king" }
                board[square + rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                const expected = [];
                for (let i = 1; i <= square; i++)
                    expected.push(square + (rowLength - 1) * i, MoveKind.Simple);
                expect(moves).toEqual(expected);
            })

            each([10]).it("should generate secondary diagonal simple moves for king in square %d, when he's obstructed on the main diagonal", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength + 1] = { color: "black", kind: "man" }
                board[square + 2 * (rowLength + 1)] = { color: "black", kind: "man" }
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    3, MoveKind.Simple,
                    17, MoveKind.Simple,
                    24, MoveKind.Simple
                ]);
            })

            each([55]).it("should generate secondary diagonal simple moves for king in square %d, when he's obstructed on the main diagonal", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                board[square - 2 * (rowLength + 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    62, MoveKind.Simple
                ]);
            })
        })
        
        describe("Jumps", () => {
            each([2, 3, 4, 5]).it("should generate two jumps from square %d when possible", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "king" }
                board[square + rowLength - 1] = { color: "white", kind: "man" }
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + 2 * (rowLength - 1), MoveKind.Jump,
                    square + 2 * (rowLength + 1), MoveKind.Jump
                ]);
            });
        })
    })

    describe("Forced capture", () => {
        each([[3, "man"], [5, "king"]]).it("should not generate a simple move when a jump is possible from square %d for %s", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            board[square + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([square + 2 * (rowLength + 1), MoveKind.Jump]);
        });

        each([[5, 20, "man"], [10, 33, "man"], [5, 20, "king"], [10, 33, "king"]]).
                it("should not generate any simple moves from square %d when a jump is possible from square %d for black %s", (square, otherSquare, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            board[otherSquare] = { color: "black", kind: "man" }
            board[otherSquare + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[5, 20, "man"], [10, 33, "man"], [5, 20, "king"], [10, 33, "king"]]).
                it("should not generate any simple moves from square %d when a jump is possible from square %d for white %s", (square, otherSquare, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: kind }
            board[otherSquare] = { color: "white", kind: "man" }
            board[otherSquare - rowLength + 1] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[60, 20], [52, 33]]).it("should generate simple moves for white from square %d when a white man could jump from square %d, if it had been black", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[otherSquare] = { color: "white", kind: "man" }
            board[otherSquare + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Simple,
                square - rowLength - 1, MoveKind.Simple
            ]);
        });

        each([[60, 20], [52, 33]]).it("should not generate simple moves for white from square %d when a white king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[otherSquare] = { color: "white", kind: "king" }
            board[otherSquare + rowLength + 1] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[59, 20], [52, 35]]).it("should not generate simple moves for white from square %d when a white king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[otherSquare] = { color: "white", kind: "king" }
            board[otherSquare + rowLength - 1] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[3, 20], [5, 33]]).it("should not generate simple moves for black from square %d when a black king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[otherSquare] = { color: "black", kind: "king" }
            board[otherSquare - rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[3, 20], [5, 32]]).it("should not generate simple moves for black from square %d when a black king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[otherSquare] = { color: "black", kind: "king" }
            board[otherSquare - rowLength - 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[5, 20], [10, 33]]).it("should not generate any simple moves from square %d when a jump is possible from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[otherSquare] = { color: "black", kind: "man" }
            board[otherSquare + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[5, 20], [10, 33]]).it("should generate simple moves for black from square %d when a white man can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[otherSquare] = { color: "black", kind: "man" }
            board[otherSquare + rowLength + 1] = { color: "white", kind: "man" }
            board[otherSquare + 2 * (rowLength + 1)] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                square + rowLength + 1, MoveKind.Simple,
                square + rowLength - 1, MoveKind.Simple
            ]);
        });

        each([[43, 20], [37, 36]]).it("should generate moves for white king from square %d when a black man can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "king" }
            board[otherSquare] = { color: "white", kind: "man" }
            board[otherSquare - rowLength + 1] = { color: "black", kind: "man" }
            board[otherSquare - 2 * (rowLength - 1)] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves.length).toBeGreaterThan(0)
        });
    })

    describe("Move piece destructively", () => {
        each([0, 1, 2, 3]).it("simple move should leave originating square %d empty", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, square + rowLength + 1, MoveKind.Simple);

            expect(board[square]).toBe(null)
        })

        each([[0, "man"], [1, "king"]]).it("simple move from square %d %s should put piece in destination cell", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, square + rowLength + 1, MoveKind.Simple);

            expect(board[square + rowLength + 1]).toEqual({ color: "black", kind: kind })
        })

        each([52, 54]).it("crowning move from square %d should make destination piece a king", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + rowLength + 1, MoveKind.Crowning);

            expect(board[square + rowLength + 1]).toEqual({ color: "black", kind: "king" })
        })

        each([5, 27]).it("jump from square %d should capture opponent's piece", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.Jump);

            expect(board[square + rowLength + 1]).toEqual(null)
        })

        each([4, 26]).it("jump from square %d should capture opponent's piece", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength - 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength - 1), MoveKind.Jump);

            expect(board[square + rowLength - 1]).toEqual(null)
        })

        each([5, 27]).it("jump from square %d should switch turn", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength - 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength - 1), MoveKind.Jump);

            expect(generator.state.turn).toEqual("white")
        })

        each([40, 45]).it("crowning jump from square %d should capture opponent's piece", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.CrowningJump);

            expect(board[square + rowLength + 1]).toEqual(null)
        })

        each([40, 45]).it("crowning jump from square %d should make destination piece a king", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.CrowningJump);

            expect(board[square + 2 * (rowLength + 1)]).toEqual({ color: "black", kind: "king" })
        })

        describe("Multiple jumps", () => {
            each([5, 27]).it("should not switch turn when second jump is available",
                    (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                board[square + 3 * (rowLength + 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" });

                generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.Jump);

                expect(generator.state.turn).toEqual("black")
            });
        });
    })

    describe("Move piece observationally purely", () => {
        each([0, 1, 2, 3]).it("simple move should leave originating square %d empty", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }

            const result = movePiece({ board: board, turn: "black" }, square, square + rowLength + 1);

            expect(result.board[square]).toBe(null)
        })

        each([[0, "man"], [1, "king"]]).it("simple move from square %d %s should put piece in destination cell", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }

            const result = movePiece({ board: board, turn: "black" }, square, square + rowLength + 1);

            expect(result.board[square + rowLength + 1]).toEqual({ color: "black", kind: kind })
        })

        each([52, 54]).it("crowning move from square %d should make destination piece a king", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }

            const result = movePiece({ board: board, turn: "black" }, square, square + rowLength + 1);

            expect(result.board[square + rowLength + 1]).toEqual({ color: "black", kind: "king" })
        })

        it("should throw for a move from an empty square", () => {
            const board = emptyBoard.slice()

            expect(() => movePiece({ board: board, turn: "black" }, 3, 12)).toThrowError("Attempted to move from an empty square.");
        })
    })

    describe("Undo destructive move", () => {
        each([0, 1, 2, 13]).it("should round-trip for simple move from square %d", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, square + rowLength + 1, MoveKind.Simple);
            generator.undoMove();

            const originalBoard = emptyBoard.slice()
            originalBoard[square] = { color: "black", kind: "man" }
            expect(generator.state.board).toEqual(originalBoard)
        })

        each([50, 51, 52]).it("should round-trip for crowning move from square %d", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, square + rowLength + 1, MoveKind.Crowning);
            generator.undoMove();

            const originalBoard = emptyBoard.slice()
            originalBoard[square] = { color: "black", kind: "man" }
            expect(generator.state.board).toEqual(originalBoard)
        })
    })

    describe("Functional movesFrom()", () => {
        it("should generate 7 diagonal simple moves for king in square 63", () => {
            const board = emptyBoard.slice()
            board[63] = { color: "black", kind: "king" }

            const moves = movesFrom({ board: board, turn: "black" }, 63);
            const expected = [];
            for (let i = 0; i < 7; i++)
                expected.push(63 - (rowLength + 1) * (i + 1), MoveKind.Simple);
            expect(moves).toEqual(expected);
        })      
    })
})