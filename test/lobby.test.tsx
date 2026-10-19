/**
 * @jest-environment jsdom
 */

import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { Lobby } from "../src/lobby";
import type { LobbyRoom } from "../server/protocol";

// Mock the entire socketService module
jest.mock("../src/socketService", () => {
  const callbacks: Record<string, ((...args: any[]) => void)[]> = {};

  function on(event: string, cb: (...args: any[]) => void) {
    if (!callbacks[event]) callbacks[event] = [];
    callbacks[event].push(cb);
  }

  function off(event: string, cb: (...args: any[]) => void) {
    if (callbacks[event]) {
      callbacks[event] = callbacks[event].filter((c) => c !== cb);
    }
  }

  function emit(event: string, ...args: any[]) {
    (callbacks[event] ?? []).forEach((cb) => cb(...args));
  }

  return {
    __emit: emit,
    connect: jest.fn(),
    disconnect: jest.fn(),
    createGame: jest.fn(),
    joinGame: jest.fn(),
    onGameCreated: jest.fn((cb) => on("game-created", cb)),
    onGameStart: jest.fn((cb) => on("game-start", cb)),
    onError: jest.fn((cb) => on("error", cb)),
    onLobbyUpdate: jest.fn((cb) => on("lobby-update", cb)),
    offLobbyUpdate: jest.fn((cb) => off("lobby-update", cb)),
    onOpponentMoved: jest.fn(),
    offOpponentMoved: jest.fn(),
    onMoveAccepted: jest.fn(),
    offMoveAccepted: jest.fn(),
    onGameOver: jest.fn(),
    offGameOver: jest.fn(),
  };
});

// Helper to fire a lobby-update from the mock
import * as socketService from "../src/socketService";
const mockSocket = socketService as any;

function sendLobbyUpdate(rooms: LobbyRoom[]) {
  act(() => {
    mockSocket.__emit("lobby-update", { rooms });
  });
}

describe("Lobby", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState(null, "", "/");
  });

  it("renders buttons and headings", () => {
    render(<Lobby />);
    expect(screen.getByRole("button", { name: /new game/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /join game/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /play offline/i })).toBeInTheDocument();
    expect(screen.getByText(/games in progress/i)).toBeInTheDocument();
  });

  it("shows empty state when no rooms available", () => {
    render(<Lobby />);
    sendLobbyUpdate([]);
    expect(screen.getByText(/no games available/i)).toBeInTheDocument();
  });

  it("renders waiting rooms in the list", () => {
    render(<Lobby />);
    sendLobbyUpdate([{ id: "ABCDEF", status: "waiting" }]);
    expect(screen.getByText("ABCDEF")).toBeInTheDocument();
    expect(screen.getByText(/waiting for player/i)).toBeInTheDocument();
  });

  it("renders playing rooms in the list", () => {
    render(<Lobby />);
    sendLobbyUpdate([{ id: "XYZXYZ", status: "playing" }]);
    expect(screen.getByText("XYZXYZ")).toBeInTheDocument();
    expect(screen.getAllByText(/in progress/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders finished rooms in a separate section", () => {
    render(<Lobby />);
    sendLobbyUpdate([{ id: "DONE01", status: "finished" }]);
    expect(screen.getByText(/finished games/i)).toBeInTheDocument();
    expect(screen.getByText("DONE01")).toBeInTheDocument();
  });

  it("does not show finished games section when there are none", () => {
    render(<Lobby />);
    sendLobbyUpdate([{ id: "ABCDEF", status: "waiting" }]);
    expect(screen.queryByText(/finished games/i)).not.toBeInTheDocument();
  });

  it("Join Game button is disabled when nothing is selected", () => {
    render(<Lobby />);
    sendLobbyUpdate([{ id: "ABCDEF", status: "waiting" }]);
    expect(screen.getByRole("button", { name: /join game/i })).toBeDisabled();
  });

  it("Join Game button is disabled when a playing room is selected", async () => {
    const user = userEvent.setup();
    render(<Lobby />);
    sendLobbyUpdate([{ id: "ABCDEF", status: "playing" }]);
    await user.click(screen.getByText("ABCDEF"));
    expect(screen.getByRole("button", { name: /join game/i })).toBeDisabled();
  });

  it("Join Game button is enabled when a waiting room is selected", async () => {
    const user = userEvent.setup();
    render(<Lobby />);
    sendLobbyUpdate([{ id: "ABCDEF", status: "waiting" }]);
    await user.click(screen.getByText("ABCDEF"));
    expect(screen.getByRole("button", { name: /join game/i })).toBeEnabled();
  });

  it("clicking Join Game calls joinGame with the selected room ID", async () => {
    const user = userEvent.setup();
    render(<Lobby />);
    sendLobbyUpdate([{ id: "ABCDEF", status: "waiting" }]);
    await user.click(screen.getByText("ABCDEF"));
    await user.click(screen.getByRole("button", { name: /join game/i }));
    expect(mockSocket.joinGame).toHaveBeenCalledWith("ABCDEF");
  });

  it("clicking New Game calls createGame", async () => {
    const user = userEvent.setup();
    render(<Lobby />);
    await user.click(screen.getByRole("button", { name: /new game/i }));
    expect(mockSocket.createGame).toHaveBeenCalled();
  });

  it("shows a copyable game link when a game is created", () => {
    render(<Lobby />);
    act(() => {
      mockSocket.__emit("game-created", { roomId: "ABCDEF" });
    });

    const link = screen.getByRole("textbox", { name: /game link/i });
    expect(link).toHaveValue(`${window.location.origin}/?room=ABCDEF`);
    expect(link).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: /copy link/i })).toBeInTheDocument();
    expect(window.location.search).toBe("?room=ABCDEF");
  });

  it("copies the game link", async () => {
    const user = userEvent.setup();
    const clipboard = { writeText: jest.fn().mockResolvedValue(undefined) };
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: clipboard });
    render(<Lobby />);
    act(() => {
      mockSocket.__emit("game-created", { roomId: "ABCDEF" });
    });

    await user.click(screen.getByRole("button", { name: /copy link/i }));

    expect(clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/?room=ABCDEF`);
    expect(screen.getByRole("status")).toHaveTextContent(/link copied/i);
  });

  it("joins the game in the current URL", () => {
    window.history.replaceState(null, "", "/?room=ABCDEF");
    render(<Lobby />);

    expect(mockSocket.joinGame).toHaveBeenCalledWith("ABCDEF");
  });

  it("clicking a selected room deselects it", async () => {
    const user = userEvent.setup();
    render(<Lobby />);
    sendLobbyUpdate([{ id: "ABCDEF", status: "waiting" }]);
    await user.click(screen.getByText("ABCDEF"));
    expect(screen.getByRole("option", { name: /ABCDEF/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await user.click(screen.getByText("ABCDEF"));
    expect(screen.getByRole("option", { name: /ABCDEF/i })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });
});
