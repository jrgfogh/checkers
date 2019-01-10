import each from 'jest-each';

import MoveGenerator, { MoveKind } from '../src/moveGenerator';

const emptyBoard = Array(64).fill(null)
const rowLength = 8

describe("Move Generator", () => {
    it("should require a board", () => {
        expect(() => new MoveGenerator(null, "white")).toThrowError("A valid board state is required.")
    })

    describe("Black's turn", () => {
        describe("Man", () => {
            each([9, 10, 11, 12, 13, 14]).it("should generate two simple moves for unobstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([
                    index + rowLength + 1, MoveKind.Simple,
                    index + rowLength - 1, MoveKind.Simple
                ])
            })

            each([0, 8, 16, 24, 32, 40]).it("should generate one simple move for unobstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([
                    index + rowLength + 1, MoveKind.Simple
                ])
            })

            each([7, 15, 23, 31, 39, 47]).it("should generate one simple move for unobstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([
                    index + rowLength - 1, MoveKind.Simple
                ])
            })

            each([49, 50, 51, 52, 53, 54]).it("should generate two crowning move for unobstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([
                    index + rowLength + 1, MoveKind.Crowning,
                    index + rowLength - 1, MoveKind.Crowning
                ])
            })

            each([48]).it("should generate one crowning move for unobstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([
                    index + rowLength + 1, MoveKind.Crowning
                ])
            })

            each([55]).it("should generate one crowning move for unobstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([
                    index + rowLength - 1, MoveKind.Crowning
                ])
            })

            each([0, 48]).it("should generate no moves for obstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "black", kind: "man" }
                board[index + rowLength + 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([])
            })

            each([7, 55]).it("should generate no moves for obstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "black", kind: "man" }
                board[index + rowLength - 1] = { color: "black", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([])
            })
        })

        describe("King", () => {
            // TODO(jorgen.fogh): Write some tests!
        })
    })

    describe("White's turn", () => {
        describe("Man", () => {
            each([49, 50, 51, 52, 53, 54]).it("should generate two simple moves for unobstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "white", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([
                    index - rowLength + 1, MoveKind.Simple,
                    index - rowLength - 1, MoveKind.Simple
                ])
            })

            each([23, 31, 39, 47, 55, 63]).it("should generate one simple move for unobstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "white", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([
                    index - rowLength - 1, MoveKind.Simple
                ])
            })

            each([16, 24, 32, 40, 48, 56]).it("should generate one simple move for unobstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "white", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([
                    index - rowLength + 1, MoveKind.Simple
                ])
            })

            each([9, 10, 11, 12, 13, 14]).it("should generate two crowning move for unobstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "white", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([
                    index - rowLength + 1, MoveKind.Crowning,
                    index - rowLength - 1, MoveKind.Crowning
                ])
            })

            each([8]).it("should generate one crowning move for unobstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "white", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([
                    index - rowLength + 1, MoveKind.Crowning
                ])
            })

            each([15]).it("should generate one crowning move for unobstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "white", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([
                    index - rowLength - 1, MoveKind.Crowning
                ])
            })

            each([63]).it("should generate no moves for obstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "white", kind: "man" }
                board[index - rowLength - 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([])
            })

            each([56]).it("should generate no moves for obstructed at square %d", (index) => {
                const board = emptyBoard.slice()
                board[index] = { color: "white", kind: "man" }
                board[index - rowLength + 1] = { color: "white", kind: "man" }
                const generator = new MoveGenerator(board)

                const moves = generator.movesFrom(index)

                expect(moves).toEqual([])
            })
        })

        describe("King", () => {
            // TODO(jorgen.fogh): Write some tests!
        })
    })

    describe("Move piece", () => {
        each([0, 1, 2, 3]).it("normal move should leave originating square %d empty", (index) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board)

            generator.movePiece(index, index + rowLength + 1, MoveKind.Simple);

            expect(board[index]).toBe(null)
        })

        each([[0, "man"], [1, "king"]]).it("normal move from square %d %s should put piece in destination cell", (index, kind) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: kind }
            const generator = new MoveGenerator(board)

            generator.movePiece(index, index + rowLength + 1, MoveKind.Simple);

            expect(board[index + rowLength + 1]).toEqual({ color: "black", kind: kind })
        })

        each([52, 55]).it("crowning move from square %d should make destination piece a king", (index) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board);

            generator.movePiece(index, index + rowLength + 1, MoveKind.Crowning);

            expect(board[index + rowLength + 1]).toEqual({ color: "black", kind: "king" })
        })
    })
})