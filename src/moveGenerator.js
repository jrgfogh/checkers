export const MoveKind = {
    Simple: 0,
    Crowning: 1,
    Jump: 2
}

const rowLength = 8

export default class MoveGenerator {
    constructor(board) {
        if (!board)
            throw Error("A valid board state is required.");
        this.board = board;
    }

    movesFrom(square) {
        if (this.board[square].kind === "king")
            return this.movesForKingFrom(square);
        if (this.board[square].color === "black")
            return this.movesForBlackManFrom(square);
        return this.movesForWhiteManFrom(square)
    }

    movesForKingFrom(square) {
        const moves = [];
        this.pushMainDiagonalForKing(square, moves);
        this.pushSecondaryDiagonalForKing(square, moves);
        return moves;
    }

    pushMainDiagonalForKing(square, moves) {
        for (let nextSquare = square - (rowLength + 1);
                // If nextSquare is at the right edge, it means we just wrapped around from the right side.
                !squareIsAtRightEdge(nextSquare) && !this.isObstructed(nextSquare);
                 nextSquare -= (rowLength + 1))
            moves.push(nextSquare, MoveKind.Simple);
        for (let nextSquare = square + (rowLength + 1);
                // If nextSquare is at the left edge, it means we just wrapped around from the right side.
                !squareIsAtLeftEdge(nextSquare) && !this.isObstructed(nextSquare); 
                nextSquare += (rowLength + 1))
            moves.push(nextSquare, MoveKind.Simple);
    }

    pushSecondaryDiagonalForKing(square, moves) {
        for (let nextSquare = square - (rowLength - 1);
                // If nextSquare is at the left edge, it means we just wrapped around from the right side.
                !squareIsAtLeftEdge(nextSquare) && !this.isObstructed(nextSquare);
                nextSquare -= (rowLength - 1))
            moves.push(nextSquare, MoveKind.Simple);
        for (let nextSquare = square + (rowLength - 1);
                // If nextSquare is at the right edge, it means we just wrapped around from the right side.
                !squareIsAtRightEdge(nextSquare) && !this.isObstructed(nextSquare);
                nextSquare += (rowLength - 1))
            moves.push(nextSquare, MoveKind.Simple);
    }

    movesForWhiteManFrom(square) {
        const moves = []
        const moveKind = squareIsInFirstTwoRows(square) ? MoveKind.Crowning : MoveKind.Simple;
        if (!squareIsAtRightEdge(square))
            this.pushMoveIfNotObstructed(square - rowLength + 1, moveKind, moves);
        if (!squareIsAtLeftEdge(square))
            this.pushMoveIfNotObstructed(square - rowLength - 1, moveKind, moves);
        return moves;
    }

    movesForBlackManFrom(square) {
        const moves = [];
        const moveKind = squareIsInLastTwoRows(square) ? MoveKind.Crowning : MoveKind.Simple;

        this.pushJumpsForBlackman(square, moves);

        if (!squareIsAtRightEdge(square))
            this.pushMoveIfNotObstructed(square + rowLength + 1, moveKind, moves);
        if (!squareIsAtLeftEdge(square))
            this.pushMoveIfNotObstructed(square + rowLength - 1, moveKind, moves);
        return moves;
    }

    pushJumpsForBlackman(square, moves) {
        if (square < 48 &&
                this.board[square + rowLength - 1] !== null &&
                this.board[square + rowLength - 1].color !== "black" &&
                this.board[square + 2 * (rowLength - 1)] === null)
            moves.push(square + 2 * (rowLength - 1), MoveKind.Jump);
        if (square < 46 &&
                this.board[square + rowLength + 1] !== null &&
                this.board[square + rowLength + 1].color !== "black" &&
                this.board[square + 2 * (rowLength + 1)] === null)
            moves.push(square + 2 * (rowLength + 1), MoveKind.Jump);
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
        else if (moveKind === MoveKind.Jump)
            this.board[midpoint(from, to)] = null;
    }

    isObstructed(square) {
        return this.board[square] !== null
    }
}

function midpoint(from, to) {
    return (from + to) >> 1;
}

function squareIsInLastTwoRows(square) {
    return square > 47;
}

function squareIsInFirstTwoRows(square) {
    return square < 16;
}

function squareIsAtLeftEdge(square) {
    return ((square & 0x7) === 0);
}

function squareIsAtRightEdge(square) {
    return (square & 0x7) === 7;
}

export function movePiece(board, from, to) {
    if (board[from] === null)
        throw Error("Attempted to move from an empty square.");
    const result = board.slice();
    const generator = new MoveGenerator(result);
    const moves = generator.movesFrom(from);
    for (let i = 0; i < moves.length; i += 2)
        if (moves[i] == to)
            generator.movePiece(from, to, moves[i + 1]);
    return result;
}

export function movesFrom(board, square) {
    const generator = new MoveGenerator(board);
    return generator.movesFrom(square);
}