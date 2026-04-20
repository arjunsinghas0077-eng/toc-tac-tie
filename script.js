let mode = "pvp"; // "pvp" or "ai"

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

// prevents AI overlap and spam clicks which tbh people do to win unfairly
let isThinking = false;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// settingup board clicks
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleClick(cell, index));
});

// OUR MOVE
function handleClick(cell, index) {
  if (board[index] !== "" || !gameActive || isThinking) return;

  if (mode === "ai" && currentPlayer === "O") return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  checkWinner();

  // trigger AI if needed
  if (mode === "ai" && currentPlayer === "O" && gameActive) {
    isThinking = true;

    setTimeout(() => {
      aiMove();
      isThinking = false;
    }, 300);
  }
}

// WIN LOGIC
function checkWinner() {
  let won = false;

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      won = true;
      break;
    }
  }

  if (won) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusText.textContent = "Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (mode === "ai") {
    statusText.textContent =
      currentPlayer === "X" ? "Your turn" : "AI thinking...";
  } else {
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

// AI (random ahh move)
function aiMove() {
  let empty = [];

  board.forEach((val, i) => {
    if (val === "") empty.push(i);
  });

  if (empty.length === 0 || !gameActive) return;

  let move = empty[Math.floor(Math.random() * empty.length)];

  board[move] = "O";
  cells[move].textContent = "O";

  checkWinner();

  if (gameActive) {
    currentPlayer = "X";
    statusText.textContent = "Your turn";
  }
}

// restart the fucken game
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  isThinking = false;

  statusText.textContent = "Select a mode";
  cells.forEach(cell => (cell.textContent = ""));
}

// start game mode (menu button)
function startGame(selectedMode) {
  mode = selectedMode;

  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";

  restartGame();
}