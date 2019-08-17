// @flow

import each from 'jest-each';

import { parse, unparse } from "../src/checkersFEN";

const allFenIndices = Array(32).fill().map((_, i) => i + 1);

describe("Checkers FEN", () => {
  describe("Parser", () => {
    it("should parse empty board, white's move", () => {
        const fenString = "W:W:B";
        expect(parse(fenString)).toMatchObject({
          board: Array(64).fill(null),
          turn: "white"
        })
    })

    it("should parse empty board, black's move", () => {
      const fenString = "B:W:B";
        expect(parse(fenString)).toMatchObject({
          board: Array(64).fill(null),
          turn: "black"
        })
    })

    each([
      [62, 1], [60, 2], [58, 3], [56, 4],
      [55, 5], [53, 6],
      [46, 9], [44, 10],
      [39, 13],
      [30, 17]
    ]).it('should parse white man on square %d', (index, fenIndex) => {
      const fenString = 'W:W' + fenIndex + ':B';

      const board = Array(64).fill(null);
      board[index] = {
        color: "white",
        kind: "man"
      };
      expect(parse(fenString)).toMatchObject({
        board: board
      })
    })

    each([
      [62, 1], [60, 2],
      [55, 5], [53, 6],
      [46, 9], [44, 10],
      [39, 13],
      [30, 17]
    ]).it('should parse white king on square %d', (index, fenIndex) => {
      const fenString = 'W:WK' + fenIndex + ':B';

      const board = Array(64).fill(null);
      board[index] = {
        color: "white",
        kind: "king"
      }
      expect(parse(fenString)).toMatchObject({
        board: board
      })
    })

    each([
      [62, 1], [60, 2], [58, 3], [56, 4],
      [55, 5], [53, 6],
      [46, 9], [44, 10],
      [39, 13],
      [30, 17]
    ]).it('should parse black man on square %d', (index, fenIndex) => {
      const fenString = 'W:B' + fenIndex + ':W';

      const board = Array(64).fill(null);
      board[index] = {
        color: "black",
        kind: "man"
      };
      expect(parse(fenString)).toMatchObject({
        board: board
      })
    })

    it('should parse two white men', () => {
      const fenString = 'W:W1,2:B';

      const board = Array(64).fill(null);
      board[62] = board[60] = {
        color: "white",
        kind: "man"
      }
      expect(parse(fenString)).toMatchObject({
        board: board
      })
    })

    it('should parse two men of each color', () => {
      const fenString = 'W:W1,2:B3,4';

      const board = Array(64).fill(null);
      board[62] = board[60] = {
        color: "white",
        kind: "man"
      }
      board[58] = board[56] = {
        color: "black",
        kind: "man"
      }
      expect(parse(fenString)).toMatchObject({
        board: board
      })
    })


    describe('Input validation', () => {
      it("should reject empty string", () => {
        expect(() => parse("")).toThrowError(
          'Invalid checkers FEN string: ""\n' +
          'The string is too short.');
      })

      each(["5:W:B", "Q:B:W"]).it("should reject an invalid turn", (fenString) => {
        expect(() => parse(fenString)).toThrowError(
          'Invalid checkers FEN string: "' +  fenString + '"\n' +
          'The turn must be either "W" or "B", not "' + fenString[0] + '".');
      })
    })
  })

  describe("Unparser", () => {
    it("should round-trip for empty board, white's turn", () => {
      const fenString = "W:W:B";
      expect(unparse(parse(fenString))).toBe(fenString)
    })

    each(allFenIndices).it("should round-trip for white man on FEN square %d", (index) => {
      const fenString = "W:W" + index + ":B";
      expect(unparse(parse(fenString))).toBe(fenString)
    })

    each(allFenIndices).it("should round-trip for white king on square %d", (index) => {
      const fenString = "W:WK" + index + ":B";
      expect(unparse(parse(fenString))).toBe(fenString)
    })

    it("should round-trip for two white men", () => {
      const fenString = "W:W1,5:B";
      expect(unparse(parse(fenString))).toBe(fenString)
    })

    each(allFenIndices).it("should round-trip for black man on FEN square %d", (index) => {
      const fenString = "W:W:B" + index;
      expect(unparse(parse(fenString))).toBe(fenString)
    })

    each(allFenIndices).it("should round-trip for black king on square %d", (index) => {
      const fenString = "W:W:BK" + index;
      expect(unparse(parse(fenString))).toBe(fenString)
    })

    it("should round-trip for two black men", () => {
      const fenString = "W:W:B9,15";
      expect(unparse(parse(fenString))).toBe(fenString)
    })
  })
})