import React from 'react';
import PropTypes from 'prop-types';

export function Square (props) {
  let piece
  if (props.piece)
    piece = <div className={ "piece " + props.piece.color + "-piece " + props.piece.kind } />
  return (
    <div className={ "square " + props.color }>{ piece }</div>
  )
}

Square.propTypes = {
  color: PropTypes.oneOf(['white', 'black']).isRequired
};

export default class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pieces: props.pieces
    };
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
      squares[i] = <Square key={ i } color={ boardColors[i] } piece={ this.state.pieces[i] } />
    return (
      <div id="board">
        { squares }
      </div>
    )
  }
}