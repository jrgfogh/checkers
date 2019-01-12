import React from 'react';
import PropTypes from 'prop-types';
import MoveGenerator, { MoveKind } from './moveGenerator';

function Piece(props) {
  return <div className={"piece " + props.color + "-piece " + props.kind}>
    <div className="piece-center" />
  </div>;
}

export function Square(props) {
  let squareClasses = ["square", props.color]
  if (props.selected)
    squareClasses.push("selected")
  if (props.canMoveTo)
    squareClasses.push("destination")
  let piece
  if (props.piece)
    piece = Piece(props.piece);
  return (
    <div className={ squareClasses.join(" ") } onClick={ props.onClick } >{ piece }</div>
  )
}

Square.propTypes = {
  color: PropTypes.oneOf(['white', 'black']).isRequired
};

export default class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: null,
      pieces: props.pieces.slice(),
      turn: props.turn,
      canMoveTo: Array(64).fill(false)
    };
    this.moveGenerator = props.moveGenerator;
  }

  handleClick(square) {
    if (this.state.canMoveTo[square]) {
      this.setState((prevState) => {
        this.moveGenerator.movePiece(prevState.selected, square, MoveKind.Simple);
        return {
          selected: null,
          pieces: this.moveGenerator.board.slice(),
          turn: nextTurn(prevState.turn),
          canMoveTo: Array(64).fill(false)
        };
      });
    }
    else if (this.state.pieces[square])
      this.toggleSelected(square);
  }

  toggleSelected(square) {
    if (this.state.selected !== square && this.state.pieces[square].color === this.state.turn)
      this.setState({ selected: square, canMoveTo: this.legalMoveGrid(square) })
    else
      this.setState({ selected: null, canMoveTo: Array(64).fill(false) })
  }

  legalMoveGrid(origin) {
    const moves = this.moveGenerator.movesFrom(origin);
    const result = Array(64).fill(false);
    for (let i = 0; i < moves.length; i += 2)
      result[moves[i]] = true;
    return result;
  }

  render() {
    const boardColors =
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
          onClick={ () => this.handleClick(i) } selected={ this.state.selected === i } canMoveTo={ this.state.canMoveTo[i] } />
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

Board.propTypes = {
  turn: PropTypes.oneOf(["white", "black"]).isRequired,
  moveGenerator: PropTypes.instanceOf(MoveGenerator).isRequired
};
