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
let isHumanTurn; 

game.style.display = "none";
dialog.style.display = "none";

generateBtn.addEventListener("click", () => {
    game.style.display = "flex"; 
    setup.style.display = "none";
    const size = parseInt(sizeInput.value, 10);
    generateBoard(size);
})

function updateTurnIndicator() {
    if (isHumanTurn) {
        humanIndicator.style.display = "inline";
        computerIndicator.style.display = "none";
    } else {
        humanIndicator.style.display = "none";
        computerIndicator.style.display = "inline";
    }
}

function generateBoard(size) {
    board.innerHTML = "";
    board.style.display = "grid";
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    isHumanTurn = Math.round(Math.random()) === 1;
    
    updateTurnIndicator();
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener('click', () => humanMove(cell));
        board.appendChild(cell);
    }

    if (!isHumanTurn) {
        computerMove();
    } 
}

function makeMove(cell, symbolSvg) {
    cell.innerHTML = symbolSvg;
    cell.classList.add('occupied');
}

function humanMove(clickedCell) {
    if (!isHumanTurn || clickedCell.innerHTML !== '') {
        return;
    }
    makeMove(clickedCell, humanSymbol);
    isHumanTurn = false;
    updateTurnIndicator();

    setTimeout(computerMove, 600);
}

function computerMove() {
    const allCells = Array.from(board.querySelectorAll('.cell'));
    const emptyCells = allCells.filter(cell => cell.innerHTML === '');
    
    if (emptyCells.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const chosenCell = emptyCells[randomIndex];

    makeMove(chosenCell, computerSymbol);

    isHumanTurn = true;
    updateTurnIndicator();
}