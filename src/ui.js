// @flow

import React from 'react';
import { movesFrom, movePiece } from './moveGenerator';
import type { PieceModel } from './moveGenerator';

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
  onClick?: () => void
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
  pieces: Array<?PieceModel>,
  turn: "white" | "black",
  canMoveTo: boolean[]
};

type BoardProps = {
  pieces: Array<?PieceModel>,
  turn: "white" | "black"
};

export default class Board extends React.Component<BoardProps, BoardState> {
  constructor(props : BoardProps) {
    super(props)
    this.state = {
      selected: null,
      pieces: props.pieces.slice(),
      turn: props.turn,
      canMoveTo: Array(64).fill(false)
    };
  }

  handleClick(square : number) : void {
    if (this.state.canMoveTo[square]) {
      this.setState((prevState) => {
        // TODO(jrgfogh): Find a way to specify the invariant statically.
        // TODO(jrgfogh): Where should this invariant be documented?
        // Invariant: canMoveTo is empty <=> !!selected
        if (!prevState.selected)
          throw Error("This line should be unreachable!");
        return {
          selected: null,
          pieces: movePiece(prevState.pieces, prevState.selected, square),
          turn: nextTurn(prevState.turn),
          canMoveTo: Array(64).fill(false)
        };
      });
    }
    else if (this.state.pieces[square])
      this.toggleSelected(square, this.state.pieces[square]);
  }

  toggleSelected(square : number, piece : PieceModel) : void {
    if (this.state.selected !== square && piece.color === this.state.turn)
      this.setState(prevState => { return {
          selected: square,
          canMoveTo: this.legalMoveGrid(prevState.pieces, square)
        }; })
    else
      this.setState({ selected: null, canMoveTo: Array(64).fill(false) })
  }

  legalMoveGrid(pieces: Array<?PieceModel>, origin : number) {
    const moves = movesFrom(pieces, origin);
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
        <Square key={ i } color={ boardColors[i] } piece={ this.state.pieces[i] }
          onClick={ () => this.handleClick(i) } selected={ this.state.selected === i } canMoveTo={ this.state.canMoveTo[i] } turn={ this.state.turn } />
    return (
      <div id="board">
        { squares }
      </div>
    )
  }
}

function nextTurn(turn) {
  if (turn === "white")
    return "black";
  return "white";
}