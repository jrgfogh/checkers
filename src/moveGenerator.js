// @flow

export type PieceModel = {
    kind: string;
    color: string;
};

export const MoveKind = {
    Simple: 0,
    Crowning: 1,
    Jump: 2,
    CrowningJump: 3
}

const rowLength = 8

export default class MoveGenerator {
    board: Array<?PieceModel>;
    turn: string;

    constructor(board : Array<?PieceModel>) {
        if (!board)
            throw Error("A valid board state is required.");
        this.board = board;
    }

    movesFrom(square : number) {
        if (!this.board[square])
            throw Error("There is no piece in square" + square);
        // TODO(jrgfogh): Enforce a proper invariant for this.turn instead.
        this.turn = this.board[square].color;
        if (this.board[square].kind === "king")
            return this.movesForKingFrom(square);
        if (this.turn === "black")
            return this.movesForBlackManFrom(square);
        return this.movesForWhiteManFrom(square)
    }

    movesForKingFrom(square : number) {
        const moves = [];
        this.pushDownTheBoardJumps(square, moves);
        if (moves.length === 0 && !this.anyPieceCanJump()) {
            this.pushMainDiagonalForKing(square, moves);
            this.pushSecondaryDiagonalForKing(square, moves);
        }
        return moves;
    }

    pushMainDiagonalForKing(square : number, moves : number[]) {
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

    pushSecondaryDiagonalForKing(square : number, moves : number[]) {
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

    movesForWhiteManFrom(square : number) {
        const moves = []
        const moveKind = squareIsInFirstTwoRows(square) ? MoveKind.Crowning : MoveKind.Simple;

        this.pushUpTheBoardJumps(square, moves);
        if (moves.length === 0 && !this.anyPieceCanJump()) {
            if (!squareIsAtRightEdge(square))
                this.pushMoveIfNotObstructed(square - rowLength + 1, moveKind, moves);
            if (!squareIsAtLeftEdge(square))
                this.pushMoveIfNotObstructed(square - rowLength - 1, moveKind, moves);
        }
        return moves;
    }

    pushUpTheBoardJumps(square : number, moves : number[]) {
        this.pushRightUpTheBoardJump(square, moves);
        this.pushLeftUpTheBoardJump(square, moves);
    }

    pushRightUpTheBoardJump(square : number, moves : number[]) {
        const jumpKind = squareIsInFirstThreeRows(square) ? MoveKind.CrowningJump : MoveKind.Jump;
        const destination = this.board[square - rowLength + 1];
        if (square > 15 &&
                destination &&
                destination.color !== this.turn &&
                this.board[square - 2 * (rowLength - 1)] === null &&
                !squareIsAtRightEdge(square - rowLength + 1))
            moves.push(square - 2 * (rowLength - 1), jumpKind);
    }

    pushLeftUpTheBoardJump(square : number, moves : number[]) {
        const jumpKind = squareIsInFirstThreeRows(square) ? MoveKind.CrowningJump : MoveKind.Jump;
        const destination = this.board[square - rowLength - 1];
        if (square > 17 &&
                destination &&
                destination.color !== this.turn &&
                this.board[square - 2 * (rowLength + 1)] === null &&
                !squareIsAtLeftEdge(square - rowLength - 1))
            moves.push(square - 2 * (rowLength + 1), jumpKind);
    }

    movesForBlackManFrom(square : number) {
        const moves = [];
        const moveKind = squareIsInLastTwoRows(square) ? MoveKind.Crowning : MoveKind.Simple;

        this.pushDownTheBoardJumps(square, moves);
        if (moves.length === 0 && !this.anyPieceCanJump()) {
            if (!squareIsAtRightEdge(square))
                this.pushMoveIfNotObstructed(square + rowLength + 1, moveKind, moves);

            if (!squareIsAtLeftEdge(square))
                this.pushMoveIfNotObstructed(square + rowLength - 1, moveKind, moves);
        }
        return moves;
    }

    anyPieceCanJump() {
        for (let square = 0; square < 64; square++)
            if (this.canJumpFrom(square))
                return true;
        return false;
    }

    canJumpFrom(square : number) {
        if (!this.board[square] || this.board[square].color !== this.turn)
            return false;
        const unusedMoves = [];
        if (this.turn === "black" || this.board[square].kind == "king")
            this.pushDownTheBoardJumps(square, unusedMoves);
        if (this.turn === "white" || this.board[square].kind == "king")
            this.pushUpTheBoardJumps(square, unusedMoves);
        return unusedMoves.length > 0;
    }

    pushDownTheBoardJumps(square : number, moves : number[]) {
        this.pushLeftDownTheBoardJump(square, moves);
        this.pushRightDownTheBoardJump(square, moves);
    }

    pushLeftDownTheBoardJump(square : number, moves : number[]) {
        const jumpKind = squareIsInLastThreeRows(square) ? MoveKind.CrowningJump : MoveKind.Jump;
        const destination = this.board[square + rowLength - 1];
        if (square < 48 &&
            destination &&
            destination.color !== this.turn &&
            !squareIsAtLeftEdge(square + rowLength - 1) &&
            this.board[square + 2 * (rowLength - 1)] === null)
        moves.push(square + 2 * (rowLength - 1), jumpKind);
    }

    pushRightDownTheBoardJump(square : number, moves : number[]) {
        const jumpKind = squareIsInLastThreeRows(square) ? MoveKind.CrowningJump : MoveKind.Jump;
        const destination = this.board[square + rowLength + 1];
        if (square < 46 &&
                destination &&
                destination.color !== this.turn &&
                !squareIsAtRightEdge(square + rowLength + 1) &&
                this.board[square + 2 * (rowLength + 1)] === null)
            moves.push(square + 2 * (rowLength + 1), jumpKind);
    }

    pushMoveIfNotObstructed(destination : number, moveKind : number, moves : number[]) {
        if (!this.board[destination])
            moves.push(destination, moveKind);
    }

    movePiece(from : number, to : number, moveKind : number) {
        if (!this.board[from])
            throw Error("Tried to move from empty square: " + from);
        const piece = this.board[from];
        this.board[to] = piece;
        this.board[from] = null;
        if (isCrowning(moveKind))
            piece.kind = "king";
        if (isJump(moveKind))
            this.board[midpoint(from, to)] = null;
    }

    isObstructed(square : number) {
        return this.board[square] !== null
    }
}

function isCrowning(moveKind : number) {
    return moveKind === MoveKind.Crowning || moveKind === MoveKind.CrowningJump;
}

function isJump(moveKind : number) {
    return moveKind === MoveKind.Jump || moveKind === MoveKind.CrowningJump;
}

function midpoint(from : number, to : number) {
    return (from + to) >> 1;
}

function squareIsInLastThreeRows(square : number) {
    return square > 39;
}

function squareIsInFirstThreeRows(square : number) {
    return square < 24;
}

function squareIsInLastTwoRows(square : number) {
    return square > 47;
}

function squareIsInFirstTwoRows(square : number) {
    return square < 16;
}

function squareIsAtLeftEdge(square : number) {
    return ((square & 0x7) === 0);
}

function squareIsAtRightEdge(square : number) {
    return (square & 0x7) === 7;
}

export function movePiece(board : Array<?PieceModel>, from : number, to : number) {
    if (board[from] === null)
        throw Error("Attempted to move from an empty square.");
    const result : Array<?PieceModel> = board.slice();
    const generator = new MoveGenerator(result);
    const moves = generator.movesFrom(from);
    for (let i = 0; i < moves.length; i += 2)
        if (moves[i] == to)
            generator.movePiece(from, to, moves[i + 1]);
    return result;
}

export function movesFrom(board : Array<?PieceModel>, square : number) {
    const generator = new MoveGenerator(board);
    return generator.movesFrom(square);
}