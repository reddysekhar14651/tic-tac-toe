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
