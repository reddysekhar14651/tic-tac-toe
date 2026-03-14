import { createGame } from "./game.js";

const board = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");

const game = createGame();

function renderStatus(status) {
  if (status.type === "winner") {
    statusEl.textContent = `Player ${status.winner} wins!`;
    return;
  }
  if (status.type === "draw") {
    statusEl.textContent = "It's a draw!";
    return;
  }
  statusEl.textContent = `Player ${status.currentPlayer}'s turn`;
}

function renderBoard() {
  const cells = game.cells;
  board.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = cells[i] ?? "";
    cell.classList.toggle("x", cells[i] === "X");
    cell.classList.toggle("o", cells[i] === "O");
    cell.disabled = game.gameOver || cells[i] !== null;
  });
}

function handleCellClick(e) {
  const button = e.target;
  if (!button.classList.contains("cell")) return;
  if (game.gameOver) return;

  const index = parseInt(button.dataset.index, 10);
  const result = game.makeMove(index);
  if (!result.success) return;

  renderBoard();
  renderStatus(result.status);
}

function resetGame() {
  game.reset();
  renderBoard();
  renderStatus(game.getStatus());
}

board.addEventListener("click", handleCellClick);
resetBtn.addEventListener("click", resetGame);

renderStatus(game.getStatus());
