import React from 'react';
import ReactDOM from 'react-dom';

import Board from './ui'
import { parse } from "../src/checkersFEN";

const pieces = parse(
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
    <Board pieces={ pieces } turn="black" />,
    document.getElementById('game')
  );