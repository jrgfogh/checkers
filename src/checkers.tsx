import { createRoot } from 'react-dom/client';

import { Game } from './ui';
import { parse, startPosition } from "./checkersFEN";

const board = parse(startPosition).board;

createRoot(document.getElementById('game')!).render(
    <Game board={ board } viewpoint="black" turn="black" />
  );
