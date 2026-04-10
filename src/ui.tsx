import React, { useState, useEffect } from 'react';
import { movesFrom, movePiece } from './moveGenerator';
import type { PieceModel, GameModel } from './moveGenerator';
import * as socketService from './socketService';
import { parse } from './checkersFEN';

function Piece(props: PieceModel) {
  return <div className={"piece " + props.color + "-piece " + props.kind}>
    <div className="piece-center" />
  </div>;
}

type SquareProps = {
  color: "white" | "black",
  selected: boolean,
  canMoveTo: boolean,
  piece?: PieceModel | null,
  turn: "white" | "black",
  onClick: () => void
};

export function Square(props: SquareProps) {
  let squareClasses = ["square", props.color]
  let squareContent
  if (props.selected)
    squareClasses.push("selected")
  if (props.canMoveTo && props.turn) {
    squareContent = <div className={ "piece ghost-piece " + props.turn + "-piece" }  />
    squareClasses.push("destination")
  } else if (props.piece)
    squareContent = Piece(props.piece);
  return (
    <div role="button" className={ squareClasses.join(" ") } onClick={ props.onClick } >{ squareContent }</div>
  )
}

type BoardProps = GameModel & {
  viewpoint: "black" | "white",
  movePiece: (from: number, to: number) => void,
  interactive?: boolean
};

export default function Board(props: BoardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [canMoveTo, setCanMoveTo] = useState<boolean[]>(Array(64).fill(false));

  function moveSelectedTo(square: number): void {
    if (selected == null)
      throw Error("This line should be unreachable!");
    props.movePiece(selected, square);
  }

  function handleClick(square: number): void {
    if (props.interactive === false) return;
    if (canMoveTo[square]) {
      moveSelectedTo(square);
    } else if (props.board[square]) {
      toggleSelected(square);
    }
  }

  function canMove(square: number): boolean {
    const piece = props.board[square];
    return selected !== square && !!piece && piece.color === props.turn &&
      movesFrom(props, square).length > 0;
  }

  function toggleSelected(square: number): void {
    if (canMove(square)) {
      setSelected(square);
      setCanMoveTo(legalMoveGrid(props, square));
    } else {
      setSelected(null);
      setCanMoveTo(Array(64).fill(false));
    }
  }

  function legalMoveGrid(game: GameModel, origin: number): boolean[] {
    const moves = movesFrom(game, origin);
    const result: boolean[] = Array(64).fill(false);
    for (let i = 0; i < moves.length; i += 2)
      result[moves[i]] = true;
    return result;
  }

  const boardColors: Array<"white" | "black"> =
    [ "white", "black", "white", "black", "white", "black", "white", "black",
      "black", "white", "black", "white", "black", "white", "black", "white",
      "white", "black", "white", "black", "white", "black", "white", "black",
      "black", "white", "black", "white", "black", "white", "black", "white",
      "white", "black", "white", "black", "white", "black", "white", "black",
      "black", "white", "black", "white", "black", "white", "black", "white",
      "white", "black", "white", "black", "white", "black", "white", "black",
      "black", "white", "black", "white", "black", "white", "black", "white" ];
  const squares: React.ReactElement[] = [];
  for (let i = 0; i < 64; i++)
    squares[i] =
      <Square key={ i } color={ boardColors[i] } piece={ props.board[i] }
        onClick={ () => handleClick(i) } selected={ selected === i } canMoveTo={ canMoveTo[i] } turn={ props.turn } />
  if (props.viewpoint == "black")
    squares.reverse();
  return (
    <div id="board">
      { squares }
    </div>
  );
}

type GameProps = GameModel & {
  viewpoint: "black" | "white";
  mode?: "local" | "online";
};

export function Game(props: GameProps) {
  const isOnline = props.mode === "online";

  const [game, setGame] = useState<GameModel>({
    board: props.board.slice(),
    turn: props.turn
  });
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [moveHistory, setMoveHistory] = useState<GameModel[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOnline) return;

    const handleOpponentMoved = ({ gameState }: { gameState: string }) => {
      const newGame = parse(gameState);
      setGame(newGame);
      setStepNumber(n => n + 1);
      setStatusMessage(null);
    };

    const handleMoveAccepted = ({ gameState }: { gameState: string }) => {
      const newGame = parse(gameState);
      setGame(newGame);
      setStepNumber(n => n + 1);
    };

    const handleGameOver = ({ winner, reason }: { winner: "black" | "white"; reason: string }) => {
      setStatusMessage(`Game over: ${winner} wins (${reason})`);
    };

    socketService.onOpponentMoved(handleOpponentMoved);
    socketService.onMoveAccepted(handleMoveAccepted);
    socketService.onGameOver(handleGameOver);

    return () => {
      socketService.offOpponentMoved(handleOpponentMoved);
      socketService.offMoveAccepted(handleMoveAccepted);
      socketService.offGameOver(handleGameOver);
    };
  }, [isOnline]);

  function handleMovePiece(from: number, to: number) {
    if (isOnline) {
      socketService.sendMove(from, to);
    } else {
      setGame(prevGame => {
        const newGame = movePiece(prevGame, from, to);
        setMoveHistory(moveHistory.concat(prevGame));
        setStepNumber(stepNumber + 1);
        return newGame;
      });
    }
  }

  function handleUndo() {
    const lastIndex = moveHistory.length - 1;
      
    setMoveHistory(moveHistory.slice(0, lastIndex));
    setGame(moveHistory[lastIndex]);
    setStepNumber(stepNumber + 1);
  }

  function handleResign() {
    socketService.resign();
  }

  // In online mode, only allow interaction on your turn
  const isMyTurn = !isOnline || game.turn === props.viewpoint;

  return <div>
    <Board key={ stepNumber } board={ game.board } viewpoint={ props.viewpoint } turn={ game.turn } movePiece={ handleMovePiece } interactive={ isMyTurn } />
    {statusMessage && <p className="status-message">{statusMessage}</p>}
    <div className="game-controls">
      {!isOnline && <button onClick={ handleUndo } disabled={ moveHistory.length === 0 }>Undo move!</button>}
      {isOnline && <button onClick={ handleResign }>Resign</button>}
    </div>
  </div>;
}
