import { describe, it, expect, beforeEach } from "vitest";
import { createGame } from "./game.js";

describe("createGame", () => {
  let game;

  beforeEach(() => {
    game = createGame();
  });

  describe("initial state", () => {
    it("starts with empty cells", () => {
      expect(game.cells).toEqual([null, null, null, null, null, null, null, null, null]);
    });

    it("starts with X as current player", () => {
      expect(game.currentPlayer).toBe("X");
    });

    it("is not game over", () => {
      expect(game.gameOver).toBe(false);
    });

    it("reports status as X turn", () => {
      expect(game.getStatus()).toEqual({ type: "turn", currentPlayer: "X" });
    });
  });

  describe("makeMove", () => {
    it("places X on first move and switches to O", () => {
      const result = game.makeMove(0);
      expect(result.success).toBe(true);
      expect(game.cells[0]).toBe("X");
      expect(game.currentPlayer).toBe("O");
      expect(result.status).toEqual({ type: "turn", currentPlayer: "O" });
    });

    it("alternates players", () => {
      game.makeMove(0);
      const result = game.makeMove(1);
      expect(result.success).toBe(true);
      expect(game.cells[1]).toBe("O");
      expect(game.currentPlayer).toBe("X");
    });

    it("rejects move on occupied cell", () => {
      game.makeMove(0);
      const result = game.makeMove(0);
      expect(result.success).toBe(false);
      expect(game.cells[0]).toBe("X");
    });

    it("rejects move when game is over", () => {
      game.makeMove(0);
      game.makeMove(3);
      game.makeMove(1);
      game.makeMove(4);
      game.makeMove(2);
      const result = game.makeMove(5);
      expect(result.success).toBe(false);
    });

    it("rejects invalid index (negative)", () => {
      const result = game.makeMove(-1);
      expect(result.success).toBe(false);
    });

    it("rejects invalid index (out of range)", () => {
      const result = game.makeMove(9);
      expect(result.success).toBe(false);
    });
  });

  describe("win detection", () => {
    it("detects horizontal win (top row)", () => {
      game.makeMove(0);
      game.makeMove(3);
      game.makeMove(1);
      game.makeMove(4);
      const result = game.makeMove(2);
      expect(result.success).toBe(true);
      expect(result.status).toEqual({ type: "winner", winner: "X" });
      expect(game.gameOver).toBe(true);
    });

    it("detects horizontal win (middle row)", () => {
      game.makeMove(3);
      game.makeMove(0);
      game.makeMove(4);
      game.makeMove(1);
      const result = game.makeMove(5);
      expect(result.status).toEqual({ type: "winner", winner: "X" });
    });

    it("detects vertical win", () => {
      game.makeMove(0);
      game.makeMove(1);
      game.makeMove(3);
      game.makeMove(2);
      const result = game.makeMove(6);
      expect(result.status).toEqual({ type: "winner", winner: "X" });
    });

    it("detects diagonal win (top-left to bottom-right)", () => {
      game.makeMove(0);
      game.makeMove(1);
      game.makeMove(4);
      game.makeMove(2);
      const result = game.makeMove(8);
      expect(result.status).toEqual({ type: "winner", winner: "X" });
    });

    it("detects diagonal win (top-right to bottom-left)", () => {
      game.makeMove(2);
      game.makeMove(0);
      game.makeMove(4);
      game.makeMove(1);
      const result = game.makeMove(6);
      expect(result.status).toEqual({ type: "winner", winner: "X" });
    });

    it("detects O as winner", () => {
      game.makeMove(0);
      game.makeMove(1);
      game.makeMove(3);
      game.makeMove(4);
      game.makeMove(8);
      const result = game.makeMove(7);
      expect(result.status).toEqual({ type: "winner", winner: "O" });
    });
  });

  describe("draw", () => {
    it("detects draw when board is full with no winner", () => {
      [0, 1, 2, 4, 3, 5, 7, 6, 8].forEach((i) => game.makeMove(i));
      expect(game.getStatus()).toEqual({ type: "draw" });
      expect(game.gameOver).toBe(true);
    });

    it("last move reports draw status", () => {
      game.makeMove(0);
      game.makeMove(1);
      game.makeMove(2);
      game.makeMove(4);
      game.makeMove(3);
      game.makeMove(5);
      game.makeMove(7);
      game.makeMove(6);
      const result = game.makeMove(8);
      expect(result.status).toEqual({ type: "draw" });
    });
  });

  describe("reset", () => {
    it("clears board and restores initial state", () => {
      game.makeMove(0);
      game.makeMove(1);
      game.reset();
      expect(game.cells).toEqual([null, null, null, null, null, null, null, null, null]);
      expect(game.currentPlayer).toBe("X");
      expect(game.gameOver).toBe(false);
      expect(game.getStatus()).toEqual({ type: "turn", currentPlayer: "X" });
    });

    it("allows playing again after reset", () => {
      game.makeMove(0);
      game.makeMove(1);
      game.makeMove(2);
      game.reset();
      const result = game.makeMove(0);
      expect(result.success).toBe(true);
      expect(game.cells[0]).toBe("X");
    });
  });
});

describe("createGame with custom config", () => {
  it("creates a 4x4 board with 16 cells", () => {
    const game = createGame({ rows: 4, cols: 4, winLength: 4 });
    expect(game.cells).toHaveLength(16);
    expect(game.rows).toBe(4);
    expect(game.cols).toBe(4);
    expect(game.winLength).toBe(4);
  });

  it("detects horizontal win on a 4x4 board with winLength 4", () => {
    // Row 0: indices 0,1,2,3
    const game = createGame({ rows: 4, cols: 4, winLength: 4 });
    game.makeMove(0); // X
    game.makeMove(4); // O
    game.makeMove(1); // X
    game.makeMove(5); // O
    game.makeMove(2); // X
    game.makeMove(6); // O
    const result = game.makeMove(3); // X wins row 0
    expect(result.status).toEqual({ type: "winner", winner: "X" });
  });

  it("does not win with only 3 in a row on a 4x4 board with winLength 4", () => {
    const game = createGame({ rows: 4, cols: 4, winLength: 4 });
    game.makeMove(0); // X
    game.makeMove(4); // O
    game.makeMove(1); // X
    game.makeMove(5); // O
    const result = game.makeMove(2); // X has 3 in row 0, but needs 4
    expect(result.status.type).toBe("turn");
  });

  it("detects vertical win on a 5x3 board with winLength 3", () => {
    // cols=3, rows=5: column 0 = indices 0,3,6,9,12
    const game = createGame({ rows: 5, cols: 3, winLength: 3 });
    game.makeMove(0); // X
    game.makeMove(1); // O
    game.makeMove(3); // X
    game.makeMove(2); // O
    const result = game.makeMove(6); // X wins col 0
    expect(result.status).toEqual({ type: "winner", winner: "X" });
  });

  it("detects diagonal win on a 4x4 board with winLength 3", () => {
    // Top-left diagonal starting at (0,0): indices 0,5,10
    const game = createGame({ rows: 4, cols: 4, winLength: 3 });
    game.makeMove(0);  // X
    game.makeMove(1);  // O
    game.makeMove(5);  // X
    game.makeMove(2);  // O
    const result = game.makeMove(10); // X diagonal win
    expect(result.status).toEqual({ type: "winner", winner: "X" });
  });

  it("rejects out-of-range index for custom board size", () => {
    const game = createGame({ rows: 4, cols: 4, winLength: 4 });
    expect(game.makeMove(16).success).toBe(false);
    expect(game.makeMove(-1).success).toBe(false);
  });

  it("exposes rows, cols, winLength on the game object", () => {
    const game = createGame({ rows: 5, cols: 6, winLength: 4 });
    expect(game.rows).toBe(5);
    expect(game.cols).toBe(6);
    expect(game.winLength).toBe(4);
  });
});
