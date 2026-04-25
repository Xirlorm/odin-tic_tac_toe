// Shuffle a given array in place
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

// Check if a  given combination will result in a win
function comboPossible(combo, gameboard, marker) {
  let possible = true;
  const markers = combo.map((index) => gameboard[index]);

  markers.forEach((cell) => {
    if (cell !== "" && cell !== marker) {
      possible = false;
    }
  });

  return possible;
}

// Player constructor function, If the player is a computer, it will have a method to make a move.
function Player(name, score) {
  if (!new.target) {
    return Error('Player constructor was not called with "new"');
  } else if (name === "Computer") {
    this.winningMoves = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]; // All possible winning combinations
    this.recentMoves = []; // Keep track of recent moves make by computer
    this.recentWinningMoves = null;

    this.makeMove = function (gameboard) {
      let nextMove;
      this.winningMoves = this.winningMoves.filter((combo) =>
        comboPossible(combo, gameboard, this.marker),
      );

      do {
        if (
          this.winningMoves.length > 0 &&
          this.recentMoves.length > 0 &&
          this.recentMoves.length < 3
        ) {
          if (
            this.recentWinningMoves !== null &&
            comboPossible(this.recentWinningMoves, gameboard, this.marker)
          ) {
            nextMove = this.recentWinningMoves.find(
              (move) => gameboard[move] === "",
            );
          } else {
            const randomCombo =
              this.winningMoves[
                Math.floor(Math.random() * this.winningMoves.length)
              ];
            nextMove = randomCombo.find((index) => gameboard[index] === "");
            this.recentWinningMoves = randomCombo;
          }
        } else nextMove = Math.floor(Math.random() * 9);
      } while (gameboard[nextMove] !== "");

      shuffle(this.winningMoves);
      this.recentMoves.push(nextMove);
      return nextMove;
    };
  }

  this.name = name;
  this.marker = "";
  this.score = score;
}

// Gameboard constructor function, which will manage the game state and logic.
function gameboard(firstPlayer, secondPlayer) {
  return {
    firstPlayer: firstPlayer,
    secondPlayer: secondPlayer,
    currentPlayer: undefined,
    roundWinner: undefined,
    board: ["", "", "", "", "", "", "", "", ""],

    assignMarkers: function () {
      // Randomly assign markers to players
      if (Math.random() < 0.5) {
        this.firstPlayer.marker = "X";
        this.secondPlayer.marker = "O";
      } else {
        this.firstPlayer.marker = "O";
        this.secondPlayer.marker = "X";
      }
    },
    makeMove: function (move) {
      // Update the gameboard state with the player's move
      if (this.board[move] === "") {
        this.board[move] = this.currentPlayer.marker;
        return true;
      }
      return false;
    },
    resetGameboard: function () {
      // Reset the gameboard state for a new game
      this.board = ["", "", "", "", "", "", "", "", ""];
      this.roundWinner = undefined;
    },
    checkWin: function () {
      // Check for winning combinations
      const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
          this.board[a] &&
          this.board[a] === this.board[b] &&
          this.board[a] === this.board[c]
        ) {
          this.roundWinner = this.currentPlayer;
          return true;
        }
      }
      return false;
    },
  };
}

// UI constructor function, which will manage the user interface and interactions.
function ui(callbacks) {
  const gameBoardElement = document.querySelector(".gameboard");
  const playerInfoInputDialog = document.querySelector("dialog");
  const playerInfoDialog = document.getElementById("player1-info");
  const playerNameInput = document.querySelector(".player-name");
  const player2InfoDialog = document.getElementById("player2-info");
  const player2NameInput = document.querySelector(".player2-name");
  const player2Btn = document.getElementById("player2-btn");
  const computerBtn = document.getElementById("computer-btn");
  const submitBtn = document.getElementById("submit-btn");
  const resetBtn = document.getElementById("reset-btn");
  const gameStatusElement = document.querySelector(".game-status");
  const player1NameElement = document.querySelector("#player1 .name");
  const player2NameElement = document.querySelector("#player2 .name");
  const player1ScoreElement = document.querySelector("#player1 .score");
  const player2ScoreElement = document.querySelector("#player2 .score");
  const player2Selector = document.getElementById("player2-selector");
  let isPlayer2Computer = undefined;

  computerBtn.addEventListener("click", () => {
    isPlayer2Computer = true;
    computerBtn.classList.add("selected");
    player2Btn.classList.remove("selected");
  });

  player2Btn.addEventListener("click", () => {
    isPlayer2Computer = false;
    player2Selector.style.display = "none";
    playerInfoDialog.style.display = "none";
    player2InfoDialog.style.display = "block";
    computerBtn.classList.remove("selected");
    player2Btn.classList.add("selected");
  });

  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    if (isPlayer2Computer === undefined) {
      player2Selector.style.display = "block";
      playerInfoDialog.style.display = "none";
      return;
    }

    if (isPlayer2Computer) {
      player2NameInput.value = "Computer";
    }
    playerInfoInputDialog.close();
    const { onSubmit } = callbacks;
    onSubmit();
  });

  gameBoardElement.addEventListener("click", (e) => {
    if (e.target.classList.contains("cell")) {
      const cellIndex = Array.from(gameBoardElement.children).indexOf(e.target);
      const { onCellClick } = callbacks;
      onCellClick(cellIndex);
    }
  });

  resetBtn.addEventListener("click", () => {
    Array.from(gameBoardElement.children).forEach((cell) => {
      cell.classList.remove("marked-x", "marked-o");
    });
    const { onReset } = callbacks;
    onReset();
  });

  return {
    showDialog: () => playerInfoInputDialog.showModal(),
    hideDialog: () => playerInfoInputDialog.close(),
    getPlayerNames: () => ({
      player1: playerNameInput.value.trim() || "Player 1",
      player2: isPlayer2Computer
        ? "Computer"
        : player2NameInput.value.trim() || "Player 2",
    }),
    updatePlayerNames: (player1Name, player2Name) => {
      player1NameElement.textContent = player1Name;
      player2NameElement.textContent = player2Name;
    },
    updatePlayerScores: (player1Score, player2Score) => {
      player1ScoreElement.textContent = `${player1Score}`;
      player2ScoreElement.textContent = `${player2Score}`;
    },
    markSpot: (cellIndex, marker) => {
      const cell = gameBoardElement.children[cellIndex];
      if (marker === "X") {
        cell.classList.add("marked-x");
      } else if (marker === "O") {
        cell.classList.add("marked-o");
      }
    },
    updateGameStatus: (message) => {
      gameStatusElement.textContent = message;
    },
  };
}

(function () {
  let player1 = undefined; // Player 1 instance
  let player2 = undefined; // Player 2 instance
  let gameBoard = undefined; // Gameboard instance

  function handleMove(cellIndex) {
    uiController.markSpot(cellIndex, gameBoard.currentPlayer.marker);

    if (gameBoard.checkWin()) {
      gameBoard.currentPlayer.score++;
      uiController.updateGameStatus(`${gameBoard.currentPlayer.name} wins!`);
      uiController.updatePlayerScores(
        gameBoard.firstPlayer.score,
        gameBoard.secondPlayer.score,
      );
      gameBoard.roundWinner = gameBoard.currentPlayer;
      gameBoard.currentPlayer = null;
      return;
    } else if (gameBoard.board.filter((cell) => cell === "").length === 0) {
      uiController.updateGameStatus("It's a tie!");
      gameBoard.roundWinner = "tie";
      gameBoard.currentPlayer = null;
      return;
    }
    gameBoard.currentPlayer =
      gameBoard.currentPlayer === gameBoard.firstPlayer
        ? gameBoard.secondPlayer
        : gameBoard.firstPlayer;
  }

  const uiController = ui({
    // Callback on Playwer info submission
    onSubmit: () => {
      // Initialize players and gameboard based on user input
      ({ player1, player2 } = uiController.getPlayerNames());
      player1 = new Player(player1, 0);
      player2 = new Player(player2, 0);
      gameBoard = new gameboard(player1, player2);

      gameBoard.assignMarkers();
      gameBoard.currentPlayer = gameBoard.firstPlayer;
      uiController.updatePlayerNames(player1.name, player2.name);
      uiController.updateGameStatus(`${gameBoard.currentPlayer.name}'s turn`);
    },
    // Callback on cell click by player(s)
    onCellClick: (cellIndex) => {
      if (gameboard.roundWinner) return;
      if (!gameBoard.makeMove(cellIndex)) return;

      handleMove(cellIndex);

      if (gameBoard.currentPlayer.name === "Computer") {
        let computerMove = gameBoard.currentPlayer.makeMove(gameBoard.board);
        while (!gameBoard.makeMove(computerMove)) {
          computerMove = gameBoard.currentPlayer.makeMove(gameBoard.board);
        }
        handleMove(computerMove);
      }

      uiController.updateGameStatus(`${gameBoard.currentPlayer.name}'s turn`);
    },
    // Callback on reseet button click
    onReset: () => {
      gameBoard.resetGameboard();
      gameBoard.currentPlayer = gameBoard.firstPlayer;
      uiController.updateGameStatus(`${gameBoard.currentPlayer.name}'s turn`);
    },
  });

  uiController.showDialog(); // Show the player info input dialog when the page loads
})();
