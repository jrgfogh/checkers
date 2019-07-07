// @flow

import React from "react";
import * as TestRenderer from "react-test-renderer";
import ShallowRenderer from "react-test-renderer/shallow";
import each from "jest-each";

import Board, { Square, Game } from "../src/ui";
import MoveGenerator from "../src/moveGenerator";

import type { PieceModel } from "../src/moveGenerator";

const emptyBoard = Array(64).fill(null);
const rowLength = 8;
const allSquareIndices = Array(64).fill().map((_, i) => i);

describe("Checkers UI", () => {
  describe("Board", () => {
    describe("Square", () => {
      it("renders empty black correctly", () => {
        const square = TestRenderer.create(
          <Square
            color="black"
            canMoveTo={false}
            selected={false}
            turn="black"
            onClick={() => {}}
          />
        );
        expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square black"
  onClick={[Function]}
/>
`);
      });

      it("renders empty white correctly", () => {
        const square = TestRenderer.create(
          <Square
            color="white"
            canMoveTo={false}
            selected={false}
            turn="black"
            onClick={() => {}}
          />
        );
        expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
  onClick={[Function]}
/>
`);
      });

      it("renders white man on white correctly", () => {
        const square = TestRenderer.create(
          <Square
            color="white"
            piece={{ color: "white", kind: "man" }}
            canMoveTo={false}
            selected={false}
            turn="black"
            onClick={() => {}}
          />
        );
        expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
  onClick={[Function]}
>
  <div
    className="piece white-piece man"
  >
    <div
      className="piece-center"
    />
  </div>
</div>
`);
      });

      it("renders white king on white correctly", () => {
        const square = TestRenderer.create(
          <Square
            color="white"
            piece={{ color: "white", kind: "king" }}
            canMoveTo={false}
            selected={false}
            turn="black"
            onClick={() => {}}
          />
        );
        expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
  onClick={[Function]}
>
  <div
    className="piece white-piece king"
  >
    <div
      className="piece-center"
    />
  </div>
</div>
`);
      });

      it("renders black man on white correctly", () => {
        const square = TestRenderer.create(
          <Square
            color="white"
            piece={{ color: "black", kind: "man" }}
            canMoveTo={false}
            selected={false}
            turn="black"
            onClick={() => {}}
          />
        );
        expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
  onClick={[Function]}
>
  <div
    className="piece black-piece man"
  >
    <div
      className="piece-center"
    />
  </div>
</div>
`);
      });

      it("should require a color", () => {
        () =>
          TestRenderer.create(
            // $FlowExpectError
            <Square
              selected={false}
              canMoveTo={false}
              piece={null}
              turn="white"
              onClick={() => {}}
            />
          );
      });

      it("should require a valid color", () => {
        () => TestRenderer.create(
            <Square
              // $FlowExpectError
              color="invalid"
              selected={false}
              canMoveTo={false}
              piece={null}
              turn="white"
              onClick={() => {}}
            />
          );
      });

      it("should require a turn", () => {
        () =>
          TestRenderer.create(
            // $FlowExpectError
            <Square
              color="black"
              selected={false}
              canMoveTo={false}
              piece={null}
            />
          );
      });

      it("should require a valid turn", () => {
        () =>
          TestRenderer.create(
            <Square
              color="white"
              selected={false}
              canMoveTo={false}
              piece={null}
        // $FlowExpectError
              turn="invalid"
              onClick={() => {}}
            />
          );
      });

      it("renders empty black selected correctly", () => {
        const square = TestRenderer.create(
          <Square
            color="black"
            canMoveTo={false}
            selected={true}
            turn="black"
            onClick={() => {}}
          />
        );
        expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square black selected"
  onClick={[Function]}
/>
`);
      });

      each(["white", "black"]).it(
        "renders empty black destination correctly, %s's turn",
        turn => {
          const renderer = new ShallowRenderer();
          renderer.render(
            <Square
              color="black"
              canMoveTo={true}
              selected={false}
              turn={turn}
              onClick={() => {}}
            />
          );
          const square = renderer.getRenderOutput();
          expect(square.props.className).toBe("square black destination");
          expect(square.props.children.props.className).toBe(
            "piece ghost-piece " + turn + "-piece"
          );
        }
      );
    });

    it("should require a turn", () => {
      // $FlowExpectError
      () => TestRenderer.create(<Board />);
    });

    it("should reject an invalid turn", () => {
      // $FlowExpectError
      () => TestRenderer.create(<Board viewpoint="white" turn="invalid" />);
    });

    it("renders correctly when empty", () => {
      const pieces = emptyBoard.slice();
      const board = TestRenderer.create(
        <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
      );
      expect(board.toJSON()).toMatchSnapshot();
    });

    each(allSquareIndices).it(
      "renders white man correctly in square %d from white's viewpoint",
      (square: number) => {
        const pieces = emptyBoard.slice();
        const whiteMan = { color: "white", kind: "man" };
        pieces[square] = whiteMan;
        const renderer = new ShallowRenderer();
        renderer.render(<Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />);
        const board = renderer.getRenderOutput();
        expect(board.props.children[square].props).toMatchObject({
          piece: whiteMan
        });
      }
    );

    each(allSquareIndices).it(
      "renders white man correctly in square %d from black's viewpoint",
      (square: number) => {
        const pieces = emptyBoard.slice();
        const whiteMan = { color: "white", kind: "man" };
        pieces[square] = whiteMan;
        const renderer = new ShallowRenderer();
        renderer.render(<Board board={pieces} viewpoint="black" turn="white" movePiece={(from: number, to: number) => {}} />);
        const board = renderer.getRenderOutput();
        expect(board.props.children[63 - square].props).toMatchObject({
          piece: whiteMan
        });
      }
    );

    describe("User input", () => {
      each([10, 14, 28, 40]).it(
        "should select white piece on square %d when clicked and white's turn.",
        (square: number) => {
          const pieces = emptyBoard.slice();
          const whiteMan = { color: "white", kind: "man" };
          pieces[square] = whiteMan;
          const board = TestRenderer.create(
            <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
          );

          propsForSquare(board, square).onClick();

          expect(propsForSquare(board, square).selected).toBe(true);
        }
      );

      each(allSquareIndices).it(
        "should not select black piece on square %d when clicked and white's turn.",
        (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          const board = TestRenderer.create(
            <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
          );

          propsForSquare(board, square).onClick();

          expect(propsForSquare(board, square).selected).toBe(false);
        }
      );

      each([1, 3, 5]).it(
        "should not select black piece on square %d when it has no valid moves.",
        (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          const whiteMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          pieces[square + rowLength + 1] = whiteMan;
          pieces[square + rowLength - 1] = whiteMan;
          const board = TestRenderer.create(
            <Board board={pieces} viewpoint="white" turn="black" movePiece={(from: number, to: number) => {}} />
          );

          propsForSquare(board, square).onClick();

          expect(propsForSquare(board, square).selected).toBe(false);
        }
      );

      each([10, 14, 28, 40]).it(
        "should select black piece on square %d when clicked and black's turn.",
        (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          const board = TestRenderer.create(
            <Board board={pieces} viewpoint="white" turn="black" movePiece={(from: number, to: number) => {}} />
          );

          propsForSquare(board, square).onClick();

          expect(propsForSquare(board, square).selected).toBe(true);
        }
      );

      each([10, 14, 28, 40]).it(
        "should unselect piece on square %d when clicked",
        (square: number) => {
          const pieces = emptyBoard.slice();
          const whiteMan = { color: "white", kind: "man" };
          pieces[square] = whiteMan;
          const board = TestRenderer.create(
            <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
          );

          propsForSquare(board, square).onClick();
          propsForSquare(board, square).onClick();

          expect(propsForSquare(board, square).selected).toBe(false);
        }
      );

      each(allSquareIndices).it(
        "should not select empty square %d when clicked",
        (square: number) => {
          const pieces = emptyBoard.slice();
          const board = TestRenderer.create(
            <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
          );

          propsForSquare(board, square).onClick();

          expect(propsForSquare(board, square).selected).toBe(false);
        }
      );

      it("should unselect square 3 when square 5 clicked", () => {
        const pieces = emptyBoard.slice();
        const whiteMan = { color: "white", kind: "man" };
        pieces[3] = pieces[5] = whiteMan;
        const board = TestRenderer.create(
          <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
        );

        propsForSquare(board, 3).onClick();
        propsForSquare(board, 5).onClick();

        expect(propsForSquare(board, 3).selected).toBe(false);
      });

      it("should not erase the piece in square 3 when square 5 clicked", () => {
        const pieces = emptyBoard.slice();
        const whiteMan = { color: "white", kind: "man" };
        pieces[3] = pieces[5] = whiteMan;
        const board = TestRenderer.create(
          <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
        );

        propsForSquare(board, 3).onClick();
        propsForSquare(board, 5).onClick();

        expect(propsForSquare(board, 3).piece).not.toBe(null);
      });

      each([10, 14, 30, 33, 40]).it(
        "should highlight exactly correct moves for black piece on square %d when clicked and black's turn.",
        (square: number) => {
          const pieces = emptyBoard.slice();
          const moveGenerator = new MoveGenerator({
            board: pieces,
            turn: "black"
          });
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          const board = TestRenderer.create(
            <Board board={pieces} viewpoint="white" turn="black" movePiece={(from: number, to: number) => {}} />
          );

          propsForSquare(board, square).onClick();

          const moves = moveGenerator.movesFrom(square);
          for (let i = 0; i < 64; i += 2)
            expect(propsForSquare(board, i).canMoveTo).toBe(
              canMoveTo(moves, i)
            );
        }
      );

      it("should not highlight any moves for an empty board", () => {
        const pieces = emptyBoard.slice();
        const board = TestRenderer.create(
          <Board board={pieces} viewpoint="white" turn="black" movePiece={(from: number, to: number) => {}} />
        );

        for (let i = 0; i < 64; i++)
          expect(propsForSquare(board, i).canMoveTo).toBe(false);
      });

      each([10, 28]).it(
        "should clear selection man is clicked twice",
        (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          const board = TestRenderer.create(
            <Board board={pieces} viewpoint="white" turn="black" movePiece={(from: number, to: number) => {}} />
          );

          propsForSquare(board, square).onClick();
          propsForSquare(board, square).onClick();

          // $FlowExpectError: We don't want to null-check state and canMoveTo.
          expect(board.getInstance().state.canMoveTo).toEqual(
            Array(64).fill(false)
          );
        });
    });
  });

  describe("Game", () => {
    each(["white", "black"]).it("should render empty board correctly", (viewpoint) => {
      const board = emptyBoard.slice();
      const renderer = new ShallowRenderer();
      renderer.render(<Game board={board} viewpoint={ viewpoint } turn="white" />); 
      const game = renderer.getRenderOutput();

      const boardTag = game.props.children[0];
      expect(boardTag.type).toEqual(Board);
      expect(boardTag.props.board).toEqual(board);
      expect(boardTag.props.turn).toEqual("white");
      expect(boardTag.props.viewpoint).toEqual(viewpoint);
    });

    it("should render non-empty board correctly", () => {
      const board = emptyBoard.slice();
      board[5] = { color: "white", kind: "man" };
      const renderer = new ShallowRenderer();
      renderer.render(<Game board={board} viewpoint="white" turn="black" />);
      const game = renderer.getRenderOutput();

      const boardTag = game.props.children[0];
      expect(boardTag.type).toEqual(Board);
      expect(boardTag.props.board).toEqual(board);
      expect(boardTag.props.turn).toEqual("black");
    });

    it("should contain undo-button", () => {
      const board = emptyBoard.slice();
      const renderer = new ShallowRenderer();
      renderer.render(<Game board={board} viewpoint="white" turn="black" />);
      const game = renderer.getRenderOutput();

      const undoButton = game.props.children[1].props.children;
      expect(undoButton.type).toEqual("button");
      expect(undoButton.props.disabled).toEqual(true);
      expect(undoButton.props.children).toEqual("Undo move!");
    });

    describe("User input", () => {
      each([10, 12, 14]).it(
        "should execute move when a destination square is clicked",
        (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          const game = TestRenderer.create(
            <Game board={pieces} viewpoint="white" turn="black" />
          );

          propsForSquare(game, square).onClick();
          propsForSquare(game, square + rowLength + 1).onClick();

          expect(propsForSquare(game, square).piece).toBe(null);
          expect(propsForSquare(game, square + rowLength + 1).piece).toEqual({
            color: "black",
            kind: "man"
          });
        }
      );

      each([51]).it(
        "should crown the piece when the destination square for a crowning move is clicked",
        (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          const game = TestRenderer.create(
            <Game board={pieces} viewpoint="white" turn="black" />
          );

          propsForSquare(game, square).onClick();
          propsForSquare(game, square + rowLength + 1).onClick();

          expect(propsForSquare(game, square).piece).toBe(null);
          expect(propsForSquare(game, square + rowLength + 1).piece).toEqual({
            color: "black",
            kind: "king"
          });
        }
      );

      each([
        [10, 10 + rowLength + 1, "black", "white"],
        [12, 12 - rowLength + 1, "white", "black"]
      ]).it("should switch turn when a destination square is clicked",
        (from: number, to: number, startTurn, endTurn) => {
          const pieces = emptyBoard.slice();
          const king: PieceModel = { color: startTurn, kind: "king" };
          pieces[from] = king;
          const game = TestRenderer.create(
            <Game board={pieces} viewpoint="white" turn={startTurn} />
          );

          propsForSquare(game, from).onClick();
          propsForSquare(game, to).onClick();

          // $FlowExpectError
          expect(game.getInstance().state.game.turn).toEqual(endTurn);
        }
      );

      each([
        [10, 10 + rowLength + 1, "black", "white"],
        [12, 12 - rowLength + 1, "white", "black"]
      ]).it("should enable undo button when a destination square is clicked",
        (from: number, to: number, startTurn, endTurn) => {
          const pieces = emptyBoard.slice();
          const king: PieceModel = { color: startTurn, kind: "king" };
          pieces[from] = king;
          const game = TestRenderer.create(
            <Game board={pieces} viewpoint="white" turn={startTurn} />
          );
          const undoButton = game.root.findByProps({ children: "Undo move!" });

          propsForSquare(game, from).onClick();
          propsForSquare(game, to).onClick();

          expect(undoButton.props.disabled).toEqual(false);
        }
      );

      each([
        [10, 10 + rowLength + 1, "black"],
        [12, 12 - rowLength + 1, "white"]
      ]).it("should undo move when the undo button is clicked after a single move",
        (from: number, to: number, startTurn) => {
          const pieces = emptyBoard.slice();
          const king: PieceModel = { color: startTurn, kind: "king" };
          pieces[from] = king;
          const game = TestRenderer.create(
            <Game board={pieces} viewpoint="white" turn={startTurn} />
          );
          const undoButton = game.root.findByProps({ children: "Undo move!" });

          propsForSquare(game, from).onClick();
          propsForSquare(game, to).onClick();
          undoButton.props.onClick();

          // $FlowExpectError
          expect(game.getInstance().state.game.turn).toEqual(startTurn);
          expect(undoButton.props.disabled).toEqual(true);
        }
      );

      each([
        [10, 10 + rowLength + 1, 35, 35 - rowLength + 1]
      ]).it("should undo move when the undo button is clicked after two moves",
        (from0: number, to0: number, from1: number, to1: number) => {
          const pieces = emptyBoard.slice();
          const blackKing: PieceModel = { color: "black", kind: "king" };
          const whiteKing: PieceModel = { color: "white", kind: "king" };
          pieces[from0] = blackKing;
          pieces[from1] = whiteKing;
          const game = TestRenderer.create(
            <Game board={pieces} viewpoint="white" turn={"black"} />
          );
          const undoButton = game.root.findByProps({ children: "Undo move!" });
          propsForSquare(game, from0).onClick();
          propsForSquare(game, to0).onClick();
          propsForSquare(game, from1).onClick();
          propsForSquare(game, to1).onClick();
          undoButton.props.onClick();

          // $FlowExpectError
          expect(game.getInstance().state.game.turn).toEqual("white");
          expect(undoButton.props.disabled).toEqual(false);
        }
      );

      each([10, 12, 14]).it(
        "should clear selection when a destination square is clicked",
        (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          const game = TestRenderer.create(
            <Game board={pieces} viewpoint="white" turn="black" />
          );

          propsForSquare(game, square).onClick();
          propsForSquare(game, square + rowLength + 1).onClick();

          // $FlowExpectErrorz
          expect(game.root.findByType(Board).instance.state.canMoveTo).toEqual(
            Array(64).fill(false)
          );
        });
    });
  });
});

function canMoveTo(moves, i) {
  return (moves.indexOf(i) & 0x1) === 0;
}

function propsForSquare(boardComponent, square) {
  const boardElement = boardComponent.root.findByProps({ id: "board" });
  const squareElement = boardElement.props.children[square];
  return squareElement.props;
}
