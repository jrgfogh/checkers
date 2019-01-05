import React from 'react';
import PropTypes from 'prop-types';

export function Cell (props) {
  let piece
  if (props.piece)
    piece = <div class={ "piece " + props.piece.color + "-piece " + props.piece.kind } />
  return (
    <div class={ "cell " + props.color }>{ piece }</div>
  )
}

Cell.propTypes = {
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
        <Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" />
        <Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" />
        <Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" />
        <Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" />
        <Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" />
        <Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" />
        <Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" />
        <Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" /><Cell color="black" /><Cell color="white" />
      </div>
    )
  }
}