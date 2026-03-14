import { createGame } from "./game.js";
import { getBestMove } from "./ai.js";

const HUMAN_MARK = "X";
const COMPUTER_MARK = "O";

const board = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");

const game = createGame();

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

  const index = getBestMove(game.cells, COMPUTER_MARK);
  if (index === null) return;

  const result = game.makeMove(index);
  if (!result.success) return;

  renderBoard();
  renderStatus(result.status);
}

function handleCellClick(e) {
  const button = e.target;
  if (!button.classList.contains("cell")) return;
  if (game.gameOver) return;
  if (game.currentPlayer !== HUMAN_MARK) return;

  const index = parseInt(button.dataset.index, 10);
  const result = game.makeMove(index);
  if (!result.success) return;

  renderBoard();
  renderStatus(result.status);

  // Computer responds after a short delay
  setTimeout(playComputerMove, 300);
}

function resetGame() {
  game.reset();
  renderBoard();
  renderStatus(game.getStatus());
}

board.addEventListener("click", handleCellClick);
resetBtn.addEventListener("click", resetGame);

renderStatus(game.getStatus());
