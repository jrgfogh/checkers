// @flow

import type { PieceModel, GameModel } from './moveGenerator';

function validateFen(fenString : string) {
  // TODO(jrgfogh): Validate colons.
  // TODO(jorgen.fogh): Validate color input.
  if (fenString === '')
    throw 'Invalid checkers FEN string: ""\n' +
          'The string is too short.';
  if (fenString[0] !== 'B' && fenString[0] !== 'W')
    throw 'Invalid checkers FEN string: "' + fenString + '"\n' +
          'The turn must be either "W" or "B", not "' + fenString[0] + '".';
}

function isOdd(n : number) {
  return n & 0x1;
}

function fenIndexToGameIndex(fenIndex) {
  const fenRow = Math.floor((fenIndex - 1) / 4);
  const index = isOdd(fenRow) ? 65 - 2 * fenIndex : 64 - 2 * fenIndex;
  return index;
}

function gameIndexToFenIndex(gameIndex) {
  return Math.floor((65 - gameIndex) / 2);
}

function parsePiece(board, color, fenPiece) {
  var kind;
  var fenIndex;
  if (fenPiece[0] === 'K') {
    fenIndex = parseInt(fenPiece.substr(1));
    kind = "king";
  }
  else {
    fenIndex = parseInt(fenPiece);
    kind = "man";
  }
  board[fenIndexToGameIndex(fenIndex)] = {
    color: color,
    kind: kind
  };
}

function parsePlayer(board, fenSegment) {
  const color = (fenSegment[0] === "W") ? "white" : "black";
  if (fenSegment.length > 1) {
    const fenPieces = fenSegment.substr(1).split(',');
    for (const fenPiece of fenPieces)
      parsePiece(board, color, fenPiece);
  }
}

export function parse(fenString : string) : GameModel {
  validateFen(fenString);

  const board : Array<?PieceModel> = Array(64).fill(null);
  for (const fenSegment of fenString.split(':'))
    parsePlayer(board, fenSegment);

  const turn = (fenString[0] == 'W') ? "white" : "black";
  return {
    board: board,
    turn: turn
  };
}

export function unparse(gameState : GameModel) : string {
  var whitePieces = [];
  var blackPieces = [];
  for (var i = 63; i >= 0; i--) {
    const piece = gameState.board[i];
    if (piece != null) {
      if (piece.color === "white")
        if (piece.kind === "king")
          whitePieces.push("K" + gameIndexToFenIndex(i));
        else
          whitePieces.push(gameIndexToFenIndex(i));
      else
      if (piece.kind === "king")
        blackPieces.push("K" + gameIndexToFenIndex(i));
      else
        blackPieces.push(gameIndexToFenIndex(i));
    }
  }
  return "W:W" + whitePieces.join(',') + ":B" + blackPieces.join(',');
}

export const startPosition = "B:W1,2,3,4,5,6,7,8,9,10,11,12:B21,22,23,24,25,26,27,28,29,30,31,32";