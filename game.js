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

export function createGame() {
  let cells = Array(9).fill(null);
  let currentPlayer = "X";
  let gameOver = false;

  function checkWinner() {
    for (const [a, b, c] of WIN_LINES) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  }

  function isDraw() {
    return cells.every((cell) => cell !== null);
  }

  function getStatus() {
    const winner = checkWinner();
    if (winner) return { type: "winner", winner };
    if (isDraw()) return { type: "draw" };
    return { type: "turn", currentPlayer };
  }

  function makeMove(index) {
    if (gameOver || index < 0 || index > 8 || cells[index] !== null) {
      return { success: false, status: getStatus() };
    }
    cells[index] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    const status = getStatus();
    if (status.type === "winner" || status.type === "draw") {
      gameOver = true;
    }
    return { success: true, status };
  }

  function reset() {
    cells = Array(9).fill(null);
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
    getStatus,
    makeMove,
    reset,
  };
}
