document.addEventListener("DOMContentLoaded", () => {
  const singleBtn = document.getElementById("singlePlayerBtn");
  const twoBtn = document.getElementById("twoPlayerBtn");
  const modeSelection = document.getElementById("modeSelection");
  const gameScreen = document.getElementById("gameScreen");
  const backBtn = document.getElementById("backBtn");
  const gameTitle = document.getElementById("gameTitle");
  const xScore = document.getElementById("xScore");
  const oScore = document.getElementById("oScore");
  const tieScore = document.getElementById("tieScore");
  const xLabel = document.getElementById("xLabel");
  const oLabel = document.getElementById("oLabel");
  const turnIndicator = document.getElementById("turnIndicator");
  const statusText = document.getElementById("statusText");
  const gameBoard = document.getElementById("gameBoard");
  const newGameBtn = document.getElementById("newGameBtn");
  const resetScoresBtn = document.getElementById("resetScoresBtn");

  // Game state
  let mode = null; // 'single' or 'double'
  let board = Array(9).fill("");
  let currentPlayer = "X";
  let scores = { x: 0, o: 0, ties: 0 };
  let gameActive = false;

  // Helper functions
  function showScreen(screen) {
    modeSelection.classList.remove("active");
    gameScreen.classList.remove("active");
    if (screen === "mode") modeSelection.classList.add("active");
    if (screen === "game") gameScreen.classList.add("active");
  }

  function startGame(selectedMode) {
    mode = selectedMode;
    board = Array(9).fill("");
    currentPlayer = "X";
    gameActive = true;
    updateBoard();
    updateStatus();
    showScreen("game");
    if (mode === "single") {
      gameTitle.textContent = "You vs Computer";
      xLabel.textContent = "You (X)";
      oLabel.textContent = "Computer (O)";
    } else {
      gameTitle.textContent = "Player 1 vs Player 2";
      xLabel.textContent = "Player 1 (X)";
      oLabel.textContent = "Player 2 (O)";
    }
  }

  function updateBoard() {
    Array.from(gameBoard.children).forEach((cell, idx) => {
      cell.textContent = board[idx];
      cell.className = "cell";
      if (board[idx] === "X") cell.classList.add("x");
      if (board[idx] === "O") cell.classList.add("o");
      cell.disabled = !!board[idx] || !gameActive;
    });
  }

  function updateStatus(winner = null, winLine = null) {
    if (winner) {
      if (winner === "TIE") {
        statusText.textContent = "It's a tie!";
        turnIndicator.className = "turn-indicator";
      } else {
        statusText.textContent = (mode === "single" && winner === "O") ? "Computer wins!" : `${winner} wins!`;
        turnIndicator.className = `turn-indicator ${winner.toLowerCase()}-turn`;
      }
      if (winLine) {
        winLine.forEach(idx => gameBoard.children[idx].classList.add("winning"));
      }
    } else {
      statusText.textContent = (mode === "single" && currentPlayer === "O") ? "Computer's turn (O)" : `${currentPlayer === "X" ? (mode === "single" ? "Your" : "Player 1's") : (mode === "single" ? "Computer's" : "Player 2's") } turn (${currentPlayer})`;
      turnIndicator.className = `turn-indicator ${currentPlayer.toLowerCase()}-turn`;
    }
    xScore.textContent = scores.x;
    oScore.textContent = scores.o;
    tieScore.textContent = scores.ties;
  }

  function checkWinner() {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let line of lines) {
      const [a,b,c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], winLine: line };
      }
    }
    if (board.every(cell => cell)) return { winner: "TIE" };
    return null;
  }

  function handleCellClick(e) {
    const idx = +e.target.dataset.index;
    if (!gameActive || board[idx]) return;
    board[idx] = currentPlayer;
    updateBoard();
    const result = checkWinner();
    if (result) {
      gameActive = false;
      if (result.winner === "X") scores.x++;
      else if (result.winner === "O") scores.o++;
      else scores.ties++;
      updateStatus(result.winner, result.winLine);
      return;
    }
    if (mode === "single") {
      currentPlayer = "O";
      updateStatus();
      setTimeout(computerMove, 500);
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateStatus();
    }
  }

  function computerMove() {
    if (!gameActive) return;
    // Simple AI: pick random empty cell
    const empty = board.map((v,i) => v ? null : i).filter(v => v !== null);
    if (empty.length === 0) return;
    const idx = empty[Math.floor(Math.random() * empty.length)];
    board[idx] = "O";
    updateBoard();
    const result = checkWinner();
    if (result) {
      gameActive = false;
      if (result.winner === "X") scores.x++;
      else if (result.winner === "O") scores.o++;
      else scores.ties++;
      updateStatus(result.winner, result.winLine);
      return;
    }
    currentPlayer = "X";
    updateStatus();
  }

  function resetGame() {
    board = Array(9).fill("");
    currentPlayer = "X";
    gameActive = true;
    updateBoard();
    updateStatus();
    if (mode === "single" && currentPlayer === "O") setTimeout(computerMove, 500);
  }

  function resetScores() {
    scores = { x: 0, o: 0, ties: 0 };
    updateStatus();
  }

  function getGameStats() {
    const totalGames = scores.x + scores.o + scores.ties;
    if (totalGames === 0) {
      return {
        totalGames: 0,
        xWinRate: 0,
        oWinRate: 0,
        tieRate: 0
      };
    }
    return {
      totalGames: totalGames,
      xWinRate: Math.round((scores.x / totalGames) * 100),
      oWinRate: Math.round((scores.o / totalGames) * 100),
      tieRate: Math.round((scores.ties / totalGames) * 100)
    };
  }

  function showModeSelection() {
    showScreen("mode");
  }

  // Attach event listeners
  singleBtn.addEventListener("click", () => {
    startGame("single");
  });
  twoBtn.addEventListener("click", () => {
    startGame("double");
  });
  backBtn.addEventListener("click", () => {
    showScreen("mode");
    gameActive = false;
  });
  Array.from(gameBoard.children).forEach(cell => {
    cell.addEventListener("click", handleCellClick);
  });
  newGameBtn.addEventListener("click", resetGame);
  resetScoresBtn.addEventListener("click", resetScores);

  // Start at mode selection
  showScreen("mode");

  // Export functions for potential future use
  window.TicTacToe = {
    resetGame,
    resetScores,
    getGameStats,
    selectGameMode: startGame,
    showModeSelection
  };
});