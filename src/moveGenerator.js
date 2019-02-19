// @flow

export type PieceModel = {
    kind: "king" | "man";
    color: "white" | "black";
};

export type GameModel = {
    board: Array<?PieceModel>,
    secondMove?: number,
    turn : "black" | "white"
};

export const MoveKind = {
    Simple: 0,
    Crowning: 1,
    Jump: 2,
    CrowningJump: 3
}

const rowLength = 8

export default class MoveGenerator {
    state: GameModel;
    history: (?PieceModel)[][];

    constructor(state: GameModel) {
        this.state = state;
        this.history = [];
    }

    movesFrom(square : number) {
        if (this.state.secondMove && this.state.secondMove !== square)
            return [];
        if (!this.state.board[square])
            throw Error("There is no piece in square" + square);
        if (this.state.board[square].kind === "king")
            return this.movesForKingFrom(square);
        if (this.state.turn === "black")
            return this.movesForBlackManFrom(square);
        return this.movesForWhiteManFrom(square)
    }

    movesForKingFrom(square : number) {
        const moves = [];
        this.pushUpTheBoardJumps(square, moves);
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
        const destination = this.state.board[square - rowLength + 1];
        if (square > 15 &&
                destination &&
                destination.color !== this.state.turn &&
                this.state.board[square - 2 * (rowLength - 1)] === null &&
                !squareIsAtRightEdge(square - rowLength + 1))
            moves.push(square - 2 * (rowLength - 1), jumpKind);
    }

    pushLeftUpTheBoardJump(square : number, moves : number[]) {
        const jumpKind = squareIsInFirstThreeRows(square) ? MoveKind.CrowningJump : MoveKind.Jump;
        const destination = this.state.board[square - rowLength - 1];
        if (square > 17 &&
                destination &&
                destination.color !== this.state.turn &&
                this.state.board[square - 2 * (rowLength + 1)] === null &&
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
        if (!this.state.board[square] || this.state.board[square].color !== this.state.turn)
            return false;
        const unusedMoves = [];
        if (this.state.turn === "black" || this.state.board[square].kind == "king")
            this.pushDownTheBoardJumps(square, unusedMoves);
        if (this.state.turn === "white" || this.state.board[square].kind == "king")
            this.pushUpTheBoardJumps(square, unusedMoves);
        return unusedMoves.length > 0;
    }

    pushDownTheBoardJumps(square : number, moves : number[]) {
        this.pushLeftDownTheBoardJump(square, moves);
        this.pushRightDownTheBoardJump(square, moves);
    }

    pushLeftDownTheBoardJump(square : number, moves : number[]) {
        const jumpKind = squareIsInLastThreeRows(square) ? MoveKind.CrowningJump : MoveKind.Jump;
        const destination = this.state.board[square + rowLength - 1];
        if (square < 48 &&
            destination &&
            destination.color !== this.state.turn &&
            !squareIsAtLeftEdge(square + rowLength - 1) &&
            this.state.board[square + 2 * (rowLength - 1)] === null)
        moves.push(square + 2 * (rowLength - 1), jumpKind);
    }

    pushRightDownTheBoardJump(square : number, moves : number[]) {
        const jumpKind = squareIsInLastThreeRows(square) ? MoveKind.CrowningJump : MoveKind.Jump;
        const destination = this.state.board[square + rowLength + 1];
        if (square < 46 &&
                destination &&
                destination.color !== this.state.turn &&
                !squareIsAtRightEdge(square + rowLength + 1) &&
                this.state.board[square + 2 * (rowLength + 1)] === null)
            moves.push(square + 2 * (rowLength + 1), jumpKind);
    }

    pushMoveIfNotObstructed(destination : number, moveKind : number, moves : number[]) {
        if (!this.state.board[destination])
            moves.push(destination, moveKind);
    }

    movePiece(from : number, to : number, moveKind : number) {
        if (!this.state.board[from])
            throw Error("Tried to move from empty square: " + from);
        const piece = this.state.board[from];
        this.history.push(deepCopy(this.state.board));
        this.state.board[to] = piece;
        this.state.board[from] = null;
        if (isCrowning(moveKind))
            piece.kind = "king";
        if (isJump(moveKind)) {
            this.state.board[midpoint(from, to)] = null;
            if (!this.canJumpFrom(to))
                this.state.turn = nextTurn(this.state.turn);
            else
                // TODO(jrgfogh): We never clear secondMove when moving destructively.
                this.state.secondMove = to;
        } else
            this.state.turn = nextTurn(this.state.turn);
    }

    undoMove() {
        this.state.board = this.history.pop();
    }

    isObstructed(square : number) {
        return this.state.board[square] !== null
    }
}

function deepCopy<T>(original: T) : T {
    return JSON.parse(JSON.stringify(original));
}

function nextTurn(turn) {
  if (turn === "white")
    return "black";
  return "white";
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

export function movePiece(state : GameModel, from : number, to : number) {
    if (!state.board[from])
        throw Error("Attempted to move from an empty square.");
    const result : GameModel = { board: state.board.slice(), turn: state.turn };
    const generator = new MoveGenerator(result);
    const moves = generator.movesFrom(from);
    for (let i = 0; i < moves.length; i += 2)
        if (moves[i] == to)
            generator.movePiece(from, to, moves[i + 1]);
    return result;
}

export function movesFrom(state : GameModel, from : number) {
    if (!state.board[from])
        throw Error("Attempted to move from an empty square.");
    // TODO(jrgfogh): Ensure that we own the piece we're trying to move.
    const generator = new MoveGenerator(state);
    return generator.movesFrom(from);
}