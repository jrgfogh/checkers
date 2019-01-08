
export const MoveKinds = {
    Simple: 0
}

export default class MoveGenerator {
    constructor(board, turn) {
        if (!["white", "black"].includes(turn))
            throw Error("A valid player turn is required.");
        if (!board)
            throw Error("A valid board state is required.");
    }

    movesFrom(index) {
        const rowLength = 8
        const moves = []
        if ((index & 0x7) !== 7)
            moves.push(index + rowLength + 1, MoveKinds.Simple)
        if ((index & 0x7) !== 0)
            moves.push(index + rowLength - 1, MoveKinds.Simple)
        return moves
    }
}