import React from 'react';
import ReactDOM from 'react-dom';

import Board from './ui'
import checkersFEN from './checkersFEN'

const pieces = checkersFEN(
  ".m.m.m.m" +
  "m.m.m.m." +
  ".m.m.m.m" +
  "........" +
  "........" +
  "M.M.M.M." +
  ".M.M.M.M" +
  "M.M.M.M." +
  " w").pieces;
ReactDOM.render(
    <Board pieces={ pieces } />,
    document.getElementById('game')
  );