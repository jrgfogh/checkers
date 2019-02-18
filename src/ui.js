// @flow

import React from 'react';
import { movesFrom, movePiece } from './moveGenerator';
import type { PieceModel, GameModel } from './moveGenerator';

function Piece(props : PieceModel) {
  return <div className={"piece " + props.color + "-piece " + props.kind}>
    <div className="piece-center" />
  </div>;
}

type SquareProps = {
  color: "white" | "black",
  selected: boolean,
  canMoveTo: boolean,
  piece?: ?PieceModel,
  turn: "white" | "black",
  onClick: () => void
};

export function Square(props : SquareProps) {
  let squareClasses = ["square", props.color]
  let squareContent
  if (props.selected)
    squareClasses.push("selected")
  if (props.canMoveTo && props.turn) {
    squareContent = <div className={ "piece ghost-piece " + props.turn + "-piece" } />
    squareClasses.push("destination")
  } else if (props.piece)
    squareContent = Piece(props.piece);
  return (
    <div className={ squareClasses.join(" ") } onClick={ props.onClick } >{ squareContent }</div>
  )
}

type BoardState = {
  selected: ?number,
  canMoveTo: boolean[]
};

type BoardProps = GameModel & {
  movePiece: (from: number, to: number) => void
};

export default class Board extends React.Component<BoardProps, BoardState> {
  constructor(props : BoardProps) {
    super(props);
    this.state = {
      selected: null,
      canMoveTo: Array(64).fill(false)
    };
  }

  moveSelectedTo(square : number) : void {
      if (!this.state.selected)
        throw Error("This line should be unreachable!");
      this.props.movePiece(this.state.selected, square);
  }

  handleClick(square : number) : void {
    if (this.state.canMoveTo[square])
      this.moveSelectedTo(square);
    else if (this.props.board[square])
      this.toggleSelected(square);
  }

  canMove(square: number) : boolean {
    const piece = this.props.board[square];
    return this.state.selected !== square && !!piece && piece.color === this.props.turn &&
      movesFrom(this.props, square).length > 0;
  }

  toggleSelected(square : number) : void {
    if (this.canMove(square))
      this.setState({
          selected: square,
          canMoveTo: this.legalMoveGrid(this.props, square)
        });
    else
      this.setState({ selected: null, canMoveTo: Array(64).fill(false) });
  }

  legalMoveGrid(game: GameModel, origin : number) {
    const moves = movesFrom(game, origin);
    const result : boolean[] = Array(64).fill(false);
    for (let i = 0; i < moves.length; i += 2)
      result[moves[i]] = true;
    return result;
  }

  render() {
    const boardColors : Array<"white" | "black"> =
      [ "white", "black", "white", "black", "white", "black", "white", "black",
        "black", "white", "black", "white", "black", "white", "black", "white",
        "white", "black", "white", "black", "white", "black", "white", "black",
        "black", "white", "black", "white", "black", "white", "black", "white",
        "white", "black", "white", "black", "white", "black", "white", "black",
        "black", "white", "black", "white", "black", "white", "black", "white",
        "white", "black", "white", "black", "white", "black", "white", "black",
        "black", "white", "black", "white", "black", "white", "black", "white" ]
    const squares = []
    for (let i = 0; i < 64; i++)
      squares[i] =
        <Square key={ i } color={ boardColors[i] } piece={ this.props.board[i] }
          onClick={ () => this.handleClick(i) } selected={ this.state.selected === i } canMoveTo={ this.state.canMoveTo[i] } turn={ this.props.turn } />
    return (
      <div id="board">
        { squares }
      </div>
    )
  }
}

type GameState = {
  game: GameModel,
  stepNumber: number,
  moveHistory: GameModel[]
}

export class Game extends React.Component<GameModel, GameState> {
  constructor(props : GameModel) {
    super(props)
    this.state = {
      game: {
        board: props.board.slice(),
        turn: props.turn
      },
      stepNumber: 0,
      moveHistory: []
    };
  }

  render() {
    return <div>
      <Board key={ this.state.stepNumber } board={ this.state.game.board } turn={ this.state.game.turn } movePiece={(from: number, to: number) => {
        this.setState((prevState) => {
          return {
              game: movePiece(prevState.game, from, to),
              moveHistory: prevState.moveHistory.concat(prevState.game),
              stepNumber: prevState.stepNumber + 1
            };
        });
      }} />
      <div className="game-controls">
        <button onClick={() => {
            this.setState((prevState) => {
              const moveHistory = prevState.moveHistory;
              const lastIndex = moveHistory.length - 1;
              return {
                  game: moveHistory[lastIndex],
                  moveHistory: moveHistory.slice(0, lastIndex),
                  stepNumber: prevState.stepNumber + 1
                };
            });
          }} disabled={this.state.moveHistory.length === 0}>Undo move!</button>
      </div>
    </div>;
  }
}