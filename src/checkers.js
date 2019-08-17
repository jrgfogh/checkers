import React from 'react';
import ReactDOM from 'react-dom';

import { Game } from './ui'
import { parse, startPosition } from "../src/checkersFEN";

const board = parse(startPosition).board;

ReactDOM.render(
    <Game board={ board } viewpoint="black" turn="black" />,
    document.getElementById('game')
  );