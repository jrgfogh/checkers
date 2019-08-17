// @flow

import each from 'jest-each';

import { parse } from "../src/checkersFEN";
import type { GameModel } from '../src/moveGenerator';

import { simpleMaterialWeight } from "../src/ai.js"

describe("AI", () => {
  describe("evaluation functions", () => {
    describe("simple material weight", () => {
      it("should assign weight 0 to empty board", () => {
        const board = parse("W:W:B");
        expect(simpleMaterialWeight(board)).toEqual(0);
      })

      each([1, 3, 7, 11]).it("should assign weight -1 to one white man on FEN square %d", (fenIndex) => {
        const board = parse("W:W" + fenIndex + ":B");
        expect(simpleMaterialWeight(board)).toEqual(-1);
      })

      each([1, 3, 7, 11]).it("should assign weight -1.4 to one white king on FEN square %d", (fenIndex) => {
        const board = parse("W:WK" + fenIndex + ":B");
        expect(simpleMaterialWeight(board)).toEqual(-1.4);
      })

      each([1, 3, 7, 11]).it("should assign weight 1 to one black man on FEN square %d", (fenIndex) => {
        const board = parse("W:W:B" + fenIndex);
        expect(simpleMaterialWeight(board)).toEqual(1);
      })

      each([1, 3, 7, 11]).it("should assign weight 1.4 to one white king on FEN square %d", (fenIndex) => {
        const board = parse("W:W:BK" + fenIndex);
        expect(simpleMaterialWeight(board)).toEqual(1.4);
      })

      it("should assign weight -2 to two white men", () => {
        const board = parse("W:W1,5:B");
        expect(simpleMaterialWeight(board)).toEqual(-2);
      })

      it("should assign weight -2.8 to two white kings", () => {
        const board = parse("W:WK1,K5:B");
        expect(simpleMaterialWeight(board)).toEqual(-2.8);
      })

      it("should assign weight 2 to two black men", () => {
        const board = parse("W:W:B15,17");
        expect(simpleMaterialWeight(board)).toEqual(2);
      })

      it("should assign weight 2.8 to two black kings", () => {
        const board = parse("W:W:BK15,K17");
        expect(simpleMaterialWeight(board)).toEqual(2.8);
      })
    })
  })
})