export const MoveKind = {
    Simple: 0,
    Crowning: 1
}

const rowLength = 8

export default class MoveGenerator {
    constructor(board) {
        if (!board)
            throw Error("A valid board state is required.");
        this.board = board;
    }

    movesFrom(index) {
        if (this.board[index].color === "black")
            return this.movesForBlackManFrom(index);
        return this.movesForWhiteManFrom(index)
    }

    movesForWhiteManFrom(index) {
        const moves = []
        const moveKind = index < 16 ? MoveKind.Crowning : MoveKind.Simple;
        if ((index & 0x7) !== 7)
            this.pushMoveIfNotObstructed(index - rowLength + 1, moveKind, moves);
        if ((index & 0x7) !== 0)
            this.pushMoveIfNotObstructed(index - rowLength - 1, moveKind, moves);
        return moves;
    }

    movesForBlackManFrom(index) {
        const moves = [];
        const moveKind = index > 47 ? MoveKind.Crowning : MoveKind.Simple;
        if ((index & 0x7) !== 7)
            this.pushMoveIfNotObstructed(index + rowLength + 1, moveKind, moves);
        if ((index & 0x7) !== 0)
            this.pushMoveIfNotObstructed(index + rowLength - 1, moveKind, moves);
        return moves;
    }

    pushMoveIfNotObstructed(move, moveKind, moves) {
        if (!this.board[move])
            moves.push(move, moveKind);
    }

    movePiece(from, to, moveKind) {
        this.board[to] = this.board[from];
        this.board[from] = null;
        if (moveKind === MoveKind.Crowning)
            this.board[to].kind = "king";
    }
}