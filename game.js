function generateWinLines(rows, cols, winLength) {
  const lines = [];

  // Horizontal
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols - winLength; c++) {
      const line = [];
      for (let k = 0; k < winLength; k++) line.push(r * cols + c + k);
      lines.push(line);
    }
  }

  // Vertical
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r <= rows - winLength; r++) {
      const line = [];
      for (let k = 0; k < winLength; k++) line.push((r + k) * cols + c);
      lines.push(line);
    }
  }

  // Diagonal (top-left to bottom-right)
  for (let r = 0; r <= rows - winLength; r++) {
    for (let c = 0; c <= cols - winLength; c++) {
      const line = [];
      for (let k = 0; k < winLength; k++) line.push((r + k) * cols + (c + k));
      lines.push(line);
    }
  }

  // Diagonal (top-right to bottom-left)
  for (let r = 0; r <= rows - winLength; r++) {
    for (let c = winLength - 1; c < cols; c++) {
      const line = [];
      for (let k = 0; k < winLength; k++) line.push((r + k) * cols + (c - k));
      lines.push(line);
    }
  }

  return lines;
}

export function createGame({ rows = 3, cols = 3, winLength = 3 } = {}) {
  const totalCells = rows * cols;
  const winLines = generateWinLines(rows, cols, winLength);
  let cells = Array(totalCells).fill(null);
  let currentPlayer = "X";
  let gameOver = false;

  function checkWinner() {
    for (const line of winLines) {
      const first = cells[line[0]];
      if (first && line.every((i) => cells[i] === first)) return first;
    }
    return null;
  }

  function isDraw() {
    return cells.every((c) => c !== null);
  }

  function getStatus() {
    const winner = checkWinner();
    if (winner) return { type: "winner", winner };
    if (isDraw()) return { type: "draw" };
    return { type: "turn", currentPlayer };
  }

  function makeMove(index) {
    if (gameOver || index < 0 || index >= totalCells || cells[index] !== null) {
      return { success: false, status: getStatus() };
    }
    cells[index] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    const status = getStatus();
    if (status.type === "winner" || status.type === "draw") gameOver = true;
    return { success: true, status };
  }

  function reset() {
    cells = Array(totalCells).fill(null);
    currentPlayer = "X";
    gameOver = false;
  }

  return {
    get cells() {
      return [...cells];
    },
    get currentPlayer() {
      return currentPlayer;
    },
    get gameOver() {
      return gameOver;
    },
    rows,
    cols,
    winLength,
    getStatus,
    makeMove,
    reset,
  };
}
