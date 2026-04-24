// Player constructor function,
// If the player is a computer, it will have a method to make a move.
function Player(name, score) {
  if (!new.target) {
    return Error('Player constructor was not called with "new"');
  } else if (name === "Computer") {
    this.recentMoves = [];
    this.winningMoves = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    this.makeMove = function (gameboard) {
      let nextMove;

      for (let i = 0; i < this.winningMoves.length; i++) {
        const move = this.winningMoves[i];
        const playerMoves = move.filter((cell) =>
          this.recentMoves.includes(cell),
        );
        if (playerMoves.length === 2) {
          nextMove = move.find((cell) => !this.recentMoves.includes(cell));
          if (nextMove !== undefined && gameboard[nextMove] === "") {
            return nextMove;
          }
        }
      }

      return Math.floor(Math.random()) * 9;
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
  const player1ScoreElement = document.querySelector("#player1 .player-score");
  const player2ScoreElement = document.querySelector("#player2 .player-score");
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
      player1ScoreElement.textContent = player1Score;
      player2ScoreElement.textContent = player2Score;
    },
  };
}

(function() {
  let player1 = undefined;
  let player2 = undefined;
  let gameBoard = undefined;

  const uiController = ui({
    onSubmit: () => {
      // Initialize players and gameboard based on user input
      ({ player1, player2 } = uiController.getPlayerNames());
      player1 = new Player(player1, 0);
      player2 = new Player(player2, 0);
      gameBoard = new gameboard(player1, player2);
      gameBoard.assignMarkers();
      console.log(gameBoard);
    },
  });
  uiController.showDialog();
})();
