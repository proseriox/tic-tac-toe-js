const cells = document.querySelectorAll('[data-cell]');
const statusMessage = document.querySelector('#status-message');
const restartButton = document.querySelector('#restart-button');
const playerXScore = document.querySelector('#player-x-score');
const playerOScore = document.querySelector('#player-o-score');
const playerXName = document.querySelector('#player-x-name');
const playerOName = document.querySelector('#player-o-name');
const namesForm = document.querySelector('#names-form');
const playerXNameInput = document.querySelector('#player-x-name-input');
const playerONameInput = document.querySelector('#player-o-name-input');
const resetButton = document.querySelector('#reset-button');

let currentPlayer = 'X';
let gameIsLive = true;
let winner = null;
let playerXPoints = 0;
let playerOPoints = 0;
let playerX = 'Player X';
let playerO = 'Player O';

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
    statusMessage.textContent = `${getPlayerName(currentPlayer)}'s turn`;
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
      statusMessage.textContent = `${getPlayerName(winner)} has won!`;
      updateScore();
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

function updateScore() {
  if (winner === 'X') {
    playerXPoints++;
    playerXScore.textContent = playerXPoints;
  } else if (winner === 'O') {
    playerOPoints++;
    playerOScore.textContent = playerOPoints;
  }
  localStorage.setItem('playerXPoints', playerXPoints);
  localStorage.setItem('playerOPoints', playerOPoints);
}

function handleRestartClick() {
  currentPlayer = 'X';
  gameIsLive = true;
  winner = null;
  statusMessage.textContent = `${getPlayerName(currentPlayer)}'s turn`;

  for (let cell of cells) {
    cell.classList.remove('X', 'O', 'winner');
    cell.textContent = '';
  }

  updateNames();
}

function handleResetClick() {
  playerXPoints = 0;
  playerOPoints = 0;
  playerX = 'Player X';
  playerO = 'Player O';
  localStorage.removeItem('playerXPoints');
  localStorage.removeItem('playerOPoints');
  localStorage.removeItem('playerXName');
  localStorage.removeItem('playerOName');
  updateNames();
  handleRestartClick();
}

function updateNames() {
  playerXName.textContent = getPlayerName('X');
  playerOName.textContent = getPlayerName('O');
}

function getPlayerName(player) {
  if (player === 'X') {
    return playerX;
  } else if (player === 'O') {
    return playerO;
  } else {
    return '';
  }
}

function handleNamesFormSubmit(e) {
  e.preventDefault();

  const playerXNameInputValue = playerXNameInput.value.trim();
  const playerONameInputValue = playerONameInput.value.trim();

  if (playerXNameInputValue !== '') {
    playerX = playerXNameInputValue;
    localStorage.setItem('playerXName', playerX);
  }

  if (playerONameInputValue !== '') {
    playerO = playerONameInputValue;
    localStorage.setItem('playerOName', playerO);
  }

  updateNames();
  handleRestartClick();
}


cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', handleRestartClick);

resetButton.addEventListener('click', handleResetClick);

namesForm.addEventListener('submit', handleNamesFormSubmit);

window.addEventListener('load', () => {
  const storedPlayerXPoints = localStorage.getItem('playerXPoints');
  const storedPlayerOPoints = localStorage.getItem('playerOPoints');
  const storedPlayerXName = localStorage.getItem('playerXName');
  const storedPlayerOName = localStorage.getItem('playerOName');

  if (storedPlayerXPoints) {
    playerXPoints = parseInt(storedPlayerXPoints);
    playerXScore.textContent = playerXPoints;
  }

  if (storedPlayerOPoints) {
    playerOPoints = parseInt(storedPlayerOPoints);
    playerOScore.textContent = playerOPoints;
  }

  if (storedPlayerXName) {
    playerX = storedPlayerXName;
  }

  if (storedPlayerOName) {
    playerO = storedPlayerOName;
  }

  updateNames();
  handleRestartClick();
});
