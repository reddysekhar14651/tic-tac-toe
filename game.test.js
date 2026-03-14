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
