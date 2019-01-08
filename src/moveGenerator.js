
export const MoveKind = {
    Simple: 0,
    Crowning: 1
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
        return this.movesForBlackManFrom(index, rowLength);
    }

    movesForBlackManFrom(index, rowLength) {
        const moves = [];
        if ((index & 0x7) !== 7)
            if (index > 47)
                moves.push(index + rowLength + 1, MoveKind.Crowning);
            else
                moves.push(index + rowLength + 1, MoveKind.Simple);
        if ((index & 0x7) !== 0)
            if (index > 47)
                moves.push(index + rowLength - 1, MoveKind.Crowning);
            else
                moves.push(index + rowLength - 1, MoveKind.Simple);
        return moves;
    }
}