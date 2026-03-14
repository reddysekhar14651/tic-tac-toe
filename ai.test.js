import { describe, it, expect } from "vitest";
import { getBestMove } from "./ai.js";

describe("getBestMove", () => {
  describe("win when possible", () => {
    it("takes winning move (row) as O", () => {
      const cells = ["O", "O", null, "X", "X", null, null, null, null];
      expect(getBestMove(cells, "O")).toBe(2);
    });

    it("takes winning move (column) as O", () => {
      const cells = ["O", "X", null, "O", "X", null, null, null, null];
      expect(getBestMove(cells, "O")).toBe(6);
    });

    it("takes winning move (diagonal) as O", () => {
      const cells = ["O", "X", "X", null, "O", null, null, null, null];
      expect(getBestMove(cells, "O")).toBe(8);
    });

    it("takes winning move as X", () => {
      const cells = ["X", "X", null, "O", "O", null, null, null, null];
      expect(getBestMove(cells, "X")).toBe(2);
    });
  });

  describe("block human win", () => {
    it("blocks human win in row", () => {
      const cells = ["X", "X", null, "O", null, null, null, null, null];
      expect(getBestMove(cells, "O")).toBe(2);
    });

    it("blocks human win in column", () => {
      const cells = ["X", "O", null, "X", null, null, null, null, null];
      expect(getBestMove(cells, "O")).toBe(6);
    });

    it("blocks human win in diagonal", () => {
      const cells = ["X", "O", null, "O", "X", null, null, null, null];
      expect(getBestMove(cells, "O")).toBe(8);
    });

    it("blocks human (X) in middle row as O", () => {
      const cells = ["O", "X", "O", "X", "X", null, null, null, null];
      expect(getBestMove(cells, "O")).toBe(5);
    });
  });

  describe("prefer center and corners", () => {
    it("takes center on empty board", () => {
      const cells = [null, null, null, null, null, null, null, null, null];
      expect(getBestMove(cells, "O")).toBe(4);
    });

    it("takes center when available (human took corner)", () => {
      const cells = ["X", null, null, null, null, null, null, null, null];
      expect(getBestMove(cells, "O")).toBe(4);
    });

    it("takes corner when center taken", () => {
      const cells = [null, null, null, null, "X", null, null, null, null];
      const move = getBestMove(cells, "O");
      expect([0, 2, 6, 8]).toContain(move);
    });
  });

  describe("edge cases", () => {
    it("returns null when board full", () => {
      const cells = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
      expect(getBestMove(cells, "O")).toBe(null);
    });

    it("blocks over center when human about to win", () => {
      const cells = ["X", null, "X", null, "O", null, null, null, null];
      expect(getBestMove(cells, "O")).toBe(1);
    });

    it("wins over blocking when both possible", () => {
      const cells = ["O", "O", null, "X", "X", null, null, null, null];
      expect(getBestMove(cells, "O")).toBe(2);
    });
  });
});

describe("getBestMove with custom config", () => {
  it("takes winning move on a 4x4 board with winLength 4", () => {
    // Row 0: O at 0,1,2 — win at 3
    const cells = Array(16).fill(null);
    cells[0] = "O"; cells[1] = "O"; cells[2] = "O";
    cells[4] = "X"; cells[5] = "X";
    expect(getBestMove(cells, "O", { rows: 4, cols: 4, winLength: 4 })).toBe(3);
  });

  it("blocks human win on a 4x4 board with winLength 4", () => {
    // Row 1: X at 4,5,6 — block at 7
    const cells = Array(16).fill(null);
    cells[4] = "X"; cells[5] = "X"; cells[6] = "X";
    cells[0] = "O"; cells[1] = "O";
    expect(getBestMove(cells, "O", { rows: 4, cols: 4, winLength: 4 })).toBe(7);
  });

  it("returns a valid index on an empty 5x5 board with winLength 4", () => {
    const cells = Array(25).fill(null);
    const move = getBestMove(cells, "O", { rows: 5, cols: 5, winLength: 4 });
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(25);
  });

  it("returns null when board is full on a custom-size board", () => {
    const cells = Array(16).fill("X");
    expect(getBestMove(cells, "O", { rows: 4, cols: 4, winLength: 4 })).toBe(null);
  });
});
