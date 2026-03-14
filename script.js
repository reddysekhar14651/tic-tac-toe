import { createGame } from "./game.js";

const board = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let game;

function getConfig() {
  const rows = Math.max(3, Math.min(10, parseInt(document.getElementById("rows").value, 10) || 3));
  const cols = Math.max(3, Math.min(10, parseInt(document.getElementById("cols").value, 10) || 3));
  const winLength = Math.max(3, Math.min(Math.min(rows, cols), parseInt(document.getElementById("win-length").value, 10) || 3));
  return { rows, cols, winLength };
}

function buildBoard(rows, cols) {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  board.style.maxWidth = `min(90vw, ${Math.max(280, cols * 70)}px)`;
  const fontSize = Math.max(1, 2.5 - Math.max(rows, cols) * 0.15);
  board.style.fontSize = `${fontSize}rem`;

  const total = rows * cols;
  for (let i = 0; i < total; i++) {
    const btn = document.createElement("button");
    btn.className = "cell";
    btn.dataset.index = i;
    btn.setAttribute("aria-label", `Cell ${i + 1}`);
    board.appendChild(btn);
  }
}

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
  const button = e.target.closest(".cell");
  if (!button) return;
  if (game.gameOver) return;

  const index = parseInt(button.dataset.index, 10);
  const result = game.makeMove(index);
  if (!result.success) return;

  renderBoard();
  renderStatus(result.status);
}

function startNewGame() {
  const config = getConfig();
  buildBoard(config.rows, config.cols);
  game = createGame(config);
  renderBoard();
  renderStatus(game.getStatus());
}

board.addEventListener("click", handleCellClick);
resetBtn.addEventListener("click", startNewGame);

startNewGame();
