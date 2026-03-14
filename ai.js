const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Returns whether placing `mark` at `index` on `cells` would complete a winning line.
 */
function wouldWin(cells, index, mark) {
  const next = cells.slice();
  next[index] = mark;
  for (const [a, b, c] of WIN_LINES) {
    if (next[a] === mark && next[b] === mark && next[c] === mark) return true;
  }
  return false;
}

/**
 * Returns the best move for the computer.
 * Strategy: (1) win if possible, (2) block human win, (3) center, then corners, then edges.
 * @param {Array<string|null>} cells - current board state
 * @param {string} computerMark - "X" or "O"
 * @returns {number|null} - cell index to play, or null if no move
 */
export function getBestMove(cells, computerMark) {
  const humanMark = computerMark === "X" ? "O" : "X";
  const emptyIndices = cells
    .map((v, i) => (v === null ? i : null))
    .filter((i) => i !== null);

  if (emptyIndices.length === 0) return null;

  // 1. Win if possible
  for (const i of emptyIndices) {
    if (wouldWin(cells, i, computerMark)) return i;
  }

  // 2. Block human from winning
  for (let i = 0; i < 9; i++) {
    if (cells[i] === null && wouldWin(cells, i, humanMark)) return i;
  }

  // 3. Prefer center, then corners, then edges
  const center = 4;
  const corners = [0, 2, 6, 8];
  const edges = [1, 3, 5, 7];
  const order = [center, ...corners, ...edges];

  for (const i of order) {
    if (cells[i] === null) return i;
  }

  return null;
}
