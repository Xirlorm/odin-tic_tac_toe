/*
 * TIC TAC TOE,
 * theodinproject.com
 * Game logic implementation
 */


// Game player blueprints
const CreatePlayer = function (name, marker) {
  const getName = () => name;
  const setMarker = (newMarker) => {
    marker = newMarker;
  }
  const getMarker = () => marker;

  return { 
    setMarker,
    getMarker,
    getName,
  };
};

/*/ Player creation blueprints
class CreatePlayer {
  #name;
  #marker;
  constructor(name, marker) {
    this.#name = name;
    this.#marker = marker;
  }
  getName() {
    return this.#name;
  }
  setMarker(newMarker) {
    this.#marker = newMarker;
  }
  getMarker() {
    return this.#marker;
  }
}*/

//Game Board
const GameBoard = (function () {
  //Game board
  const _board = ["", "", "", "", "", "", "", "", ""];

  //Mark a spot on the board if not taken
  const markSpot = function (spot, marker) {
    if (!_board[spot]) {
      _board[spot] = marker;
      return 1;
    } else return 0;
  };

  //Check if the board has an empty spot
  const checkEmptySpot = function () {
    for (let spot of _board) {
      if (!spot) return true;
    }
  };

  //Display/Update current board sessions
  const display = function () {
    const spots = document.getElementsByClassName("spot");
    for (let i = 0; i < _board.length; ++i) {
      spots[i].innerText = `${_board[i]}`;
    }
  };

  //Clear Board
  const clearBoard = function () {
    for (let i = 0; i < _board.length; ++i) {
      _board[i] = "";
    }
    display();
    const dispWinner = document.getElementById("dispWinner");
    dispWinner.innerText = 0;
  };

  //Possible combinations for winner
  const _winCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  //Get all combinations for winning the game
  const getWinCombo = () => _winCombination;

  //Check if current game session has a winner
  const checkWin = function () {
    let winner;
    for (let cmbntn of _winCombination) {
      if (_board[cmbntn[0]] == "x" || _board[cmbntn[0]] == "o") {
        if (
          _board[cmbntn[0]] == _board[cmbntn[1]] &&
          _board[cmbntn[1]] == _board[cmbntn[2]]
        ) {
          winner = _board[cmbntn[0]];
          break;
        }
      }
    }

    return winner;
  };

  //Display who wins the session
  const showWinner = function (winner) {
    const dispWinner = document.getElementById('winner');
    dispWinner.textContent = `${winner.getName()} wins!`;
  }

  return {
    markSpot,
    checkEmptySpot,
    clearBoard,
    display,
    checkWin,
    getWinCombo,
    showWinner,
  };
})();

const GameFlow = (function () {
  //Initialize game players
  const _player = new CreatePlayer("player", "x");
  const _computer = new CreatePlayer("computer", "o");
  _computer.selectSpot = function () {
    return Math.floor(Math.random() * 9);
  };

  //Start game session
  function startGame() {
    //Computer plays first if it has a marker 'x'
    if (_computer.getMarker() == "x") {
      GameBoard.markSpot(_computer.selectSpot(), _computer.getMarker());
      GameBoard.display();
    }
    //Add an event for player to mark spot
    const spots = document.getElementsByClassName("spot");
    for (let i = 0; i < spots.length; ++i) {
      spots[i].addEventListener("click", () => {
        if(!GameBoard.checkWin()){
          const playerSelect = GameBoard.markSpot(i, _player.getMarker());
          //If player makes a valid selection, computer makes selection too
          if (playerSelect) {
            if (GameBoard.checkEmptySpot()) {
              let computerSelect = GameBoard.markSpot(
                _computer.selectSpot(),
                _computer.getMarker()
              );
              while (!computerSelect) {
                computerSelect = GameBoard.markSpot(
                  _computer.selectSpot(),
                  _computer.getMarker()
                );
              }
            }
          }
          //Show current game session changes
          GameBoard.display();
        }
        if(_player.getMarker() == GameBoard.checkWin()) {
          GameBoard.showWinner(_player);
        }else if(_computer.getMarker() == GameBoard.checkWin()) {
          GameBoard.showWinner(_computer);
        }
      });
    }
  }

  //Replay game session
  const replay = document.getElementById("replay");
  replay.addEventListener("click", () => {
    document.getElementById('winner').innerText = ' '
    GameBoard.clearBoard();
  });

  //Change marker and show changes
  const changeMarker = document.getElementsByClassName("marker");
  for (let marker of changeMarker) {
    marker.addEventListener("click", (e) => {
      const temp = _player.getMarker();
      if (e.target.innerText != temp) {
        _player.setMarker(e.target.innerText);
        changeMarker[0].innerText = _player.getMarker();
        _computer.setMarker(temp);
        changeMarker[1].innerText = _computer.getMarker();
        GameBoard.clearBoard();
      }
    });
  }

  return { startGame };
})();

GameFlow.startGame();
