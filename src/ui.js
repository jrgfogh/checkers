import React from 'react';
import PropTypes from 'prop-types';
import MoveGenerator from './moveGenerator';

export function Square (props) {
  let piece
  let squareClasses = ["square", props.color]
  if (props.selected)
    squareClasses.push("selected")
  if (props.canMoveTo)
    squareClasses.push("destination")
  if (props.piece)
    piece = <div className={ "piece " + props.piece.color + "-piece " + props.piece.kind } />
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
      pieces: props.pieces,
      turn: props.turn,
      moveGenerator: props.moveGenerator,
      canMoveTo: Array(64).fill(false)
    };
  }

  handleClick(i) {
    if (this.state.pieces[i])
      this.toggleSelected(i);
  }

  toggleSelected(square) {
    if (this.state.selected !== square && this.state.pieces[square].color === this.state.turn)
      this.setState({ selected: square, canMoveTo: this.legalMoveGrid(square) })
    else
      this.setState({ selected: null })
  }

  legalMoveGrid(origin) {
    const moves = this.state.moveGenerator.movesFrom(origin);
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

Board.propTypes = {
  turn: PropTypes.oneOf(["white", "black"]).isRequired,
  moveGenerator: PropTypes.instanceOf(MoveGenerator).isRequired
};
