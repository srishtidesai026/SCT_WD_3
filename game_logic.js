let playerText = document.getElementById('playerText');
let restartBtn = document.getElementById('restartBtn');
let gameModeSelection = document.getElementById('gameModeSelection');
let friendBtn = document.getElementById('friendBtn');
let computerBtn = document.getElementById('computerBtn');
let gameboard = document.getElementById('gameboard');
let boxes = Array.from(document.getElementsByClassName('box'));

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');

const O_TEXT = "O";
const X_TEXT = "X";
let currentPlayer = X_TEXT;
let spaces = Array(9).fill(null);

// This variable will store the selected game mode
let isComputerPlayer = false;

const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked));
};

function selectGameMode(mode) {
    isComputerPlayer = (mode === 'computer');
    gameModeSelection.style.display = 'none';
    gameboard.style.display = 'flex';
    restartBtn.style.display = 'block';
    startGame();
}

friendBtn.addEventListener('click', () => selectGameMode('friend'));
computerBtn.addEventListener('click', () => selectGameMode('computer'));

function boxClicked(e) {
    const id = e.target.id;

    // Handle Human vs. Human
    if (!spaces[id] && !isComputerPlayer) {
        playerMove(id);
        if (!checkWinOrDraw()) {
            currentPlayer = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
        }
    }

    // Handle Human vs. Computer
    if (!spaces[id] && isComputerPlayer && currentPlayer === X_TEXT) {
        playerMove(id);
        if (!checkWinOrDraw()) {
            // Introduce a short delay before the computer makes its move
            setTimeout(() => {
                currentPlayer = O_TEXT;
                computerMove();
            }, 500); // 500ms delay
        }
    }
}

// Handle player move (for both Human vs. Human and Human vs. Computer)
function playerMove(id) {
    spaces[id] = currentPlayer;
    document.getElementById(id).innerText = currentPlayer;
}

// Handle computer move (random empty spot)
function computerMove() {
    let availableSpaces = spaces
        .map((space, index) => space === null ? index : null)
        .filter(index => index !== null);

    if (availableSpaces.length > 0) {
        let randomIndex = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
        spaces[randomIndex] = O_TEXT;
        boxes[randomIndex].innerText = O_TEXT;

        if (!checkWinOrDraw()) {
            currentPlayer = X_TEXT; // Switch back to the human player
        }
    }
}

// Check if there is a winner or a draw
function checkWinOrDraw() {
    if (playerHasWon() !== false) {
        playerText.innerHTML = `${currentPlayer} has won!`;
        let winning_blocks = playerHasWon();
        winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);
        return true;
    }

    if (spaces.every(space => space !== null)) {
        playerText.innerHTML = 'It\'s a draw!';
        return true;
    }

    return false;
}

// Winning combinations
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Determine if a player has won
function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;
        if (spaces[a] && (spaces[a] === spaces[b] && spaces[a] === spaces[c])) {
            return [a, b, c];
        }
    }
    return false;
}

// Restart the game
restartBtn.addEventListener('click', restart);

function restart() {
    spaces.fill(null);
    boxes.forEach(box => {
        box.innerText = '';
        box.style.backgroundColor = '';
    });
    playerText.innerHTML = 'Tic Tac Toe';
    currentPlayer = X_TEXT; // Human player always starts
    gameboard.style.display = 'none';
    restartBtn.style.display = 'none';
    gameModeSelection.style.display = 'block';
}

// Initialize the game