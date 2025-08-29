/**
 * @jest-environment jsdom
 * @flow
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import each from "jest-each";

import Board, { Square, Game } from "../src/ui";
import MoveGenerator from "../src/moveGenerator";

import type { PieceModel } from "../src/moveGenerator";

const emptyBoard = Array(64).fill(null);
const rowLength = 8;
const allSquareIndices = Array(64).fill().map((_, i) => i);

describe("Checkers UI", () => {
  async function clickSquare(user, i) {
    const squares = screen.queryAllByRole("button");
    await user.click(squares[i]);
  }

  describe("Board", () => {
    describe("Square", () => {
      it("renders empty black correctly", () => {
        render(
          <Square
            color="black"
            canMoveTo={false}
            selected={false}
            turn="black"
            onClick={() => {}}
          />
        );
        const square = screen.getByRole("button");
        expect(square).toHaveClass("square black");
    });

      it("renders empty white correctly", () => {
        render(
          <Square
            color="white"
            canMoveTo={false}
            selected={false}
            turn="black"
            onClick={() => {}}
          />
        );
        const square = screen.getByRole("button");
        expect(square).toHaveClass("square white");
      });

      it("renders white man on white correctly", () => {
        render(
          <Square
            color="white"
            piece={{ color: "white", kind: "man" }}
            canMoveTo={false}
            selected={false}
            turn="black"
            onClick={() => {}}
          />
        );
        const square = screen.getByRole("button");
        expect(square).toHaveClass("square white");
        expect(square.querySelector(".piece.white-piece.man")).toBeInTheDocument();
      });

      it("renders white king on white correctly", () => {
        render(
          <Square
            color="white"
            piece={{ color: "white", kind: "king" }}
            canMoveTo={false}
            selected={false}
            turn="black"
            onClick={() => {}}
          />
        );
        const square = screen.getByRole("button");
        expect(square).toHaveClass("square white");
        expect(square.querySelector(".piece.white-piece.king")).toBeInTheDocument();
      });

      it("renders black man on white correctly", () => {
        render(
          <Square
            color="white"
            piece={{ color: "black", kind: "man" }}
            canMoveTo={false}
            selected={false}
            turn="black"
            onClick={() => {}}
          />
        );
        const square = screen.getByRole("button");
        expect(square).toHaveClass("square white");
        expect(square.querySelector(".piece.black-piece.man")).toBeInTheDocument();
      });
      
      it("should require a color", () => {
        void(() => render(
            // $FlowExpectError
            <Square
              selected={false}
              canMoveTo={false}
              piece={null}
              turn="white"
              onClick={() => {}}
          />));
      });

      it("should require a valid color", () => {
        void(() => render(
          <Square
          // $FlowExpectError
              color="invalid"
              selected={false}
              canMoveTo={false}
              piece={null}
              turn="white"
              onClick={() => {}}
          />));
      });

      it("should require a turn", () => {
        void(() => render(
          // $FlowExpectError
          <Square
              color="black"
              selected={false}
              canMoveTo={false}
              piece={null}
          />));
      });

      it("should require a valid turn", () => {
        void(() => render(
          <Square
              color="white"
              selected={false}
              canMoveTo={false}
              piece={null}
              // $FlowExpectError
              turn="invalid"
              onClick={() => {}}
          />));
      });

      it("renders empty black selected correctly", () => {
        render(
          <Square
            color="black"
            canMoveTo={false}
            selected={true}
            turn="black"
            onClick={() => {}}
          />
        );
        const square = screen.getByRole("button");
        expect(square).toHaveClass("square black selected");
      });

      each(["white", "black"]).it(
        "renders empty black destination correctly, %s's turn",
        turn => {
            render(
            <Square
              color="black"
              canMoveTo={true}
              selected={false}
              turn={turn}
              onClick={() => {}}
            />
          );
          const square = screen.getByRole("button");
          expect(square).toHaveClass("square black destination");
          expect(square.querySelector(".piece.ghost-piece")).toHaveClass(turn + "-piece");
        }
      );
    });

    it("should require a turn", () => {
      // $FlowExpectError
      void(() => render(<Board />));
    });

    it("should reject an invalid turn", () => {
      // $FlowExpectError
      void(() => render(<Board viewpoint="white" turn="invalid" />));
    });

    function checkSquares() {
        const squares = screen.queryAllByRole("button");
        expect(squares).toHaveLength(64);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const i = 8 * row + col;
                if ((row + col) & 0x1) {
                    expect(squares[i]).toHaveClass("square black");
                } else {
                    expect(squares[i]).toHaveClass("square white");
                }
            }
        }
    }

    it("renders correctly when empty", () => {
      const pieces = emptyBoard.slice();
      render(
        <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
      );
      checkSquares();
    });

    each(allSquareIndices).it(
      "renders white man correctly in square %d from white's viewpoint",
      (square: number) => {
        const pieces = emptyBoard.slice();
        const whiteMan = { color: "white", kind: "man" };
        pieces[square] = whiteMan;
        render(<Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />);
        
        const squares = screen.queryAllByRole("button");
        expect(squares[square].querySelector(".piece.white-piece.man")).toBeInTheDocument();
      }
    );

    each(allSquareIndices).it(
      "renders white man correctly in square %d from black's viewpoint",
      (square: number) => {
        const pieces = emptyBoard.slice();
        const whiteMan = { color: "white", kind: "man" };
        pieces[square] = whiteMan;
        render(<Board board={pieces} viewpoint="black" turn="white" movePiece={(from: number, to: number) => {}} />);
        
        const squares = screen.queryAllByRole("button");
        expect(squares[63 - square].querySelector(".piece.white-piece.man")).toBeInTheDocument();
      }
    );

    describe("User input", () => {
      async function isSelectedWhenClicked(i) {
        const user = userEvent.setup();
        await clickSquare(user, i);
        const squares = screen.queryAllByRole("button");
        expect(squares[i]).toHaveClass("selected");
      }

      async function isNotSelectedWhenClicked(user, i) {
        await clickSquare(user, i);
        const squares = screen.queryAllByRole("button");
        expect(squares[i]).not.toHaveClass("selected");
      }

      each([10, 14, 28, 40]).it(
        "should select white piece on square %d when clicked and white's turn.",
        async (square: number) => {
          const pieces = emptyBoard.slice();
          const whiteMan = { color: "white", kind: "man" };
          pieces[square] = whiteMan;
          render(
            <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
          );

          await isSelectedWhenClicked(square);
        }
      );

      each(allSquareIndices).it(
        "should not select black piece on square %d when clicked and white's turn.",
        async (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          render(
            <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
          );
          
          const user = userEvent.setup();
          await isNotSelectedWhenClicked(user, square);
        }
      );

      each([1, 3, 5]).it(
        "should not select black piece on square %d when it has no valid moves.",
        async (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          const whiteMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          pieces[square + rowLength + 1] = whiteMan;
          pieces[square + rowLength - 1] = whiteMan;
          render(
            <Board board={pieces} viewpoint="white" turn="black" movePiece={(from: number, to: number) => {}} />
          );
          
          const user = userEvent.setup();
          await isNotSelectedWhenClicked(user, square);
        }
      );

      each([10, 14, 28, 40]).it(
        "should select black piece on square %d when clicked and black's turn.",
        async (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          render(
            <Board board={pieces} viewpoint="white" turn="black" movePiece={(from: number, to: number) => {}} />
          );

          await isSelectedWhenClicked(square);
        }
      );

      each([10, 14, 28, 40]).it(
        "should unselect piece on square %d when clicked",
        async (square: number) => {
          const pieces = emptyBoard.slice();
          const whiteMan = { color: "white", kind: "man" };
          pieces[square] = whiteMan;
          render(
            <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
          );

          const user = userEvent.setup();
          await clickSquare(user, square);

          await isNotSelectedWhenClicked(user, square);
        }
      );

      each(allSquareIndices).it(
        "should not select empty square %d when clicked",
        async (square: number) => {
          const pieces = emptyBoard.slice();
          render(
            <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
          );
          
          const user = userEvent.setup();
          await isNotSelectedWhenClicked(user, square);
        }
      );

      it("should unselect square 3 when square 5 clicked", async () => {
        const pieces = emptyBoard.slice();
        const whiteMan = { color: "white", kind: "man" };
        pieces[3] = pieces[5] = whiteMan;
        render(
          <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
        );

        const user = userEvent.setup();
        await clickSquare(user, 3);
        await clickSquare(user, 5);
        
        const squares = screen.queryAllByRole("button");
        expect(squares[3]).not.toHaveClass("selected");
      });

      it("should not erase the piece in square 3 when square 5 clicked", async () => {
        const pieces = emptyBoard.slice();
        const whiteMan = { color: "white", kind: "man" };
        pieces[3] = pieces[5] = whiteMan;
        render(
          <Board board={pieces} viewpoint="white" turn="white" movePiece={(from: number, to: number) => {}} />
        );

        const user = userEvent.setup();
        await clickSquare(user, 3);
        await clickSquare(user, 5);
        
        const squares = screen.queryAllByRole("button");
        expect(squares[3].querySelector(".piece")).toBeInTheDocument();
      });

      each([10, 14, 30, 33, 40]).it(
        "should highlight exactly correct moves for black piece on square %d when clicked and black's turn.",
        async (square: number) => {
          const pieces = emptyBoard.slice();
          const moveGenerator = new MoveGenerator({
            board: pieces,
            turn: "black"
          });
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          render(
            <Board board={pieces} viewpoint="white" turn="black" movePiece={(from: number, to: number) => {}} />
          );
          
          const user = userEvent.setup();
          await clickSquare(user, square);

          const moves = moveGenerator.movesFrom(square);
          const squares = screen.queryAllByRole("button");
          for (let i = 0; i < 64; i += 2)
            if (canMoveTo(moves, i))
              expect(squares[i].querySelector(".ghost-piece")).toBeInTheDocument();
            else
              expect(squares[i].querySelector(".ghost-piece")).not.toBeInTheDocument();
        }
      );

      it("should not highlight any moves for an empty board", () => {
        const pieces = emptyBoard.slice();
        render(
          <Board board={pieces} viewpoint="white" turn="black" movePiece={(from: number, to: number) => {}} />
        );
        
        const squares = screen.queryAllByRole("button");
        for (let i = 0; i < 64; i++)
          expect(squares[i].querySelector(".ghost-piece")).not.toBeInTheDocument();
      });

      each([10, 28]).it(
        "should clear selection man is clicked twice",
        async (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          render(
            <Board board={pieces} viewpoint="white" turn="black" movePiece={(from: number, to: number) => {}} />
          );

          const user = userEvent.setup();
          await clickSquare(user, square);
          await clickSquare(user, square);

          expect(document.querySelector(".selected")).not.toBeInTheDocument();
        });
    });
  });

  describe("Game", () => {
    each(["white", "black"]).it("should render empty board correctly", (viewpoint) => {
      const board = emptyBoard.slice();
      const { container } = render(<Game board={board} viewpoint={ viewpoint } turn="white" />); 

      expect(container).toMatchSnapshot();
    });

    it("should render non-empty board correctly", () => {
      const board = emptyBoard.slice();
      board[5] = { color: "white", kind: "man" };
      const { container } = render(<Game board={board} viewpoint="white" turn="black" />);

      expect(container).toMatchSnapshot();
    });

    it("should contain undo-button", () => {
      const board = emptyBoard.slice();
      render(<Game board={board} viewpoint="white" turn="black" />);
      const undoButton = screen.getByRole("button", { name: /undo move/i });

      expect(undoButton).toBeInTheDocument();
      expect(undoButton).toHaveAttribute("disabled");
      expect(undoButton).toHaveTextContent("Undo move!");
    });

    describe("User input", () => {
      each([10, 12, 14]).it(
        "should execute move when a destination square is clicked",
        async (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          render(
            <Game board={pieces} viewpoint="white" turn="black" />
          );
          
          const user = userEvent.setup();
          await clickSquare(user, square);
          await clickSquare(user, square + rowLength + 1);

          const squares = screen.queryAllByRole("button");
          expect(squares[square].querySelector(".piece")).not.toBeInTheDocument();
          expect(squares[square + rowLength + 1].querySelector(".piece")).toHaveClass("piece black-piece man");
        }
      );

      each([51]).it(
        "should crown the piece when the destination square for a crowning move is clicked",
        async (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          render(
            <Game board={pieces} viewpoint="white" turn="black" />
          );
          
          const user = userEvent.setup();
          await clickSquare(user, square);
          await clickSquare(user, square + rowLength + 1);

          const squares = screen.queryAllByRole("button");
          expect(squares[square].querySelector(".piece")).not.toBeInTheDocument();
          expect(squares[square + rowLength + 1].querySelector(".piece")).toHaveClass("piece king black-piece");
        }
      );

      each([
        [10, 10 + rowLength + 1, "black", "white"],
        [12, 12 - rowLength + 1, "white", "black"]
      ]).it("should enable undo button when a destination square is clicked",
        async (from: number, to: number, startTurn, endTurn) => {
          const pieces = emptyBoard.slice();
          const king: PieceModel = { color: startTurn, kind: "king" };
          pieces[from] = king;
          render(
            <Game board={pieces} viewpoint="white" turn={startTurn} />
          );
          const undoButton = screen.getByRole("button", { name: /undo move/i });

          const squares = screen.queryAllByRole("button");
          const user = userEvent.setup();
          await user.click(squares[from]);
          await user.click(squares[to]);
          
          expect(undoButton).not.toBeDisabled();
        }
      );

      each([
        [10, 10 + rowLength + 1, "black"],
        [12, 12 - rowLength + 1, "white"]
      ]).it("should undo move when the undo button is clicked after a single move",
        async (from: number, to: number, startTurn) => {
          const pieces = emptyBoard.slice();
          const king: PieceModel = { color: startTurn, kind: "king" };
          pieces[from] = king;
          render(
            <Game board={pieces} viewpoint="white" turn={startTurn} />
          );
          let undoButton = screen.getByRole("button", { name: /undo move/i });
          
          const squares = screen.queryAllByRole("button");
          const user = userEvent.setup();
          await user.click(squares[from]);
          await user.click(squares[to]);
          await user.click(undoButton);

          undoButton = screen.getByRole("button", { name: /undo move/i });
          expect(undoButton).toBeDisabled();
        }
      );

      each([
        [10, 10 + rowLength + 1, 35, 35 - rowLength + 1]
      ]).it("should undo move when the undo button is clicked after two moves",
        async (from0: number, to0: number, from1: number, to1: number) => {
          const pieces = emptyBoard.slice();
          const blackKing: PieceModel = { color: "black", kind: "king" };
          const whiteKing: PieceModel = { color: "white", kind: "king" };
          pieces[from0] = blackKing;
          pieces[from1] = whiteKing;
          render(
            <Game board={pieces} viewpoint="white" turn={"black"} />
          );
          const undoButton = screen.getByRole("button", { name: /undo move/i });
          const squares = screen.queryAllByRole("button");
          const user = userEvent.setup();
          await user.click(squares[from0]);
          await user.click(squares[to0]);
          await user.click(squares[from1]);
          await user.click(squares[to1]);
          user.click(undoButton);

          expect(undoButton).not.toHaveAttribute("disabled");
        }
      );

      each([10, 12, 14]).it(
        "should clear selection when a destination square is clicked",
        async (square: number) => {
          const pieces = emptyBoard.slice();
          const blackMan = { color: "black", kind: "man" };
          pieces[square] = blackMan;
          render(
            <Game board={pieces} viewpoint="white" turn="black" />
          );
  
          const user = userEvent.setup();
          let squares = screen.queryAllByRole("button");
          user.click(squares[square]);
          user.click(squares[square + rowLength + 1]);

          squares = screen.queryAllByRole("button");
          for (let i = 0; i < 64; i += 2)
            expect(squares[i].querySelector(".ghost-piece")).not.toBeInTheDocument();
        }
      );
    });
  });
});

function canMoveTo(moves, i) {
  return (moves.indexOf(i) & 0x1) === 0;
}
