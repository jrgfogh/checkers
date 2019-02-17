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
    this.setState((prevState) => {
      // TODO(jrgfogh): Find a way to specify the invariant statically.
      // TODO(jrgfogh): Where should this invariant be documented?
      // Invariant: canMoveTo is empty <=> !selected
      if (!prevState.selected)
        throw Error("This line should be unreachable!");
      this.props.movePiece(prevState.selected, square);
      return {
        selected: null,
        canMoveTo: Array(64).fill(false)
      };
    });
  }

  handleClick(square : number) : void {
    if (this.state.canMoveTo[square])
      this.moveSelectedTo(square);
    else if (this.props.board[square])
      this.toggleSelected(square, this.props.board[square]);
  }

  toggleSelected(square : number, piece : PieceModel) : void {
    if (this.state.selected !== square && piece.color === this.props.turn)
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

export class Game extends React.Component<GameModel, GameModel> {
  constructor(props : GameModel) {
    super(props)
    this.state = {
      board: props.board.slice(),
      turn: props.turn
    };
  }

  render() {
    return <Board board={ this.state.board } turn={ this.state.turn } movePiece={(from: number, to: number) => {
      this.setState((prevState) => {
        return movePiece(prevState, from, to);
      });
    }} />;
  }
}