import React from 'react';
import ReactDOM from 'react-dom';

import Board from './ui'

const pieces = Array(64).fill(null)
ReactDOM.render(
    <Board pieces={ pieces } />,
    document.getElementById('game')
  );