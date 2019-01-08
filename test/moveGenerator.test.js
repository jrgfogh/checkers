import each from 'jest-each';

import MoveGenerator, { MoveKinds } from '../src/moveGenerator';

const emptyBoard = Array(64).fill(null)

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

            const rowLength = 8
            expect(moves).toEqual([
                index + rowLength + 1, MoveKinds.Simple,
                index + rowLength - 1, MoveKinds.Simple
            ])
        })

        each([8, 16, 24, 32, 40, 48]).it("should generate one simple move for unobstructed black man at square %d", (index) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board, "white")

            const moves = generator.movesFrom(index)

            const rowLength = 8
            expect(moves).toEqual([
                index + rowLength + 1, MoveKinds.Simple
            ])
        })

        each([7, 15, 23, 31, 39, 47]).it("should generate one simple move for unobstructed black man at square %d", (index) => {
            const board = emptyBoard.slice()
            board[index] = { color: "black", kind: "man" }
            const generator = new MoveGenerator(board, "white")

            const moves = generator.movesFrom(index)

            const rowLength = 8
            expect(moves).toEqual([
                index + rowLength - 1, MoveKinds.Simple
            ])
        })
    })
})