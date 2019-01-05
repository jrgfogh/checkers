
export default function checkersFEN(fenString) {
  if (fenString.length < 66)
    throw Error(
      'Invalid checkers FEN string: "' + fenString + '"\n' +
      'The string is too short.');
  if (fenString.length > 66)
    throw Error(
        'Invalid checkers FEN string: "' + fenString + '"\n' +
        'The string is too long.');
  if (fenString[64] !== " ")
    throw Error(
        'Invalid checkers FEN string: "' + fenString + '"');

  const playerCharacter = fenString[65];

  let turn;
  if (playerCharacter === "b")
    turn = "black";
  else if (playerCharacter === "w")
    turn = "white";
  else
    throw Error(
        'Invalid checkers FEN string: "' + fenString + '"\n' +
        'Invalid player: "' + playerCharacter + '"');

  const pieces = Array(64).fill(null);
  for (let i = 0; i < 64; i++) {
    const pieceCharacter = fenString[i];
    if (pieceCharacter === 'M')
      pieces[i] = {
          color: "white",
          kind: "man"
      };
    else if (pieceCharacter === 'K')
      pieces[i] = {
          color: "white",
          kind: "king"
      };
    else if (pieceCharacter === 'm')
      pieces[i] = {
          color: "black",
          kind: "man"
      };
    else if (pieceCharacter === 'k')
      pieces[i] = {
          color: "black",
          kind: "king"
      };
    else if (pieceCharacter !== '.')
      throw Error(
          'Invalid checkers FEN string: "' + fenString + '"\n' +
          'Invalid piece: "' + pieceCharacter + '"');
  }
  return {
    pieces: pieces,
    turn: turn
  }
}