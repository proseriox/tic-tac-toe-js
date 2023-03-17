const cells = document.querySelectorAll('[data-cell]');
const statusMessage = document.querySelector('#status-message');
const restartButton = document.querySelector('#restart-button');

let currentPlayer = 'X';
let gameIsLive = true;
let winner = null;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (gameIsLive && !cell.textContent) {
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer);

        checkGameStatus();
    }
}

function checkGameStatus() {
    checkWin();
    checkTie();

    if (gameIsLive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessage.textContent = `${currentPlayer}'s turn`;
    }
}

function checkWin() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;

        if (cells[a].classList.contains(currentPlayer) &&
            cells[b].classList.contains(currentPlayer) &&
            cells[c].classList.contains(currentPlayer)) {
            gameIsLive = false;
            winner = currentPlayer;
            highlightWinnerCells(combination);
            statusMessage.textContent = `${winner} has won!`;
            break;
        }
    }
}

function highlightWinnerCells(combination) {
    for (let index of combination) {
        cells[index].classList.add('winner');
    }
}

function checkTie() {
    if (Array.from(cells).every(cell => cell.textContent)) {
        gameIsLive = false;
        statusMessage.textContent = "It's a tie!";
    }
}

function handleRestartClick() {
    currentPlayer = 'X';
    gameIsLive = true;
    winner = null;
    statusMessage.textContent = `${currentPlayer}'s turn`;

    for (let cell of cells) {
        cell.classList.remove('X', 'O', 'winner');
        cell.textContent = '';
    }
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', handleRestartClick);
