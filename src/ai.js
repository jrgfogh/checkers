// @flow

import type { GameModel } from './moveGenerator';

export function simpleMaterialWeight(board: GameModel) {
  var result = 0;
  for (var i = 0; i < 64; i++) {
    const piece = board.board[i];
    if (piece != null)
      if (piece.color === "white")
        if (piece.kind === "man")
          result += -1;
        else
          result += -1.4;
      else
        if (piece.kind === "man")
          result += 1;
        else
          result += 1.4;
  }
  
  return result;
}