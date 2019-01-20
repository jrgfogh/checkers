// @flow

import each from 'jest-each';

import { parse, unparse } from "../src/checkersFEN";

function fenStringWithOnePieceAtIndex(piece, index) {
  const squares = Array(64).fill('.');
  squares[index] = piece;
  return squares.join('') + " b"
}

const allSquareIndices = Array(64).fill().map((_, i) => i);

describe("Checkers FEN", () => {
  describe("Parser", () => {
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
        expect(parse(fenString)).toMatchObject({
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
        expect(parse(fenString)).toMatchObject({
          pieces: Array(64).fill(null),
          turn: "black"
        })
    })

    each(allSquareIndices).it('should parse white man on square %d', (index) => {
      const fenString = fenStringWithOnePieceAtIndex('M', index)

      const pieces = Array(64).fill(null);
      pieces[index] = {
        color: "white",
        kind: "man"
      }
      expect(parse(fenString)).toMatchObject({
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
      expect(parse(fenString)).toMatchObject({
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
      expect(parse(fenString)).toMatchObject({
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
      expect(parse(fenString)).toMatchObject({
        pieces: pieces
      })
    })


    describe('Input validation', () => {
      it("should reject empty string", () => {
        expect(() => parse("")).toThrowError(
          'Invalid checkers FEN string: ""\n' +
          'The string is too short.');
      })

      it("should reject too long string", () => {
        expect(() => parse(Array(100).join('.'))).toThrowError(
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
        expect(() => parse(fenString)).toThrowError(
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
        expect(() => parse(fenString)).toThrowError(
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
        expect(() => parse(fenString)).toThrowError(
          'Invalid checkers FEN string: "' + fenString + '"');
      })
    })
  })

  describe("Unparser", () => {
    it("should round-trip for empty board, white's turn", () => {
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
      expect(unparse(parse(fenString))).toBe(fenString)
    })

    each(allSquareIndices).it("should round-trip for white man on square %d", (index) => {
      const fenString = fenStringWithOnePieceAtIndex('M', index)
      expect(unparse(parse(fenString))).toBe(fenString)
    })

    each(allSquareIndices).it("should round-trip for white king on square %d", (index) => {
      const fenString = fenStringWithOnePieceAtIndex('K', index)
      expect(unparse(parse(fenString))).toBe(fenString)
    })

    each(allSquareIndices).it("should round-trip for black man on square %d", (index) => {
      const fenString = fenStringWithOnePieceAtIndex('m', index)
      expect(unparse(parse(fenString))).toBe(fenString)
    })

    each(allSquareIndices).it("should round-trip for black king on square %d", (index) => {
      const fenString = fenStringWithOnePieceAtIndex('k', index)
      expect(unparse(parse(fenString))).toBe(fenString)
    })
  })
})