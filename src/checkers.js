import React from 'react';
import ReactDOM from 'react-dom';

import { Game } from './ui'
import { parse } from "../src/checkersFEN";

const board = parse(
  ".m.m.m.m" +
  "m.m.m.m." +
  ".m.m.m.m" +
  "........" +
  "........" +
  "M.M.M.M." +
  ".M.M.M.M" +
  "M.M.M.M." +
  " w").board;

ReactDOM.render(
    <Game board={ board } turn="black" />,
    document.getElementById('game')
  );