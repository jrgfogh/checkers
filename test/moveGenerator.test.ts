import each from 'jest-each';

import MoveGenerator, { MoveKind, coordinate, movesFrom, movePiece } from './moveGeneratorTestWrapper';

const emptyBoard = Array(64).fill(null)
const rowLength = 8

describe("Move Generator", () => {
    describe("Constructor", () => {
        it("should require a GameModel", () => {
            // @ts-expect-error
            () => new MoveGenerator();
            // @ts-expect-error
            () => new MoveGenerator(null);
        })

        it("should reject an invalid board", () => {
            // @ts-expect-error
            () => new MoveGenerator({ board: ["invalid"], turn: "white" });
        })
    })

    describe("Black man", () => {
        describe("Simple moves", () => {
            each([coordinate(1, 32), coordinate(10, 27), coordinate(12, 26), coordinate(14, 25), coordinate(17, 24), coordinate(30, 17), coordinate(33, 16)]).it("should generate two simple moves for unobstructed at square %d", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Simple,
                    square + rowLength - 1, MoveKind.Simple
                ])
            })

            each([coordinate(8, 28), coordinate(24, 20), coordinate(40, 12)]).it("should generate one simple move for unobstructed at square %d", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Simple
                ])
            })

            each([coordinate(7, 29), coordinate(23, 21), coordinate(39, 13)]).it("should generate one simple move for unobstructed at square %d", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    square + rowLength - 1, MoveKind.Simple
                ])
            })

            each([coordinate(49, 8), coordinate(51, 7), coordinate(53, 6)]).it("should generate two crowning move for unobstructed at square %d", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Crowning,
                    square + rowLength - 1, MoveKind.Crowning
                ])
            })

            each([coordinate(55, 5)]).it("should generate one crowning move for unobstructed at square %d", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength - 1, MoveKind.Crowning
                ])
            })

            each([coordinate(1, 32), coordinate(49, 8)]).it("should generate no moves for obstructed at square %d", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                board[square + rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([])
            })

            each([coordinate(7, 29), coordinate(55, 5)]).it("should generate no moves for obstructed at square %d", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([])
            })
        })

        describe("Jumps", () => {
            each([coordinate(3, 31), coordinate(21, 22)]).it("should generate two jumps from square %d when possible", (square: number) => {
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

            each([coordinate(1, 32), coordinate(8, 28), coordinate(17, 24), coordinate(24, 20), coordinate(33, 16)]).it("should generate one jump from square %d when possible", (square: number) => {
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

            each([coordinate(7, 29), coordinate(14, 25), coordinate(23, 21), coordinate(39, 13)]).it("should generate one jump from square %d when possible", (square: number) => {
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

            each([coordinate(1, 32)]).it("should not generate any jumps from square %d when obstructed", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength - 1] = { color: "white", kind: "man" }
                // Piece to *not* jump over.
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                // Piece blocking the jump.
                board[square + 2 * (rowLength + 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([coordinate(30, 17)]).it("should not generate a jump over the right side of the board from square %d", (square: number) => {
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

            each([coordinate(33, 16)]).it("should not generate a jump over the left side of the board from square %d", (square: number) => {
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

            each([coordinate(42, 11), coordinate(44, 10)]).it("should generate two jumps from square %d when possible", (square: number) => {
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

            each([coordinate(40, 12), coordinate(42, 11)]).it("should generate one jump from square %d when possible", (square: number) => {
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
        })
    })

    describe("White man", () => {
        each([coordinate(17, 24), coordinate(30, 17), coordinate(33, 16), coordinate(49, 8), coordinate(51, 7), coordinate(53, 6)]).it("should generate two simple moves for unobstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Simple,
                square - rowLength - 1, MoveKind.Simple
            ])
        })

        each([coordinate(23, 21), coordinate(39, 13), coordinate(55, 5)]).it("should generate one simple move for unobstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength - 1, MoveKind.Simple
            ])
        })

        each([coordinate(24, 20), coordinate(40, 12), coordinate(56, 4)]).it("should generate one simple move for unobstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Simple
            ])
        })

        each([coordinate(10, 27), coordinate(12, 26), coordinate(14, 25)]).it("should generate two crowning move for unobstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Crowning,
                square - rowLength - 1, MoveKind.Crowning
            ])
        })

        each([coordinate(8, 28)]).it("should generate one crowning move for unobstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Crowning
            ])
        })

        each([coordinate(12, 26), coordinate(14, 25)]).it("should generate two crowning moves for unobstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Crowning,
                square - rowLength - 1, MoveKind.Crowning
            ])
        })

        each([coordinate(62, 1)]).it("should generate no moves for obstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            board[square - rowLength - 1] = { color: "white", kind: "man" };
            board[square - rowLength + 1] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        })

        each([coordinate(56, 4)]).it("should generate no moves for obstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            board[square - rowLength + 1] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        })

        describe("Jumps", () => {
            each([coordinate(60, 2), coordinate(28, 18), coordinate(44, 10)]).it("should generate two jumps from square %d when possible", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "white", kind: "man" };
                // Pieces to jump over.
                board[square - rowLength - 1] = { color: "black", kind: "man" };
                board[square - rowLength + 1] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "white" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    square - 2 * (rowLength - 1), MoveKind.Jump,
                    square - 2 * (rowLength + 1), MoveKind.Jump
                ]);
            });

            each([coordinate(23, 21), coordinate(39, 13), coordinate(55, 5)]).it("should generate one jump from square %d when possible", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "white", kind: "man" };
                // Piece to jump over.
                board[square - rowLength - 1] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "white" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    square - 2 * (rowLength + 1), MoveKind.Jump
                ]);
            });

            each([coordinate(62, 1)]).it("should not generate any jumps from square %d when obstructed", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Piece to *not* jump over.
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                // Piece blocking the jump.
                board[square - 2 * (rowLength + 1)] = { color: "white", kind: "man" }
                // Piece blocking the simple move.
                board[square - rowLength + 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([coordinate(40, 12)]).it("should not generate any jumps from square %d when obstructed", (square: number) => {
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

            each([coordinate(30, 17)]).it("should not generate a jump over the right side of the board from square %d", (square: number) => {
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

            each([coordinate(17, 24)]).it("should not generate a jump over the left side of the board from square %d", (square: number) => {
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

            each([coordinate(19, 23), coordinate(21, 22)]).it("should generate two jumps from square %d when possible", (square: number) => {
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

            each([coordinate(21, 22), coordinate(23, 21)]).it("should generate one jump from square %d when possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Pieces to jump over.
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square - 2 * (rowLength + 1), MoveKind.Jump
                ]);
            });

            each([coordinate(17, 24)]).it("should generate one jump from square %d when possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Pieces to jump over.
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square - 2 * (rowLength - 1), MoveKind.Jump
                ]);
            });
        });
    });

    describe("King", () => {
        describe("Main diagonal", () => {
            each([["white"], ["black"]]).it("should generate two diagonal simple moves for %s king in square 1", (color) => {
                const board = emptyBoard.slice()
                board[1] = { color: color, kind: "king" }
                const generator = new MoveGenerator({ board: board, turn: color })

                const moves = generator.movesFrom(1);
                expect(moves).toEqual([
                    1 + (rowLength + 1), MoveKind.Simple,
                    1 + (rowLength - 1), MoveKind.Simple
                ]);
            })

            it("should generate two diagonal simple moves for king in square 62", () => {
                const board = emptyBoard.slice()
                board[62] = { color: "black", kind: "king" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(62);
                expect(moves).toEqual([
                    62 - (rowLength + 1), MoveKind.Simple,
                    62 - (rowLength - 1), MoveKind.Simple
                ]);
            })

            each([coordinate(3, 31), coordinate(5, 30)]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "king" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                board[square + 2 * (rowLength - 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + (rowLength + 1), MoveKind.Simple
                ]);
            })

            each([coordinate(10, 27)]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                board[square + 2 * (rowLength - 1)] = { color: "black", kind: "man" }
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    1, MoveKind.Simple,
                    19, MoveKind.Simple
                ]);
            })

            each([coordinate(21, 22)]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                board[square + 2 * (rowLength - 1)] = { color: "black", kind: "man" }
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                board[square - 2 * (rowLength - 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    12, MoveKind.Simple,
                    30, MoveKind.Simple
                ]);
            })

            each([coordinate(33, 16)]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
                board[square - rowLength + 1] = { color: "black", kind: "man" }
                board[square - 2 * (rowLength - 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    24, MoveKind.Simple,
                    42, MoveKind.Simple
                ]);
            })

            it("should generate no moves for completely obstructed king in cell 1", () => {
                const board = emptyBoard.slice()
                board[1] = { color: "white", kind: "king" }
                board[1 + rowLength - 1] = { color: "black", kind: "man" }
                board[1 + rowLength + 1] = { color: "black", kind: "man" }
                board[1 + 2 * (rowLength + 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(1)
                expect(moves).toEqual([]);
            })

            it("should generate no moves for completely obstructed king in cell 62", () => {
                const board = emptyBoard.slice()
                board[62] = { color: "white", kind: "king" }
                board[62 - rowLength + 1] = { color: "black", kind: "man" }
                board[62 - rowLength - 1] = { color: "black", kind: "man" }
                board[62 - 2 * (rowLength + 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(62)
                expect(moves).toEqual([]);
            })
        })

        describe("Secondary diagonal", () => {
            it("should generate a diagonal simple move for %s king in square 7", () => {
                const board = emptyBoard.slice()
                board[7] = { color: "black", kind: "king" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(7);
                expect(moves).toEqual([
                    7 + (rowLength - 1), MoveKind.Simple
                ]);
            })

            it("should generate a diagonal simple move for %s king in square 56", () => {
                const board = emptyBoard.slice()
                board[56] = { color: "black", kind: "king" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(56);
                expect(moves).toEqual([
                    56 - (rowLength - 1), MoveKind.Simple
                ]);
            })

            each([coordinate(1, 32), coordinate(3, 31), coordinate(5, 30)]).it("should generate a simple move on the secondary diagonal for king in square %d, when he's obstructed on the main diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "king" }
                board[square + rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    square + (rowLength - 1), MoveKind.Simple
                ]);
            })

            each([coordinate(10, 27)]).it("should generate secondary diagonal simple moves for king in square %d, when he's obstructed on the main diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[square + rowLength + 1] = { color: "black", kind: "man" }
                board[square + 2 * (rowLength + 1)] = { color: "black", kind: "man" }
                board[square - rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    3, MoveKind.Simple,
                    17, MoveKind.Simple
                ]);
            })

            each([coordinate(55, 5)]).it("should generate secondary diagonal simple moves for king in square %d, when he's obstructed on the main diagonal", (square: number) => {
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
            each([coordinate(26, 19), coordinate(28, 18), coordinate(35, 15), coordinate(37, 14)]).it("should generate four jumps from square %d when possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "king" }
                board[square - rowLength - 1] = { color: "white", kind: "man" }
                board[square - rowLength + 1] = { color: "white", kind: "man" }
                board[square + rowLength - 1] = { color: "white", kind: "man" }
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square - 2 * (rowLength - 1), MoveKind.Jump,
                    square - 2 * (rowLength + 1), MoveKind.Jump,
                    square + 2 * (rowLength - 1), MoveKind.Jump,
                    square + 2 * (rowLength + 1), MoveKind.Jump
                ]);
            });
        })
    })

    describe("Forced capture", () => {
        each([[coordinate(3, 31), "man"], [coordinate(5, 30), "king"]]).it("should not generate a simple move when a jump is possible from square %d for %s", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            board[square + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([square + 2 * (rowLength + 1), MoveKind.Jump]);
        });

        each([[coordinate(5, 30), coordinate(21, 22), "man"], [coordinate(10, 27), coordinate(33, 16), "man"], [coordinate(5, 30), coordinate(21, 22), "king"], [coordinate(10, 27), coordinate(33, 16), "king"]]).
                it("should not generate any simple moves from square %d when a jump is possible from square %d for black %s", (square, otherSquare, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            board[otherSquare] = { color: "black", kind: "man" }
            board[otherSquare + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[coordinate(5, 30), coordinate(21, 22), "man"], [coordinate(10, 27), coordinate(33, 16), "man"], [coordinate(51, 7), coordinate(21, 22), "king"], [coordinate(10, 27), coordinate(33, 16), "king"]]).
                it("should not generate any simple moves from square %d when a jump is possible from square %d for white %s", (square, otherSquare, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: kind }
            board[otherSquare] = { color: "white", kind: "man" }
            board[otherSquare - rowLength + 1] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[coordinate(60, 2), coordinate(21, 22)], [coordinate(53, 6), coordinate(33, 16)]]).it("should generate simple moves for white from square %d when a white man could jump from square %d, if it had been black", (square, otherSquare) => {
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

        each([[coordinate(60, 2), coordinate(21, 22)], [coordinate(53, 6), coordinate(33, 16)]]).it("should not generate simple moves for white from square %d when a white king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[otherSquare] = { color: "white", kind: "king" }
            board[otherSquare + rowLength + 1] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[coordinate(58, 3), coordinate(21, 22)], [coordinate(53, 6), coordinate(35, 15)]]).it("should not generate simple moves for white from square %d when a white king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[otherSquare] = { color: "white", kind: "king" }
            board[otherSquare + rowLength - 1] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[coordinate(3, 31), coordinate(21, 22)], [coordinate(5, 30), coordinate(33, 16)]]).it("should not generate simple moves for black from square %d when a black king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[otherSquare] = { color: "black", kind: "king" }
            board[otherSquare - rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[coordinate(5, 30), coordinate(21, 22)], [coordinate(10, 27), coordinate(33, 16)]]).it("should not generate any simple moves from square %d when a jump is possible from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[otherSquare] = { color: "black", kind: "man" }
            board[otherSquare + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[coordinate(5, 30), coordinate(21, 22)], [coordinate(10, 27), coordinate(33, 16)]]).it("should generate simple moves for black from square %d when a white man can jump from square %d", (square, otherSquare) => {
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

        each([[coordinate(42, 11), coordinate(21, 22)], [coordinate(37, 14), coordinate(35, 15)]]).it("should generate moves for white king from square %d when a black man can jump from square %d", (square, otherSquare) => {
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
        each([coordinate(1, 32), coordinate(3, 31), coordinate(5, 30)]).it("simple move should leave originating square %d empty", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, square + rowLength + 1, MoveKind.Simple);

            expect(board[square]).toBe(null)
        })

        each([[coordinate(1, 32), "man"], [coordinate(3, 31), "king"]]).it("simple move from square %d %s should put piece in destination cell", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, square + rowLength + 1, MoveKind.Simple);

            expect(board[square + rowLength + 1]).toEqual({ color: "black", kind: kind })
        })

        each([coordinate(51, 7), coordinate(53, 6)]).it("crowning move from square %d should make destination piece a king", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + rowLength + 1, MoveKind.Crowning);

            expect(board[square + rowLength + 1]).toEqual({ color: "black", kind: "king" })
        })

        each([coordinate(5, 30), coordinate(26, 19)]).it("jump from square %d should capture opponent's piece", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.Jump);

            expect(board[square + rowLength + 1]).toEqual(null)
        })

        each([coordinate(5, 30), coordinate(26, 19)]).it("jump from square %d should capture opponent's piece", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength - 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength - 1), MoveKind.Jump);

            expect(board[square + rowLength - 1]).toEqual(null)
        })

        each([coordinate(5, 30), coordinate(26, 19)]).it("jump from square %d should switch turn", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength - 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength - 1), MoveKind.Jump);

            expect(generator.state.turn).toEqual("white")
        })

        each([coordinate(40, 12), coordinate(44, 10)]).it("jump from square %d should capture opponent's piece", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.Jump);

            expect(board[square + rowLength + 1]).toEqual(null)
        })

        each([coordinate(40, 12), coordinate(44, 10)]).it("jump from square %d should make destination piece a king", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.Jump);

            expect(board[square + 2 * (rowLength + 1)]).toEqual({ color: "black", kind: "king" })
        })

        describe("Multiple jumps", () => {
            each([coordinate(3, 31), coordinate(26, 19)]).it("should not switch turn when second jump is available",
                    (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                board[square + 3 * (rowLength + 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" });

                generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.Jump);

                expect(generator.state.turn).toEqual("black")
            });

            each([coordinate(5, 30), coordinate(21, 22)]).it("should generate a second jump",
                    (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength - 1] = { color: "white", kind: "man" }
                board[square + 3 * (rowLength - 1)] = { color: "white", kind: "man" }
                const firstJumpDestination = square + 2 * (rowLength - 1);
                const generator = new MoveGenerator({ board: board, turn: "black" });

                generator.movePiece(square, firstJumpDestination, MoveKind.Jump);

                expect(generator.movesFrom(firstJumpDestination)).toEqual([
                        square + 4 * (rowLength - 1), MoveKind.Jump
                    ])
            });

            each([coordinate(3, 31), coordinate(26, 19)]).it("should not generate jump for another piece when jumping for the second time",
                    (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const rivalSquare = square + 2 * (rowLength + 1) + 2;
                board[rivalSquare] = { color: "black", kind: "man" }
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                board[square + 3 * (rowLength + 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" });

                generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.Jump);

                expect(generator.movesFrom(rivalSquare)).toEqual([])
            });

            each([coordinate(42, 11), coordinate(44, 10)]).it("should switch turn after a crowning jump, even when a new jump is possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Pieces to jump over.
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                board[square + rowLength + 3] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.Jump);

                expect(generator.state.turn).toEqual("white");
            });
        });
    })

    describe("Move piece observationally purely", () => {
        each([coordinate(1, 32), coordinate(3, 31), coordinate(5, 30)]).it("simple move should leave originating square %d empty", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }

            const result = movePiece({ board: board, turn: "black" }, square, square + rowLength + 1);

            expect(result.board[square]).toBe(null)
        })

        each([[coordinate(1, 32), "man"], [coordinate(3, 31), "king"]]).it("simple move from square %d %s should put piece in destination cell", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }

            const result = movePiece({ board: board, turn: "black" }, square, square + rowLength + 1);

            expect(result.board[square + rowLength + 1]).toEqual({ color: "black", kind: kind })
        })

        each([coordinate(51, 7), coordinate(53, 6)]).it("crowning move from square %d should make destination piece a king", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }

            const result = movePiece({ board: board, turn: "black" }, square, square + rowLength + 1);

            expect(result.board[square + rowLength + 1]).toEqual({ color: "black", kind: "king" })
        })

        it("should throw for a move from an empty square", () => {
            const board = emptyBoard.slice()

            expect(() => movePiece({ board: board, turn: "black" }, 3, 12)).toThrow("Attempted to move from an empty square.");
        })
        
        describe("Multiple jumps", () => {
            each([coordinate(3, 31), coordinate(26, 19)]).it("should not generate jump for another piece when jumping for the second time",
                    (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const rivalSquare = square + 2 * (rowLength + 1) + 2;
                board[rivalSquare] = { color: "black", kind: "man" }
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                board[square + 3 * (rowLength + 1)] = { color: "white", kind: "man" }

                const result = movePiece({ board: board, turn: "black" },
                    square, square + 2 * (rowLength + 1));

                expect(movesFrom(result, rivalSquare)).toEqual([])
            });
        });

        describe("Undo move", () => {
            each([coordinate(1, 32), coordinate(3, 31), coordinate(12, 26)]).it("should round-trip for simple move from square %d", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const originalState = { board: board, turn: "black" as const };

                movePiece(originalState, square, square + rowLength + 1);

                const originalBoard = emptyBoard.slice()
                originalBoard[square] = { color: "black", kind: "man" }
                expect(originalState.board).toEqual(originalBoard)
            })

            each([coordinate(51, 7), coordinate(53, 6)]).it("should round-trip for crowning move from square %d", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const originalState = { board: board, turn: "black" as const };

                movePiece(originalState, square, square + rowLength + 1);

                const originalBoard = emptyBoard.slice()
                originalBoard[square] = { color: "black", kind: "man" }
                expect(originalState.board).toEqual(originalBoard)
            })
        })
    });

    describe("Undo destructive move", () => {
        each([coordinate(1, 32), coordinate(3, 31), coordinate(5, 30), coordinate(12, 26)]).it("should round-trip for simple move from square %d", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, square + rowLength + 1, MoveKind.Simple);
            generator.undoMove();

            const originalBoard = emptyBoard.slice()
            originalBoard[square] = { color: "black", kind: "man" }
            expect(generator.state.board).toEqual(originalBoard)
        })

        each([coordinate(51, 7), coordinate(53, 6)]).it("should round-trip for crowning move from square %d", (square: number) => {
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
        it("should generate two diagonal simple moves for king in square 62", () => {
            const board = emptyBoard.slice()
            board[62] = { color: "black", kind: "king" }

            const moves = movesFrom({ board: board, turn: "black" }, 62);
            expect(moves).toEqual([
                62 - (rowLength + 1), MoveKind.Simple,
                62 - (rowLength - 1), MoveKind.Simple
            ]);
        })      
    })
})
