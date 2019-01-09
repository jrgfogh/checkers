import React from 'react';
import PropTypes from 'prop-types';
import MoveGenerator from './moveGenerator';

export function Square (props) {
  let piece
  let squareClasses = ["square", props.color]
  if (props.selected)
    squareClasses.push("selected")
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
      moveGenerator: props.moveGenerator
    };
  }

  handleClick(i) {
    if (this.state.pieces[i])
      this.toggleSelected(i);
  }

  toggleSelected(i) {
    if (this.state.selected !== i && this.state.pieces[i].color === this.state.turn)
      this.setState({ selected: i })
    else
      this.setState({ selected: null })
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
      squares[i] = <Square key={ i } color={ boardColors[i] } piece={ this.state.pieces[i] } onClick={ () => this.handleClick(i) } selected={ this.state.selected === i } />
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
