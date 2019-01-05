import each from 'jest-each';

import checkersFEN from "../src/checkersFEN";

function fenStringWithOnePieceAtIndex(piece, index) {
  const squares = Array(64).fill('.');
  squares[index] = piece;
  return squares.join('') + " b"
}

describe("Checkers FEN parser", () => {
  it("should parse empty board, white's move", () => {
    const fenString =
      "........" +
      "........" +
      "........" +
      "........" +
      "........" +
      "........" +
      "........" +
      "........" +
      " w";
      expect(checkersFEN(fenString)).toMatchObject({
        pieces: Array(64).fill(null),
        turn: "white"
      })
  })

  it("should parse empty board, black's move", () => {
    const fenString =
      "........" +
      "........" +
      "........" +
      "........" +
      "........" +
      "........" +
      "........" +
      "........" +
      " b";
      expect(checkersFEN(fenString)).toMatchObject({
        pieces: Array(64).fill(null),
        turn: "black"
      })
  })

  const allSquareIndices = Array(64).fill().map((_, i) => i);

  each(allSquareIndices).it('should parse white man on square %d', (index) => {
    const fenString = fenStringWithOnePieceAtIndex('M', index)

    const pieces = Array(64).fill(null);
    pieces[index] = {
      color: "white",
      kind: "man"
    }
    expect(checkersFEN(fenString)).toMatchObject({
      pieces: pieces
    })
  })

  each(allSquareIndices).it('should parse white king on square %d', (index) => {
    const fenString = fenStringWithOnePieceAtIndex('K', index)

    const pieces = Array(64).fill(null);
    pieces[index] = {
      color: "white",
      kind: "king"
    }
    expect(checkersFEN(fenString)).toMatchObject({
      pieces: pieces
    })
  })

  each(allSquareIndices).it('should parse black man on square %d', (index) => {
    const fenString = fenStringWithOnePieceAtIndex('m', index)

    const pieces = Array(64).fill(null);
    pieces[index] = {
      color: "black",
      kind: "man"
    }
    expect(checkersFEN(fenString)).toMatchObject({
      pieces: pieces
    })
  })

  each(allSquareIndices).it('should parse black king on square %d', (index) => {
    const fenString = fenStringWithOnePieceAtIndex('k', index)

    const pieces = Array(64).fill(null);
    pieces[index] = {
      color: "black",
      kind: "king"
    }
    expect(checkersFEN(fenString)).toMatchObject({
      pieces: pieces
    })
  })


  describe('Input validation', () => {
    it("should reject empty string", () => {
      expect(() => checkersFEN("")).toThrowError(
        'Invalid checkers FEN string: ""\n' +
        'The string is too short.');
    })

    it("should reject too long string", () => {
      expect(() => checkersFEN(Array(100).join('.'))).toThrowError(
        'Invalid checkers FEN string: "..................................................................................................."\n' +
        'The string is too long.');
    })

    it("should reject invalid piece", () => {
      const fenString =
        "........" +
        "........" +
        "..X....." +
        "........" +
        "........" +
        "........" +
        "........" +
        "........" +
        " b";
      expect(() => checkersFEN(fenString)).toThrowError(
        'Invalid checkers FEN string: "' + fenString + '"\n' +
        'Invalid piece: "X"');
    })

    it("should reject invalid player", () => {
      const fenString =
        "........" +
        "........" +
        "........" +
        "........" +
        "........" +
        "........" +
        "........" +
        "........" +
        " X";
      expect(() => checkersFEN(fenString)).toThrowError(
        'Invalid checkers FEN string: "' + fenString + '"\n' +
        'Invalid player: "X"');
    })

    it("should require space before turn specification", () => {
      const fenString =
        "........" +
        "........" +
        "........" +
        "........" +
        "........" +
        "........" +
        "........" +
        "........" +
        ".b";
      expect(() => checkersFEN(fenString)).toThrowError(
        'Invalid checkers FEN string: "' + fenString + '"');
    })
  })
})