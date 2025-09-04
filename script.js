const setup = document.getElementById("setup");
const game = document.getElementById("game");
const generateBtn = document.getElementById("generateBtn");
const sizeInput = document.getElementById("sizeInput");
const board = document.getElementById("board");
const player1Indicator = document.getElementById("player1-indicator");
const player2Indicator = document.getElementById("player2-indicator");

const dialog = document.getElementById("dialog");
const dialogMessage = document.getElementById("dialog-message");
const restartBtn = document.getElementById("restartBtn");

let isPlayerOneTurn;
let boardState = [];
let gameOver = false;

const player1SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path fill="#078DEE" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12z"/></svg>`;
const player2SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path fill="#FFAB00" d="M12 20a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>`;

game.style.display = "none";
dialog.style.display = "none";

function generateBoard(size) {
  boardState = Array.from({ length: size }, () => Array(size).fill(null));
  gameOver = false;

  board.innerHTML = "";
  board.style.display = "grid";
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  isPlayerOneTurn = Math.random() < 0.5;
  updateTurnIndicator();

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", () => cellClicked(cell));
      board.appendChild(cell);
    }
  }
}

function cellClicked(clickedCell) {
  if (clickedCell.classList.contains("occupied") || gameOver) return;

  const row = parseInt(clickedCell.dataset.row, 10);
  const col = parseInt(clickedCell.dataset.col, 10);

  const currentPlayer = isPlayerOneTurn ? "P1" : "P2";
  const currentSVG = isPlayerOneTurn ? player1SVG : player2SVG;

  clickedCell.innerHTML = currentSVG;
  clickedCell.classList.add("occupied");

  boardState[row][col] = currentPlayer;

  if (checkWin(row, col, currentPlayer)) {
    gameOver = true;
    showDialog(`${isPlayerOneTurn ? "Player 1" : "Player 2"} wins!`);
    return;
  }

  if (isDraw()) {
    gameOver = true;
    showDialog("It's a draw!");
    return;
  }

  isPlayerOneTurn = !isPlayerOneTurn;
  updateTurnIndicator();
}

function checkWin(row, col, player) {
  const size = boardState.length;
  const winLen = 5; 
  const dirs = [
    { dr: 0, dc: 1 },   
    { dr: 1, dc: 0 },   
    { dr: 1, dc: 1 },   
    { dr: -1, dc: 1 },  
  ];

  for (const { dr, dc } of dirs) {
    let count = 1;

    for (let i = 1; i < winLen; i++) {
      const r = row + dr * i, c = col + dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) break;
      if (boardState[r][c] === player) count++; else break;
    }

    for (let i = 1; i < winLen; i++) {
      const r = row - dr * i, c = col - dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) break;
      if (boardState[r][c] === player) count++; else break;
    }

    if (count >= winLen) return true;
  }
  return false;
}

function isDraw() {
  return boardState.flat().every(v => v !== null);
}

function showDialog(text) {
  dialogMessage.textContent = text;
  dialog.style.display = "flex";
}

function updateTurnIndicator() {
  if (isPlayerOneTurn) {
    player1Indicator.style.display = "inline";
    player2Indicator.style.display = "none";
  } else {
    player1Indicator.style.display = "none";
    player2Indicator.style.display = "inline";
  }
}

generateBtn.addEventListener("click", () => {
  game.style.display = "flex";
  setup.style.display = "none";
  const size = Math.max(1, parseInt(sizeInput.value, 10) || 3);
  generateBoard(size);
});

restartBtn.addEventListener("click", () => {
  dialog.style.display = "none";
  setup.style.display = "flex";
  game.style.display = "none";
});