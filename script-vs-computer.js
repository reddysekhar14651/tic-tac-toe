import { createGame } from "./game.js";
import { getBestMove } from "./ai.js";

const HUMAN_MARK = "X";
const COMPUTER_MARK = "O";

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
    const isHuman = status.winner === HUMAN_MARK;
    statusEl.textContent = isHuman ? "You win!" : "Computer wins!";
    return;
  }
  if (status.type === "draw") {
    statusEl.textContent = "It's a draw!";
    return;
  }
  const isHumanTurn = status.currentPlayer === HUMAN_MARK;
  statusEl.textContent = isHumanTurn ? "Your turn (X)" : "Computer's turn...";
}

function renderBoard() {
  const cells = game.cells;
  const humanTurn = game.currentPlayer === HUMAN_MARK && !game.gameOver;
  board.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = cells[i] ?? "";
    cell.classList.toggle("x", cells[i] === "X");
    cell.classList.toggle("o", cells[i] === "O");
    cell.disabled = game.gameOver || cells[i] !== null || !humanTurn;
  });
}

function playComputerMove() {
  if (game.gameOver || game.currentPlayer !== COMPUTER_MARK) return;

  const index = getBestMove(game.cells, COMPUTER_MARK, {
    rows: game.rows,
    cols: game.cols,
    winLength: game.winLength,
  });
  if (index === null) return;

  const result = game.makeMove(index);
  if (!result.success) return;

  renderBoard();
  renderStatus(result.status);
}

function handleCellClick(e) {
  const button = e.target.closest(".cell");
  if (!button) return;
  if (game.gameOver) return;
  if (game.currentPlayer !== HUMAN_MARK) return;

  const index = parseInt(button.dataset.index, 10);
  const result = game.makeMove(index);
  if (!result.success) return;

  renderBoard();
  renderStatus(result.status);

  setTimeout(playComputerMove, 300);
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
