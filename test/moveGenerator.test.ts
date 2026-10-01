import each from 'jest-each';

import MoveGenerator, { MoveKind, movesFrom, movePiece, squareAt } from './moveGeneratorTestWrapper';

const emptyBoard = Array(33).fill(null)

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
            each([32, 27, 26, 25, 24, 17, 16]).it("should generate two simple moves for unobstructed at square %d", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    squareAt(square, 1, 1), MoveKind.Simple,
                    squareAt(square, 1, -1), MoveKind.Simple
                ])
            })

            each([28, 20, 12]).it("should generate one simple move for unobstructed at square %d", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    squareAt(square, 1, 1), MoveKind.Simple
                ])
            })

            each([29, 21, 13]).it("should generate one simple move for unobstructed at square %d", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    squareAt(square, 1, -1), MoveKind.Simple
                ])
            })

            each([8, 7, 6]).it("should generate two crowning move for unobstructed at square %d", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    squareAt(square, 1, 1), MoveKind.Crowning,
                    squareAt(square, 1, -1), MoveKind.Crowning
                ])
            })

            each([5]).it("should generate one crowning move for unobstructed at square %d", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "black" });

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    squareAt(square, 1, -1), MoveKind.Crowning
                ])
            })

            each([32, 8]).it("should generate no moves for obstructed at square %d", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[squareAt(square, 1, -1)] = { color: "black", kind: "man" }
                board[squareAt(square, 1, 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([])
            })

            each([29, 5]).it("should generate no moves for obstructed at square %d", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[squareAt(square, 1, -1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([])
            })
        })

        describe("Jumps", () => {
            each([31, 22]).it("should generate two jumps from square %d when possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Pieces to jump over.
                board[squareAt(square, 1, -1)] = { color: "white", kind: "man" }
                board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    squareAt(square, 2, -2), MoveKind.Jump,
                    squareAt(square, 2, 2), MoveKind.Jump
                ]);
            });

            each([32, 28, 24, 20, 16]).it("should generate one jump from square %d when possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Piece to jump over.
                board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    squareAt(square, 2, 2), MoveKind.Jump
                ]);
            });

            each([29, 25, 21, 13]).it("should generate one jump from square %d when possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Piece to jump over.
                board[squareAt(square, 1, -1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    squareAt(square, 2, -2), MoveKind.Jump
                ]);
            });

            each([32]).it("should not generate any jumps from square %d when obstructed", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[squareAt(square, 1, -1)] = { color: "white", kind: "man" }
                // Piece to *not* jump over.
                board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
                // Piece blocking the jump.
                board[squareAt(square, 2, 2)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([17]).it("should not generate a jump over the right side of the board from square %d", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Piece to *not* jump over.
                board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
                // Piece blocking the other diagonal
                board[squareAt(square, 1, -1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([16]).it("should not generate a jump over the left side of the board from square %d", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Piece to *not* jump over.
                board[squareAt(square, 1, -1)] = { color: "white", kind: "man" }
                // Piece blocking the other diagonal
                board[squareAt(square, 1, 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([11, 10]).it("should generate two jumps from square %d when possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Pieces to jump over.
                board[squareAt(square, 1, -1)] = { color: "white", kind: "man" }
                board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    squareAt(square, 2, -2), MoveKind.Jump,
                    squareAt(square, 2, 2), MoveKind.Jump
                ]);
            });

            each([12, 11]).it("should generate one jump from square %d when possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Piece to jump over.
                board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    squareAt(square, 2, 2), MoveKind.Jump
                ]);
            });
        })
    })

    describe("White man", () => {
        each([24, 17, 16, 8, 7, 6]).it("should generate two simple moves for unobstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                squareAt(square, -1, 1), MoveKind.Simple,
                squareAt(square, -1, -1), MoveKind.Simple
            ])
        })

        each([21, 13, 5]).it("should generate one simple move for unobstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([
                squareAt(square, -1, -1), MoveKind.Simple
            ])
        })

        each([20, 12, 4]).it("should generate one simple move for unobstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                squareAt(square, -1, 1), MoveKind.Simple
            ])
        })

        each([27, 26, 25]).it("should generate two crowning move for unobstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                squareAt(square, -1, 1), MoveKind.Crowning,
                squareAt(square, -1, -1), MoveKind.Crowning
            ])
        })

        each([28]).it("should generate one crowning move for unobstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                squareAt(square, -1, 1), MoveKind.Crowning
            ])
        })

        each([26, 25]).it("should generate two crowning moves for unobstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                squareAt(square, -1, 1), MoveKind.Crowning,
                squareAt(square, -1, -1), MoveKind.Crowning
            ])
        })

        each([1]).it("should generate no moves for obstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            board[squareAt(square, -1, -1)] = { color: "white", kind: "man" };
            board[squareAt(square, -1, 1)] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        })

        each([4]).it("should generate no moves for obstructed at square %d", (square: number) => {
            const board = emptyBoard.slice();
            board[square] = { color: "white", kind: "man" };
            board[squareAt(square, -1, 1)] = { color: "white", kind: "man" };
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        })

        describe("Jumps", () => {
            each([2, 18, 10]).it("should generate two jumps from square %d when possible", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "white", kind: "man" };
                // Pieces to jump over.
                board[squareAt(square, -1, -1)] = { color: "black", kind: "man" };
                board[squareAt(square, -1, 1)] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "white" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    squareAt(square, -2, 2), MoveKind.Jump,
                    squareAt(square, -2, -2), MoveKind.Jump
                ]);
            });

            each([21, 13, 5]).it("should generate one jump from square %d when possible", (square: number) => {
                const board = emptyBoard.slice();
                board[square] = { color: "white", kind: "man" };
                // Piece to jump over.
                board[squareAt(square, -1, -1)] = { color: "black", kind: "man" };
                const generator = new MoveGenerator({ board: board, turn: "white" });

                const moves = generator.movesFrom(square);

                expect(moves).toEqual([
                    squareAt(square, -2, -2), MoveKind.Jump
                ]);
            });

            each([1]).it("should not generate any jumps from square %d when obstructed", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Piece to *not* jump over.
                board[squareAt(square, -1, -1)] = { color: "black", kind: "man" }
                // Piece blocking the jump.
                board[squareAt(square, -2, -2)] = { color: "white", kind: "man" }
                // Piece blocking the simple move.
                board[squareAt(square, -1, 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([12]).it("should not generate any jumps from square %d when obstructed", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Piece to *not* jump over.
                board[squareAt(square, -1, 1)] = { color: "black", kind: "man" }
                // Piece blocking the jump.
                board[squareAt(square, -2, 2)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([17]).it("should not generate a jump over the right side of the board from square %d", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Piece to *not* jump over.
                board[squareAt(square, -1, 1)] = { color: "black", kind: "man" }
                // Piece blocking the other diagonal
                board[squareAt(square, -1, -1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([24]).it("should not generate a jump over the left side of the board from square %d", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Piece to *not* jump over.
                board[squareAt(square, -1, -1)] = { color: "black", kind: "man" }
                // Piece blocking the other diagonal
                board[squareAt(square, -1, 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([]);
            });

            each([23, 22]).it("should generate two jumps from square %d when possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Pieces to jump over.
                board[squareAt(square, -1, -1)] = { color: "black", kind: "man" }
                board[squareAt(square, -1, 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    squareAt(square, -2, 2), MoveKind.Jump,
                    squareAt(square, -2, -2), MoveKind.Jump
                ]);
            });

            each([22, 21]).it("should generate one jump from square %d when possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Pieces to jump over.
                board[squareAt(square, -1, -1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    squareAt(square, -2, -2), MoveKind.Jump
                ]);
            });

            each([24]).it("should generate one jump from square %d when possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "man" }
                // Pieces to jump over.
                board[squareAt(square, -1, 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "white" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    squareAt(square, -2, 2), MoveKind.Jump
                ]);
            });
        });
    });

    describe("King", () => {
        describe("Main diagonal", () => {
            each([["white"], ["black"]]).it("should generate two diagonal simple moves for %s king in square 32", (color) => {
                const board = emptyBoard.slice()
                board[32] = { color: color, kind: "king" }
                const generator = new MoveGenerator({ board: board, turn: color })

                const moves = generator.movesFrom(32);
                expect(moves).toEqual([
                    squareAt(32, 1, 1), MoveKind.Simple,
                    squareAt(32, 1, -1), MoveKind.Simple
                ]);
            })

            it("should generate two diagonal simple moves for king in square 1", () => {
                const board = emptyBoard.slice()
                board[1] = { color: "black", kind: "king" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(1);
                expect(moves).toEqual([
                    squareAt(1, -1, -1), MoveKind.Simple,
                    squareAt(1, -1, 1), MoveKind.Simple
                ]);
            })

            each([31, 30]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "king" }
                board[squareAt(square, 1, -1)] = { color: "black", kind: "man" }
                board[squareAt(square, 2, -2)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    squareAt(square, 1, 1), MoveKind.Simple
                ]);
            })

            each([27]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[squareAt(square, 1, -1)] = { color: "black", kind: "man" }
                board[squareAt(square, 2, -2)] = { color: "black", kind: "man" }
                board[squareAt(square, -1, 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    32, MoveKind.Simple,
                    23, MoveKind.Simple
                ]);
            })

            each([22]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[squareAt(square, 1, -1)] = { color: "black", kind: "man" }
                board[squareAt(square, 2, -2)] = { color: "black", kind: "man" }
                board[squareAt(square, -1, 1)] = { color: "black", kind: "man" }
                board[squareAt(square, -2, 2)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    26, MoveKind.Simple,
                    17, MoveKind.Simple
                ]);
            })

            each([16]).it("should generate main diagonal simple moves for king in square %d, when he's obstructed on the secondary diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[squareAt(square, 1, -1)] = { color: "black", kind: "man" }
                board[squareAt(square, -1, 1)] = { color: "black", kind: "man" }
                board[squareAt(square, -2, 2)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    20, MoveKind.Simple,
                    11, MoveKind.Simple
                ]);
            })

            it("should generate no moves for completely obstructed king in square 32", () => {
                const board = emptyBoard.slice()
                board[32] = { color: "white", kind: "king" }
                board[squareAt(32, 1, -1)] = { color: "black", kind: "man" }
                board[squareAt(32, 1, 1)] = { color: "black", kind: "man" }
                board[squareAt(32, 2, 2)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(32)
                expect(moves).toEqual([]);
            })

            it("should generate no moves for completely obstructed king in square 1", () => {
                const board = emptyBoard.slice()
                board[1] = { color: "white", kind: "king" }
                board[squareAt(1, -1, 1)] = { color: "black", kind: "man" }
                board[squareAt(1, -1, -1)] = { color: "black", kind: "man" }
                board[squareAt(1, -2, -2)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(1)
                expect(moves).toEqual([]);
            })
        })

        describe("Secondary diagonal", () => {
            it("should generate a diagonal simple move for %s king in square 29", () => {
                const board = emptyBoard.slice()
                board[29] = { color: "black", kind: "king" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(29);
                expect(moves).toEqual([
                    squareAt(29, 1, -1), MoveKind.Simple
                ]);
            })

            it("should generate a diagonal simple move for %s king in square 4", () => {
                const board = emptyBoard.slice()
                board[4] = { color: "black", kind: "king" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(4);
                expect(moves).toEqual([
                    squareAt(4, -1, 1), MoveKind.Simple
                ]);
            })

            each([32, 31, 30]).it("should generate a simple move on the secondary diagonal for king in square %d, when he's obstructed on the main diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "king" }
                board[squareAt(square, 1, 1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    squareAt(square, 1, -1), MoveKind.Simple
                ]);
            })

            each([27]).it("should generate secondary diagonal simple moves for king in square %d, when he's obstructed on the main diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[squareAt(square, 1, 1)] = { color: "black", kind: "man" }
                board[squareAt(square, 2, 2)] = { color: "black", kind: "man" }
                board[squareAt(square, -1, -1)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    31, MoveKind.Simple,
                    24, MoveKind.Simple
                ]);
            })

            each([5]).it("should generate secondary diagonal simple moves for king in square %d, when he's obstructed on the main diagonal", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "white", kind: "king" }
                board[squareAt(square, -1, -1)] = { color: "black", kind: "man" }
                board[squareAt(square, -2, -2)] = { color: "black", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)
                expect(moves).toEqual([
                    1, MoveKind.Simple
                ]);
            })
        })
        
        describe("Jumps", () => {
            each([19, 18, 15, 14]).it("should generate four jumps from square %d when possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "king" }
                board[squareAt(square, -1, -1)] = { color: "white", kind: "man" }
                board[squareAt(square, -1, 1)] = { color: "white", kind: "man" }
                board[squareAt(square, 1, -1)] = { color: "white", kind: "man" }
                board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                const moves = generator.movesFrom(square)

                expect(moves).toEqual([
                    squareAt(square, -2, 2), MoveKind.Jump,
                    squareAt(square, -2, -2), MoveKind.Jump,
                    squareAt(square, 2, -2), MoveKind.Jump,
                    squareAt(square, 2, 2), MoveKind.Jump
                ]);
            });
        })
    })

    describe("Forced capture", () => {
        each([[31, "man"], [30, "king"]]).it("should not generate a simple move when a jump is possible from square %d for %s", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            const moves = generator.movesFrom(square)

            expect(moves).toEqual([squareAt(square, 2, 2), MoveKind.Jump]);
        });

        each([[30, 22, "man"], [27, 16, "man"], [30, 22, "king"], [27, 16, "king"]]).
                it("should not generate any simple moves from square %d when a jump is possible from square %d for black %s", (square, otherSquare, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            board[otherSquare] = { color: "black", kind: "man" }
            board[squareAt(otherSquare, 1, 1)] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[30, 22, "man"], [27, 16, "man"], [7, 22, "king"], [27, 16, "king"]]).
                it("should not generate any simple moves from square %d when a jump is possible from square %d for white %s", (square, otherSquare, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: kind }
            board[otherSquare] = { color: "white", kind: "man" }
            board[squareAt(otherSquare, -1, 1)] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[2, 22], [6, 16]]).it("should generate simple moves for white from square %d when a white man could jump from square %d, if it had been black", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[otherSquare] = { color: "white", kind: "man" }
            board[squareAt(otherSquare, 1, 1)] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                squareAt(square, -1, 1), MoveKind.Simple,
                squareAt(square, -1, -1), MoveKind.Simple
            ]);
        });

        each([[2, 22], [6, 16]]).it("should not generate simple moves for white from square %d when a white king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[otherSquare] = { color: "white", kind: "king" }
            board[squareAt(otherSquare, 1, 1)] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[3, 22], [6, 15]]).it("should not generate simple moves for white from square %d when a white king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "man" }
            board[otherSquare] = { color: "white", kind: "king" }
            board[squareAt(otherSquare, 1, -1)] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[31, 22], [30, 16]]).it("should not generate simple moves for black from square %d when a black king can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[otherSquare] = { color: "black", kind: "king" }
            board[squareAt(otherSquare, -1, 1)] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[30, 22], [27, 16]]).it("should not generate any simple moves from square %d when a jump is possible from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[otherSquare] = { color: "black", kind: "man" }
            board[squareAt(otherSquare, 1, 1)] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([]);
        });

        each([[30, 22], [27, 16]]).it("should generate simple moves for black from square %d when a white man can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[otherSquare] = { color: "black", kind: "man" }
            board[squareAt(otherSquare, 1, 1)] = { color: "white", kind: "man" }
            board[squareAt(otherSquare, 2, 2)] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            const moves = generator.movesFrom(square);

            expect(moves).toEqual([
                squareAt(square, 1, 1), MoveKind.Simple,
                squareAt(square, 1, -1), MoveKind.Simple
            ]);
        });

        each([[11, 22], [14, 15]]).it("should generate moves for white king from square %d when a black man can jump from square %d", (square, otherSquare) => {
            const board = emptyBoard.slice()
            board[square] = { color: "white", kind: "king" }
            board[otherSquare] = { color: "white", kind: "man" }
            board[squareAt(otherSquare, -1, 1)] = { color: "black", kind: "man" }
            board[squareAt(otherSquare, -2, 2)] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "white" });

            const moves = generator.movesFrom(square);

            expect(moves.length).toBeGreaterThan(0)
        });
    })

    describe("Move piece destructively", () => {
        each([32, 31, 30]).it("simple move should leave originating square %d empty", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, squareAt(square, 1, 1), MoveKind.Simple);

            expect(board[square]).toBe(null)
        })

        each([[32, "man"], [31, "king"]]).it("simple move from square %d %s should put piece in destination cell", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, squareAt(square, 1, 1), MoveKind.Simple);

            expect(board[squareAt(square, 1, 1)]).toEqual({ color: "black", kind: kind })
        })

        each([7, 6]).it("crowning move from square %d should make destination piece a king", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, squareAt(square, 1, 1), MoveKind.Crowning);

            expect(board[squareAt(square, 1, 1)]).toEqual({ color: "black", kind: "king" })
        })

        each([30, 19]).it("jump from square %d should capture opponent's piece", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, squareAt(square, 2, 2), MoveKind.Jump);

            expect(board[squareAt(square, 1, 1)]).toEqual(null)
        })

        each([30, 19]).it("jump from square %d should capture opponent's piece", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[squareAt(square, 1, -1)] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, squareAt(square, 2, -2), MoveKind.Jump);

            expect(board[squareAt(square, 1, -1)]).toEqual(null)
        })

        each([30, 19]).it("jump from square %d should switch turn", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[squareAt(square, 1, -1)] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, squareAt(square, 2, -2), MoveKind.Jump);

            expect(generator.state.turn).toEqual("white")
        })

        each([12, 10]).it("jump from square %d should capture opponent's piece", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, squareAt(square, 2, 2), MoveKind.Jump);

            expect(board[squareAt(square, 1, 1)]).toEqual(null)
        })

        each([12, 10]).it("jump from square %d should make destination piece a king", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" });

            generator.movePiece(square, squareAt(square, 2, 2), MoveKind.Jump);

            expect(board[squareAt(square, 2, 2)]).toEqual({ color: "black", kind: "king" })
        })

        describe("Multiple jumps", () => {
            each([31, 19]).it("should not switch turn when second jump is available",
                    (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
                board[squareAt(square, 3, 3)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" });

                generator.movePiece(square, squareAt(square, 2, 2), MoveKind.Jump);

                expect(generator.state.turn).toEqual("black")
            });

            each([30, 22]).it("should generate a second jump",
                    (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                board[squareAt(square, 1, -1)] = { color: "white", kind: "man" }
                board[squareAt(square, 3, -3)] = { color: "white", kind: "man" }
                const firstJumpDestination = squareAt(square, 2, -2);
                const generator = new MoveGenerator({ board: board, turn: "black" });

                generator.movePiece(square, firstJumpDestination, MoveKind.Jump);

                expect(generator.movesFrom(firstJumpDestination)).toEqual([
                        squareAt(square, 4, -4), MoveKind.Jump
                    ])
            });

            each([31, 19]).it("should not generate jump for another piece when jumping for the second time",
                    (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const rivalSquare = squareAt(square, 2, 2) + 2;
                board[rivalSquare] = { color: "black", kind: "man" }
                board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
                board[squareAt(square, 3, 3)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" });

                generator.movePiece(square, squareAt(square, 2, 2), MoveKind.Jump);

                expect(generator.movesFrom(rivalSquare)).toEqual([])
            });

            each([11, 10]).it("should switch turn after a crowning jump, even when a new jump is possible", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                // Pieces to jump over.
                board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
                board[squareAt(square, 1, 3)] = { color: "white", kind: "man" }
                const generator = new MoveGenerator({ board: board, turn: "black" })

                generator.movePiece(square, squareAt(square, 2, 2), MoveKind.Jump);

                expect(generator.state.turn).toEqual("white");
            });
        });
    })

    describe("Move piece observationally purely", () => {
        each([32, 31, 30]).it("simple move should leave originating square %d empty", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }

            const result = movePiece({ board: board, turn: "black" }, square, squareAt(square, 1, 1));

            expect(result.board[square]).toBe(null)
        })

        each([[32, "man"], [31, "king"]]).it("simple move from square %d %s should put piece in destination cell", (square, kind) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: kind }

            const result = movePiece({ board: board, turn: "black" }, square, squareAt(square, 1, 1));

            expect(result.board[squareAt(square, 1, 1)]).toEqual({ color: "black", kind: kind })
        })

        each([7, 6]).it("crowning move from square %d should make destination piece a king", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }

            const result = movePiece({ board: board, turn: "black" }, square, squareAt(square, 1, 1));

            expect(result.board[squareAt(square, 1, 1)]).toEqual({ color: "black", kind: "king" })
        })

        it("should throw for a move from an empty square", () => {
            const board = emptyBoard.slice()

            expect(() => movePiece({ board: board, turn: "black" }, 3, 12)).toThrow("Attempted to move from an empty square.");
        })
        
        describe("Multiple jumps", () => {
            each([31, 19]).it("should not generate jump for another piece when jumping for the second time",
                    (square) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const rivalSquare = squareAt(square, 2, 2) + 2;
                board[rivalSquare] = { color: "black", kind: "man" }
                board[squareAt(square, 1, 1)] = { color: "white", kind: "man" }
                board[squareAt(square, 3, 3)] = { color: "white", kind: "man" }

                const result = movePiece({ board: board, turn: "black" },
                    square, squareAt(square, 2, 2));

                expect(movesFrom(result, rivalSquare)).toEqual([])
            });
        });

        describe("Undo move", () => {
            each([32, 31, 26]).it("should round-trip for simple move from square %d", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const originalState = { board: board, turn: "black" as const };

                movePiece(originalState, square, squareAt(square, 1, 1));

                const originalBoard = emptyBoard.slice()
                originalBoard[square] = { color: "black", kind: "man" }
                expect(originalState.board).toEqual(originalBoard)
            })

            each([7, 6]).it("should round-trip for crowning move from square %d", (square: number) => {
                const board = emptyBoard.slice()
                board[square] = { color: "black", kind: "man" }
                const originalState = { board: board, turn: "black" as const };

                movePiece(originalState, square, squareAt(square, 1, 1));

                const originalBoard = emptyBoard.slice()
                originalBoard[square] = { color: "black", kind: "man" }
                expect(originalState.board).toEqual(originalBoard)
            })
        })
    });

    describe("Undo destructive move", () => {
        each([32, 31, 30, 26]).it("should round-trip for simple move from square %d", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, squareAt(square, 1, 1), MoveKind.Simple);
            generator.undoMove();

            const originalBoard = emptyBoard.slice()
            originalBoard[square] = { color: "black", kind: "man" }
            expect(generator.state.board).toEqual(originalBoard)
        })

        each([7, 6]).it("should round-trip for crowning move from square %d", (square: number) => {
            const board = emptyBoard.slice()
            board[square] = { color: "black", kind: "man" }
            const generator = new MoveGenerator({ board: board, turn: "black" })

            generator.movePiece(square, squareAt(square, 1, 1), MoveKind.Crowning);
            generator.undoMove();

            const originalBoard = emptyBoard.slice()
            originalBoard[square] = { color: "black", kind: "man" }
            expect(generator.state.board).toEqual(originalBoard)
        })
    })

    describe("Functional movesFrom()", () => {
        it("should generate two diagonal simple moves for king in square 1", () => {
            const board = emptyBoard.slice()
            board[1] = { color: "black", kind: "king" }

            const moves = movesFrom({ board: board, turn: "black" }, 1);
            expect(moves).toEqual([
                squareAt(1, -1, -1), MoveKind.Simple,
                squareAt(1, -1, 1), MoveKind.Simple
            ]);
        })      
    })
})
