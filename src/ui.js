import React from 'react';
import PropTypes from 'prop-types';

export function Square (props) {
  let piece
  if (props.piece)
    piece = <div class={ "piece " + props.piece.color + "-piece " + props.piece.kind } />
  return (
    <div class={ "square " + props.color }>{ piece }</div>
  )
}

Square.propTypes = {
  color: PropTypes.oneOf(['white', 'black']).isRequired
};

export default class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      squares: props.squares
    };
  }

  render() {
    return (
      <div id="board">
        <Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" />
        <Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" />
        <Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" />
        <Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" />
        <Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" />
        <Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" />
        <Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" />
        <Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" /><Square color="black" /><Square color="white" />
      </div>
    )
  }
}