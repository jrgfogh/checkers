export const MoveKind = {
    Simple: 0,
    Crowning: 1,
    Jump: 2,
    CrowningJump: 3
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
        this.pushDownTheBoardJumps(square, moves);
        if (moves.length === 0 && !this.anyPieceCanJump(this.board[square].color)) {
            this.pushMainDiagonalForKing(square, moves);
            this.pushSecondaryDiagonalForKing(square, moves);
        }
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

        this.pushUpTheBoardJumps(square, moves);
        if (moves.length === 0 && !this.anyPieceCanJump("white")) {
            if (!squareIsAtRightEdge(square))
                this.pushMoveIfNotObstructed(square - rowLength + 1, moveKind, moves);
            if (!squareIsAtLeftEdge(square))
                this.pushMoveIfNotObstructed(square - rowLength - 1, moveKind, moves);
        }
        return moves;
    }

    pushUpTheBoardJumps(square, moves) {
        const jumpKind = squareIsInFirstThreeRows(square) ? MoveKind.CrowningJump : MoveKind.Jump;
        if (square > 15 &&
                this.board[square - rowLength + 1] !== null &&
                this.board[square - rowLength + 1].color !== "white" &&
                this.board[square - 2 * (rowLength - 1)] === null &&
                !squareIsAtRightEdge(square - rowLength + 1))
            moves.push(square - 2 * (rowLength - 1), jumpKind);
        if (square > 17 &&
                this.board[square - rowLength - 1] !== null &&
                this.board[square - rowLength - 1].color !== "white" &&
                this.board[square - 2 * (rowLength + 1)] === null &&
                !squareIsAtLeftEdge(square - rowLength - 1))
            moves.push(square - 2 * (rowLength + 1), jumpKind);
    }

    movesForBlackManFrom(square) {
        const moves = [];
        const moveKind = squareIsInLastTwoRows(square) ? MoveKind.Crowning : MoveKind.Simple;

        this.pushDownTheBoardJumps(square, moves);
        if (moves.length === 0 && !this.anyPieceCanJump("black")) {
            if (!squareIsAtRightEdge(square))
                this.pushMoveIfNotObstructed(square + rowLength + 1, moveKind, moves);

            if (!squareIsAtLeftEdge(square))
                this.pushMoveIfNotObstructed(square + rowLength - 1, moveKind, moves);
        }
        return moves;
    }

    anyPieceCanJump(turn) {
        for (let square = 0; square < 64; square++)
            if (this.canJumpFrom(square, turn))
                return true;
        return false;
    }

    canJumpFrom(square, turn) {
        if (this.board[square] === null || this.board[square].color !== turn)
            return false;
        const unusedMoves = [];
        if (turn === "black" || this.board[square].kind == "king")
            this.pushDownTheBoardJumps(square, unusedMoves);
        // TODO(jrgfogh): This criterion is wrong; white kings can jump up the board.
        if (turn === "white")
            this.pushUpTheBoardJumps(square, unusedMoves);
        return unusedMoves.length > 0;
    }

    pushDownTheBoardJumps(square, moves) {
        const jumpKind = squareIsInLastThreeRows(square) ? MoveKind.CrowningJump : MoveKind.Jump;
        const turn = this.board[square].color;
        if (square < 48 &&
                this.board[square + rowLength - 1] !== null &&
                this.board[square + rowLength - 1].color !== turn &&
                !squareIsAtLeftEdge(square + rowLength - 1) &&
                this.board[square + 2 * (rowLength - 1)] === null)
            moves.push(square + 2 * (rowLength - 1), jumpKind);
        if (square < 46 &&
                this.board[square + rowLength + 1] !== null &&
                this.board[square + rowLength + 1].color !== turn &&
                !squareIsAtRightEdge(square + rowLength + 1) &&
                this.board[square + 2 * (rowLength + 1)] === null)
            moves.push(square + 2 * (rowLength + 1), jumpKind);
    }

    pushMoveIfNotObstructed(move, moveKind, moves) {
        if (!this.board[move])
            moves.push(move, moveKind);
    }

    movePiece(from, to, moveKind) {
        this.board[to] = this.board[from];
        this.board[from] = null;
        if (isCrowning(moveKind))
            this.board[to].kind = "king";
        if (isJump(moveKind))
            this.board[midpoint(from, to)] = null;
    }

    isObstructed(square) {
        return this.board[square] !== null
    }
}

function isCrowning(moveKind) {
    return moveKind === MoveKind.Crowning || moveKind === MoveKind.CrowningJump;
}

function isJump(moveKind) {
    return moveKind === MoveKind.Jump || moveKind === MoveKind.CrowningJump;
}

function midpoint(from, to) {
    return (from + to) >> 1;
}

function squareIsInLastThreeRows(square) {
    return square > 39;
}

function squareIsInFirstThreeRows(square) {
    return square < 24;
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