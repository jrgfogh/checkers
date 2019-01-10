import React from "react";
import * as TestRenderer from "react-test-renderer";
import ShallowRenderer from 'react-test-renderer/shallow';
import each from 'jest-each';

import Board, { Square } from "../src/ui";
import MoveGenerator from '../src/moveGenerator';

const emptyBoard = Array(64).fill(null);
const rowLength = 8

describe("Board", () => {
  describe("Square", () => {
    it("renders empty black correctly", () => {
      const square = TestRenderer.create(<Square color="black" />);
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square black"
/>
`);
    });

    it("renders empty white correctly", () => {
      const square = TestRenderer.create(<Square color="white" />);
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
/>
`);
    });

    it("renders white man on white correctly", () => {
      const square = TestRenderer.create(
        <Square color="white" piece={{ color: "white", kind: "man" }} />
      );
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
>
  <div
    className="piece white-piece man"
  />
</div>
`);
    });

    it("renders white king on white correctly", () => {
      const square = TestRenderer.create(
        <Square color="white" piece={{ color: "white", kind: "king" }} />
      );
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
>
  <div
    className="piece white-piece king"
  />
</div>
`);
    });

    it("renders black man on white correctly", () => {
      const square = TestRenderer.create(
        <Square color="white" piece={{ color: "black", kind: "man" }} />
      );
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
>
  <div
    className="piece black-piece man"
  />
</div>
`);
    });

    it("should require a color", () => {
      expect(() => TestRenderer.create(<Square />)).toThrowError(
        "Warning: Failed prop type: The prop `color` is marked as required in `Square`, but its value is `undefined`."
      );
    });

    it("should require a valid color", () => {
      expect(() =>
        TestRenderer.create(<Square color="invalid" />)
      ).toThrowError(
        'Warning: Failed prop type: Invalid prop `color` of value `invalid` supplied to `Square`, expected one of ["white","black"].'
      );
    });

    it("renders empty black selected correctly", () => {
      const square = TestRenderer.create(<Square color="black" selected={ true } />);
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square black selected"
/>
`);
    });

    it("renders empty black destination correctly", () => {
      const square = TestRenderer.create(<Square color="black" canMoveTo={ true } />);
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square black destination"
/>
`);
    });
  });

  it("should require a turn", () => {
    expect(() => TestRenderer.create(<Board />)).toThrowError(
      "Warning: Failed prop type: The prop `turn` is marked as required in `Board`, but its value is `undefined`."
    );
  });

  it("should reject an invalid turn", () => {
    expect(() => TestRenderer.create(<Board turn="invalid" />)).toThrowError(
      'Warning: Failed prop type: Invalid prop `turn` of value `invalid` supplied to `Board`, expected one of ["white","black"].'
    );
  });

  it("should require a move generator", () => {
    expect(() => TestRenderer.create(<Board pieces={ emptyBoard.slice() } turn="white" />)).toThrowError(
      'Warning: Failed prop type: The prop `moveGenerator` is marked as required in `Board`, but its value is `undefined`.'
    );
  });

  it("renders correctly when empty", () => {
    const pieces = emptyBoard.slice();
    const moveGenerator = new MoveGenerator(pieces);
    const board = TestRenderer.create(<Board pieces={ pieces } turn="white" moveGenerator={ moveGenerator } />);
    expect(board.toJSON()).toMatchSnapshot();
  });

  const allSquareIndices = Array(64).fill().map((_, i) => i);

  each(allSquareIndices).it("renders white man correctly in square %d", (index) => {
    const pieces = emptyBoard.slice()
    const moveGenerator = new MoveGenerator(pieces);
    const whiteMan = { color: "white", kind: "man" };
    pieces[index] = whiteMan;
    const board = new ShallowRenderer().render(<Board pieces={ pieces } turn="white" moveGenerator={ moveGenerator } />);
    expect(board.props.children[index].props).toMatchObject({ piece: whiteMan })
  })

  describe('User input', () => {
    each(allSquareIndices).it("should select white piece on square %d when clicked and white's turn.", (index) => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const whiteMan = { color: "white", kind: "man" };
      pieces[index] = whiteMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="white" moveGenerator={ moveGenerator } />);

      propsForSquare(board, index).onClick()

      expect(propsForSquare(board, index).selected).toBe(true)
    })

    each(allSquareIndices).it("should not select black piece on square %d when clicked and white's turn.", (index) => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const blackMan = { color: "black", kind: "man" };
      pieces[index] = blackMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="white" moveGenerator={ moveGenerator } />);

      propsForSquare(board, index).onClick()

      expect(propsForSquare(board, index).selected).toBe(false)
    })

    each(allSquareIndices).it("should select black piece on square %d when clicked and black's turn.", (index) => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const blackMan = { color: "black", kind: "man" };
      pieces[index] = blackMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="black" moveGenerator={ moveGenerator } />);

      propsForSquare(board, index).onClick()

      expect(propsForSquare(board, index).selected).toBe(true)
    })

    each(allSquareIndices).it('should unselect piece on square %d when clicked', (index) => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const whiteMan = { color: "white", kind: "man" };
      pieces[index] = whiteMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="white" moveGenerator={ moveGenerator } />);

      propsForSquare(board, index).onClick()
      propsForSquare(board, index).onClick()

      expect(propsForSquare(board, index).selected).toBe(false)
    })

    each(allSquareIndices).it('should not select empty square %d when clicked', (index) => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const board = TestRenderer.create(<Board pieces={ pieces } turn="white" moveGenerator={ moveGenerator } />);

      propsForSquare(board, index).onClick()

      expect(propsForSquare(board, index).selected).toBe(false)
    })

    it('should unselect square 2 when square 5 clicked', () => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const whiteMan = { color: "white", kind: "man" };
      pieces[2] = pieces[5] = whiteMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="white" moveGenerator={ moveGenerator } />);

      propsForSquare(board, 2).onClick()
      propsForSquare(board, 5).onClick()

      expect(propsForSquare(board, 2).selected).toBe(false)
    })

    it('should not erase the piece in square 2 when square 5 clicked', () => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const whiteMan = { color: "white", kind: "man" };
      pieces[2] = pieces[5] = whiteMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="white" moveGenerator={ moveGenerator } />);

      propsForSquare(board, 2).onClick()
      propsForSquare(board, 5).onClick()

      expect(propsForSquare(board, 2).piece).not.toBe(null)
    })

    each([11, 15, 29, 32, 40]).it("should highlight exactly correct moves for black piece on square %d when clicked and black's turn.", (index) => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const blackMan = { color: "black", kind: "man" };
      pieces[index] = blackMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="black" moveGenerator={ moveGenerator } />);

      propsForSquare(board, index).onClick()

      const moves = moveGenerator.movesFrom(index)
      for (let i = 0; i < 64; i += 2)
        expect(propsForSquare(board, i).canMoveTo).toBe(canMoveTo(moves, i))
    })

    it("should not highlight any moves for an empty board", () => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const board = TestRenderer.create(<Board pieces={pieces} turn="black" moveGenerator={ moveGenerator } />);

      for (let i = 0; i < 64; i++)
        expect(propsForSquare(board, i).canMoveTo).toBe(false)
    })

    each([10, 11, 12]).it("should execute move when a destination square is clicked", (index) => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const blackMan = { color: "black", kind: "man" };
      pieces[index] = blackMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="black" moveGenerator={ moveGenerator } />);

      propsForSquare(board, index).onClick()
      propsForSquare(board, index + rowLength + 1).onClick()

      expect(propsForSquare(board, index).piece).toBe(null)
      expect(propsForSquare(board, index + rowLength + 1).piece).toEqual({ color: "black", kind: "man" })
    })

    each([10, 11, 12]).it("should clear selection when a destination square is clicked", (index) => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const blackMan = { color: "black", kind: "man" };
      pieces[index] = blackMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="black" moveGenerator={ moveGenerator } />);

      propsForSquare(board, index).onClick()
      propsForSquare(board, index + rowLength + 1).onClick()

      expect(propsForSquare(board, index).selected).toBe(false)
      expect(board.getInstance().state.canMoveTo).toEqual(Array(64).fill(false))
    })

    each([[10, 10 + rowLength + 1, "black", "white"], [13, 13 - rowLength + 1, "white", "black"]]).
      it("should switch turn from when a destination square is clicked", (from, to, startTurn, endTurn) => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const king = { color: startTurn, kind: "king" };
      pieces[from] = king;
      const board = TestRenderer.create(<Board pieces={pieces} turn={ startTurn } moveGenerator={ moveGenerator } />);

      propsForSquare(board, from).onClick()
      propsForSquare(board, to).onClick()

      expect(board.getInstance().state.turn).toEqual(endTurn)
    })

    each([10, 27]).
      it("should clear selection man is clicked twice", (square) => {
      const pieces = emptyBoard.slice()
      const moveGenerator = new MoveGenerator(pieces);
      const blackMan = { color: "black", kind: "man" };
      pieces[square] = blackMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="black" moveGenerator={ moveGenerator } />);

      propsForSquare(board, square).onClick()
      propsForSquare(board, square).onClick()

      expect(board.getInstance().state.canMoveTo).toEqual(Array(64).fill(false))
    })
  })
});

function canMoveTo(moves, i) {
  return (moves.indexOf(i) & 0x1) === 0;
}

function propsForSquare(boardComponent, index) {
  const boardElement = boardComponent.root.findByProps({ id: 'board' });
  const squareElement = boardElement.props.children[index];
  return squareElement.props;
}
