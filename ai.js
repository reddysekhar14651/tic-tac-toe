function generateWinLines(rows, cols, winLength) {
  const lines = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols - winLength; c++) {
      const line = [];
      for (let k = 0; k < winLength; k++) line.push(r * cols + c + k);
      lines.push(line);
    }
  }

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r <= rows - winLength; r++) {
      const line = [];
      for (let k = 0; k < winLength; k++) line.push((r + k) * cols + c);
      lines.push(line);
    }
  }

  for (let r = 0; r <= rows - winLength; r++) {
    for (let c = 0; c <= cols - winLength; c++) {
      const line = [];
      for (let k = 0; k < winLength; k++) line.push((r + k) * cols + (c + k));
      lines.push(line);
    }
  }

  for (let r = 0; r <= rows - winLength; r++) {
    for (let c = winLength - 1; c < cols; c++) {
      const line = [];
      for (let k = 0; k < winLength; k++) line.push((r + k) * cols + (c - k));
      lines.push(line);
    }
  }

  return lines;
}

function wouldWin(cells, index, mark, winLines) {
  const next = cells.slice();
  next[index] = mark;
  for (const line of winLines) {
    if (line.includes(index) && line.every((i) => next[i] === mark)) return true;
  }
  return false;
}

/**
 * Returns the best move for the computer.
 * Strategy: (1) win if possible, (2) block human win,
 * (3) pick cell participating in the most unblocked winning lines.
 * @param {Array<string|null>} cells - current board state
 * @param {string} computerMark - "X" or "O"
 * @param {{ rows?: number, cols?: number, winLength?: number }} config
 * @returns {number|null} - cell index to play, or null if no move
 */
export function getBestMove(cells, computerMark, { rows = 3, cols = 3, winLength = 3 } = {}) {
  const winLines = generateWinLines(rows, cols, winLength);
  const humanMark = computerMark === "X" ? "O" : "X";
  const emptyIndices = cells
    .map((v, i) => (v === null ? i : null))
    .filter((i) => i !== null);

  if (emptyIndices.length === 0) return null;

  // 1. Win if possible
  for (const i of emptyIndices) {
    if (wouldWin(cells, i, computerMark, winLines)) return i;
  }

  // 2. Block human from winning
  for (const i of emptyIndices) {
    if (wouldWin(cells, i, humanMark, winLines)) return i;
  }

  // 3. Pick cell that participates in the most winning lines not blocked by the opponent
  const scores = new Array(rows * cols).fill(0);
  for (const line of winLines) {
    const hasHuman = line.some((i) => cells[i] === humanMark);
    if (!hasHuman) {
      for (const i of line) {
        if (cells[i] === null) scores[i]++;
      }
    }
  }

  let best = emptyIndices[0];
  let bestScore = -1;
  for (const i of emptyIndices) {
    if (scores[i] > bestScore) {
      bestScore = scores[i];
      best = i;
    }
  }
  return best;
}
