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
        this.board = board;
    }

    movesFrom(index) {
        const rowLength = 8
        return this.movesForBlackManFrom(index, rowLength);
    }

    movesForBlackManFrom(index, rowLength) {
        const moves = [];
        const moveKind = index > 47 ? MoveKind.Crowning : MoveKind.Simple;
        if ((index & 0x7) !== 7)
        {
            const move = index + rowLength + 1
            this.pushMoveIfNotObstructed(move, moveKind, moves);
        }
        if ((index & 0x7) !== 0)
        {
            const move = index + rowLength - 1;
            this.pushMoveIfNotObstructed(move, moveKind, moves);
        }
        return moves;
    }

    pushMoveIfNotObstructed(move, moveKind, moves) {
        if (!this.board[move])
            moves.push(move, moveKind);
    }
}