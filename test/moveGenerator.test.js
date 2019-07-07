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
            each([1, 10, 12, 14, 17, 30, 33]).it("should generate two simple moves for unobstructed at square %d", (square : number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Simple,
                    square + rowLength - 1, MoveKind.Simple
                ])
            })

            each([8, 24, 40]).it("should generate one simple move for unobstructed at square %d", (square : number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Simple
                ])
            })

            each([7, 23, 39]).it("should generate one simple move for unobstructed at square %d", (square : number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    square + rowLength - 1, MoveKind.Simple
                ])
            })

            each([49, 51, 53]).it("should generate two crowning move for unobstructed at square %d", (square : number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength + 1, MoveKind.Crowning,
                    square + rowLength - 1, MoveKind.Crowning
                ])
            })

            each([55]).it("should generate one crowning move for unobstructed at square %d", (square : number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    square + rowLength - 1, MoveKind.Crowning
                ])
            })

            each([1, 49]).it("should generate no moves for obstructed at square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength - 1] = { color: "black", kind: "man" }
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
            each([3, 21]).it("should generate two jumps from square %d when possible", (square : number) => {
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

            each([1, 8, 17, 24, 33]).it("should generate one jump from square %d when possible", (square : number) => {
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

            each([7, 14, 23, 39]).it("should generate one jump from square %d when possible", (square : number) => {
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

            each([1]).it("should not generate any jumps from square %d when obstructed", (square : number) => {
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

            each([42, 44]).it("should generate two jumps from square %d when possible", (square : number) => {
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

            each([40, 42]).it("should generate one jump from square %d when possible", (square : number) => {
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
        each([17, 30, 33, 49, 51, 53]).it("should generate two simple moves for unobstructed at square %d", (square : number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Simple,
                square - rowLength - 1, MoveKind.Simple
            ])
        })

        each([23, 39, 55]).it("should generate one simple move for unobstructed at square %d", (square : number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                square - rowLength - 1, MoveKind.Simple
            ])
        })

        each([24, 40, 56]).it("should generate one simple move for unobstructed at square %d", (square : number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Simple
            ])
        })

        each([10, 12, 14]).it("should generate two crowning move for unobstructed at square %d", (square : number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Crowning,
                square - rowLength - 1, MoveKind.Crowning
            ])
        })

        each([8]).it("should generate one crowning move for unobstructed at square %d", (square : number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Crowning
            ])
        })

        each([12, 14]).it("should generate two crowning moves for unobstructed at square %d", (square : number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                square - rowLength + 1, MoveKind.Crowning,
                square - rowLength - 1, MoveKind.Crowning
            ])
        })

        each([62]).it("should generate no moves for obstructed at square %d", (square : number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            board[square - rowLength - 1] = { color: "white", kind: "man" };
            board[square - rowLength + 1] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        })

        each([56]).it("should generate no moves for obstructed at square %d", (square : number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            board[square - rowLength + 1] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        })

        describe("Jumps", () => {
            each([60, 28, 44]).it("should generate two jumps from square %d when possible", (square : number) => {
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

            each([23, 39, 55]).it("should generate one jump from square %d when possible", (square : number) => {
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

            each([62]).it("should not generate any jumps from square %d when obstructed", (square : number) => {
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

            each([17]).it("should not generate a jump over the left side of the board from square %d", (square : number) => {
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

            each([19, 21]).it("should generate two jumps from square %d when possible", (square : number) => {
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

            each([21, 23]).it("should generate one jump from square %d when possible", (square : number) => {
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

            each([17]).it("should generate one jump from square %d when possible", (square : number) => {
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
            each("white", "black").it("should generate two diagonal simple moves for %s king in square 1", (color) => {
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

            each([3, 5]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square : number) => {
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
                    19, MoveKind.Simple
                ]);
            })

            each([21]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square : number) => {
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

            each([1, 3, 5]).it("should generate a simple move on the secondary diagonal for king in square %d, when he's obstructed on the main diagonal", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "king" }
                board[square + rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    square + (rowLength - 1), MoveKind.Simple
                ]);
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
                    17, MoveKind.Simple
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
            each([26, 28, 35, 37]).it("should generate four jumps from square %d when possible", (square : number) => {
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
        each([[3, "man"], [5, "king"]]).it("should not generate a simple move when a jump is possible from square %d for %s", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            board[square + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([square + 2 * (rowLength + 1), MoveKind.Jump]);
        });

        each([[5, 21, "man"], [10, 33, "man"], [5, 21, "king"], [10, 33, "king"]]).
                it("should not generate any simple moves from square %d when a jump is possible from square %d for black %s", (square, otherSquare, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            board[otherSquare] = { color: "black", kind: "man" }
            board[otherSquare + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[5, 21, "man"], [10, 33, "man"], [51, 21, "king"], [10, 33, "king"]]).
                it("should not generate any simple moves from square %d when a jump is possible from square %d for white %s", (square, otherSquare, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: kind }
            board[otherSquare] = { color: "white", kind: "man" }
            board[otherSquare - rowLength + 1] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[60, 21], [53, 33]]).it("should generate simple moves for white from square %d when a white man could jump from square %d, if it had been black", (square, otherSquare) => {
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

        each([[60, 21], [53, 33]]).it("should not generate simple moves for white from square %d when a white king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[otherSquare] = { color: "white", kind: "king" }
            board[otherSquare + rowLength + 1] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[58, 21], [53, 35]]).it("should not generate simple moves for white from square %d when a white king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[otherSquare] = { color: "white", kind: "king" }
            board[otherSquare + rowLength - 1] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[3, 21], [5, 33]]).it("should not generate simple moves for black from square %d when a black king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[otherSquare] = { color: "black", kind: "king" }
            board[otherSquare - rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[5, 21], [10, 33]]).it("should not generate any simple moves from square %d when a jump is possible from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[otherSquare] = { color: "black", kind: "man" }
            board[otherSquare + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[5, 21], [10, 33]]).it("should generate simple moves for black from square %d when a white man can jump from square %d", (square, otherSquare) => {
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

        each([[42, 21], [37, 35]]).it("should generate moves for white king from square %d when a black man can jump from square %d", (square, otherSquare) => {
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
        each([1, 3, 5]).it("simple move should leave originating square %d empty", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, square + rowLength + 1, MoveKind.Simple);

            expect(board[square]).toBe(null)
        })

        each([[1, "man"], [3, "king"]]).it("simple move from square %d %s should put piece in destination cell", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, square + rowLength + 1, MoveKind.Simple);

            expect(board[square + rowLength + 1]).toEqual({ color: "black", kind: kind })
        })

        each([51, 53]).it("crowning move from square %d should make destination piece a king", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + rowLength + 1, MoveKind.Crowning);

            expect(board[square + rowLength + 1]).toEqual({ color: "black", kind: "king" })
        })

        each([5, 26]).it("jump from square %d should capture opponent's piece", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.Jump);

            expect(board[square + rowLength + 1]).toEqual(null)
        })

        each([5, 26]).it("jump from square %d should capture opponent's piece", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength - 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength - 1), MoveKind.Jump);

            expect(board[square + rowLength - 1]).toEqual(null)
        })

        each([5, 26]).it("jump from square %d should switch turn", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength - 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength - 1), MoveKind.Jump);

            expect(generator.state.turn).toEqual("white")
        })

        each([40, 44]).it("jump from square %d should capture opponent's piece", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.Jump);

            expect(board[square + rowLength + 1]).toEqual(null)
        })

        each([40, 44]).it("jump from square %d should make destination piece a king", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[square + rowLength + 1] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.Jump);

            expect(board[square + 2 * (rowLength + 1)]).toEqual({ color: "black", kind: "king" })
        })

        describe("Multiple jumps", () => {
            each([3, 26]).it("should not switch turn when second jump is available",
                    (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[square + rowLength + 1] = { color: "white", kind: "man" }
                board[square + 3 * (rowLength + 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" });

                generator.movePiece(square, square + 2 * (rowLength + 1), MoveKind.Jump);

                expect(generator.state.turn).toEqual("black")
            });

            each([5, 21]).it("should generate a second jump",
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

            each([3, 26]).it("should not generate jump for another piece when jumping for the second time",
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

            each([42, 44]).it("should switch turn after a crowning jump, even when a new jump is possible", (square : number) => {
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
        each([1, 3, 5]).it("simple move should leave originating square %d empty", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }

            const result = movePiece({ board: board, turn: "black" }, square, square + rowLength + 1);

            expect(result.board[square]).toBe(null)
        })

        each([[1, "man"], [3, "king"]]).it("simple move from square %d %s should put piece in destination cell", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }

            const result = movePiece({ board: board, turn: "black" }, square, square + rowLength + 1);

            expect(result.board[square + rowLength + 1]).toEqual({ color: "black", kind: kind })
        })

        each([51, 53]).it("crowning move from square %d should make destination piece a king", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }

            const result = movePiece({ board: board, turn: "black" }, square, square + rowLength + 1);

            expect(result.board[square + rowLength + 1]).toEqual({ color: "black", kind: "king" })
        })

        it("should throw for a move from an empty square", () => {
            const board = emptyBoard.slice()

            expect(() => movePiece({ board: board, turn: "black" }, 3, 12)).toThrowError("Attempted to move from an empty square.");
        })
        
        describe("Multiple jumps", () => {
            each([3, 26]).it("should not generate jump for another piece when jumping for the second time",
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
            each([1, 3, 12]).it("should round-trip for simple move from square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const originalState = { board: board, turn: "black" };

                movePiece(originalState, square, square + rowLength + 1);

                const originalBoard = emptyBoard.slice()
                originalBoard[square] = { color: "black", kind: "man" }
                expect(originalState.board).toEqual(originalBoard)
            })

            each([51, 53]).it("should round-trip for crowning move from square %d", (square : number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const originalState = { board: board, turn: "black" };

                movePiece(originalState, square, square + rowLength + 1);

                const originalBoard = emptyBoard.slice()
                originalBoard[square] = { color: "black", kind: "man" }
                expect(originalState.board).toEqual(originalBoard)
            })
        })
    });

    describe("Undo destructive move", () => {
        each([1, 3, 5, 12]).it("should round-trip for simple move from square %d", (square : number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, square + rowLength + 1, MoveKind.Simple);
            generator.undoMove();

            const originalBoard = emptyBoard.slice()
            originalBoard[square] = { color: "black", kind: "man" }
            expect(generator.state.board).toEqual(originalBoard)
        })

        each([51, 53]).it("should round-trip for crowning move from square %d", (square : number) => {
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