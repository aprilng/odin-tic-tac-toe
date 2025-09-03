// --- state & elements ---
const setup = document.getElementById("setup");
const game = document.getElementById("game");
const dialog = document.getElementById("dialog");
const generateBtn = document.getElementById("generateBtn");
const sizeInput = document.getElementById("sizeInput");
const board = document.getElementById("board");
const humanIndicator = document.getElementById("human-indicator");
const computerIndicator = document.getElementById("computer-indicator");

const humanSymbol = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path fill="#FFAB00" d="M12 20a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>`;
const computerSymbol = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path fill="#078DEE" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12z"/></svg>`;

const symbol = { human: humanSymbol, computer: computerSymbol };

let isHumanTurn;         // will be randomized per game
let gameOver = false;    // stop input when game ends
let boardState = [];     // 2D array of players or null

game.style.display = "none";
dialog.style.display = "none";

// --- helpers ---
function updateTurnIndicator() {
  humanIndicator.style.display = isHumanTurn ? "inline" : "none";
  computerIndicator.style.display = isHumanTurn ? "none" : "inline";
}

function showDialog(text) {
  dialog.textContent = text;
  dialog.style.display = "flex";
}

function isDraw() {
  return boardState.flat().every(v => v !== null);
}

function checkWin(row, col, player) {
  const size = boardState.length;
  const winLen = 5;
  const dirs = [
    { dr: 0, dc: 1 },   // horizontal
    { dr: 1, dc: 0 },   // vertical
    { dr: 1, dc: 1 },   // diag down-right
    { dr: -1, dc: 1 },  // diag up-right
  ];

  for (const { dr, dc } of dirs) {
    let count = 1;
    // forward
    for (let i = 1; i < winLen; i++) {
      const r = row + dr * i, c = col + dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) break;
      if (boardState[r][c] === player) count++; else break;
    }
    // backward
    for (let i = 1; i < winLen; i++) {
      const r = row - dr * i, c = col - dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) break;
      if (boardState[r][c] === player) count++; else break;
    }
    if (count >= winLen) return true;
  }
  return false;
}

// Single source of truth: DOM + state + win/draw.
// Returns true if this move ended the game.
function makeMove(cell, player) {
  if (!cell || cell.classList.contains("occupied")) return false;

  const row = parseInt(cell.dataset.row, 10);
  const col = parseInt(cell.dataset.col, 10);

  cell.innerHTML = symbol[player];
  cell.classList.add("occupied");
  boardState[row][col] = player;

  if (checkWin(row, col, player)) {
    gameOver = true;
    showDialog(player === 'human' ? "You win!" : "Computer wins!");
    return true;
  }
  if (isDraw()) {
    gameOver = true;
    showDialog("It's a draw!");
    return true;
  }
  return false;
}

// --- moves ---
function humanMove(cell) {
  if (gameOver) return;
  if (!isHumanTurn) return;
  if (cell.classList.contains("occupied")) return;

  const ended = makeMove(cell, 'human');
  if (ended) return;

  isHumanTurn = false;
  updateTurnIndicator();

  setTimeout(computerMove, 600);
}

function computerMove() {
  if (gameOver) return;

  const emptyCells = Array.from(board.querySelectorAll(".cell"))
    .filter(c => !c.classList.contains("occupied"));
  if (!emptyCells.length) return;

  const chosen = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const ended = makeMove(chosen, 'computer');
  if (ended) return;

  isHumanTurn = true;
  updateTurnIndicator();
}

// --- board creation / game start ---
function generateBoard(size) {
  // build fresh state
  boardState = Array.from({ length: size }, () => Array(size).fill(null));
  gameOver = false;

  board.innerHTML = "";
  board.style.display = "grid";
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  // create cells with coordinates
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", () => humanMove(cell));
      board.appendChild(cell);
    }
  }

  // randomly choose who starts
  isHumanTurn = Math.random() < 0.5;
  updateTurnIndicator();

  // if computer starts, move immediately
  if (!isHumanTurn) computerMove();
}

// --- UI wiring (with clamped input) ---
generateBtn.addEventListener("click", () => {
  game.style.display = "flex";
  setup.style.display = "none";

  let size = parseInt(sizeInput.value, 10);
  size = Math.max(3, Math.min(20, size));
  sizeInput.value = size; // reflect correction in the UI

  generateBoard(size);
});
