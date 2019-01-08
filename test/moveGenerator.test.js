import each from 'jest-each';

import MoveGenerator, { MoveKind } from '../src/moveGenerator';

const emptyBoard = Array(64).fill(null)
const rowLength = 8

describe("Move Generator", () => {
    describe("Constructor", () => {
        it("should require a board", () => {
            expect(() => new MoveGenerator(null, "white")).toThrowError("A valid board state is required.")
        })

        it("should require a turn", () => {
            expect(() => new MoveGenerator(emptyBoard, null)).toThrowError("A valid player turn is required.")
        })

        it("should require a valid turn", () => {
            expect(() => new MoveGenerator(emptyBoard, "invalid")).toThrowError("A valid player turn is required.")
        })
    })

    describe("Black's turn", () => {
        each([9, 10, 11, 12, 13, 14]).it("should generate two simple moves for unobstructed black man at square %d", (index) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board, "white")

            const moves = generator.movesFrom(index)

            expect(moves).toEqual([
                index + rowLength + 1, MoveKind.Simple,
                index + rowLength - 1, MoveKind.Simple
            ])
        })

        each([0, 8, 16, 24, 32, 40]).it("should generate one simple move for unobstructed black man at square %d", (index) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board, "white")

            const moves = generator.movesFrom(index)

            expect(moves).toEqual([
                index + rowLength + 1, MoveKind.Simple
            ])
        })

        each([7, 15, 23, 31, 39, 47]).it("should generate one simple move for unobstructed black man at square %d", (index) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board, "white")

            const moves = generator.movesFrom(index)

            expect(moves).toEqual([
                index + rowLength - 1, MoveKind.Simple
            ])
        })

        each([49, 50, 51, 52, 53, 54]).it("should generate two crowning move for unobstructed black man at square %d", (index) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board, "white")

            const moves = generator.movesFrom(index)

            expect(moves).toEqual([
                index + rowLength + 1, MoveKind.Crowning,
                index + rowLength - 1, MoveKind.Crowning
            ])
        })

        each([48]).it("should generate one crowning move for unobstructed black man at square %d", (index) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board, "white")

            const moves = generator.movesFrom(index)

            expect(moves).toEqual([
                index + rowLength + 1, MoveKind.Crowning
            ])
        })

        each([55]).it("should generate one crowning move for unobstructed black man at square %d", (index) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board, "white")

            const moves = generator.movesFrom(index)

            expect(moves).toEqual([
                index + rowLength - 1, MoveKind.Crowning
            ])
        })

        each([0, 48]).it("should generate no moves for obstructed black man at square %d", (index) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: "man" }
            board[index + rowLength + 1] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board, "white")

            const moves = generator.movesFrom(index)

            expect(moves).toEqual([])
        })

        each([7, 55]).it("should generate no moves for obstructed black man at square %d", (index) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: "man" }
            board[index + rowLength - 1] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board, "white")

            const moves = generator.movesFrom(index)

            expect(moves).toEqual([])
        })
    })
})