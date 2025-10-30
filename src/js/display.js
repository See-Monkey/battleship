import Player from "./player.js";

export default class Display {
  constructor() {
    this.player1;
    this.player2;
    this.activePlayer;
    this.state = null;
    // state will determine what the action button does
    // state 1 = placement, 2 = place transition, 3 = player turn, 4 = turn transition, 5 = game over
  }

  createElement(tag, className, id) {
    const element = document.createElement(tag);
    element.className = className;
    if (id !== undefined) element.id = id;
    return element;
  }

  nextChar(c) {
    const charCode = c.charCodeAt(0);
    const nextCharCode = charCode + 1;
    return String.fromCharCode(nextCharCode);
  }

  setupP2NameVisibility() {
    const humanRadio = document.querySelector("#human");
    const computerRadio = document.querySelector("#computer");
    const p2nameContainer = document.querySelector(".p2nameContainer");

    function updateVisibility() {
      // Show if "human" is checked, hide otherwise
      if (humanRadio.checked) {
        p2nameContainer.style.display = "block";
      } else {
        p2nameContainer.style.display = "none";
      }
    }

    // Add listeners for when either option is toggled
    humanRadio.addEventListener("change", updateVisibility);
    computerRadio.addEventListener("change", updateVisibility);
  }

  init() {
    const dialog = document.querySelector("dialog");
    dialog.showModal();
    this.setupP2NameVisibility();
  }

  start() {
    this.state = 1;

    // query the dom
    const p1nameInput = document.querySelector("#p1nameInput");
    const p2typeInput = document.querySelector(
      "input[name='p2type']:checked",
    ).value;
    const p2nameInput = document.querySelector("#p2nameInput");

    // validate data
    const p1name = p1nameInput.value || "Player 1";
    const p2type = p2typeInput === "human" ? 0 : 1;
    const p2name =
      p2type === 0 ? p2nameInput.value || "Player 2" : "See-Monkey";

    // initialize players
    this.player1 = new Player(p1name, 1);
    this.player2 = new Player(p2name, p2type);
    this.player1.opponent = this.player2;
    this.player2.opponent = this.player1;
    this.activePlayer = this.player1;

    // place dummy ships
    this.player1.gameboard.placeShip("carrier", [0, 0], 0);
    this.player1.gameboard.placeShip("battleship", [1, 0], 0);
    this.player1.gameboard.placeShip("cruiser", [2, 0], 0);
    this.player1.gameboard.placeShip("submarine", [3, 0], 0);
    this.player1.gameboard.placeShip("destroyer", [4, 0], 1);

    this.player2.gameboard.placeShip("carrier", [0, 0], 0);
    this.player2.gameboard.placeShip("battleship", [1, 0], 0);
    this.player2.gameboard.placeShip("cruiser", [2, 0], 0);
    this.player2.gameboard.placeShip("submarine", [3, 0], 0);
    this.player2.gameboard.placeShip("destroyer", [4, 0], 1);
    // future state: enter ship placement mode

    // redraw and await input
    this.redraw();
  }

  redraw() {
    const content = document.querySelector(".content");
    content.innerHTML = "";

    const board = this.createElement("div", "board");

    const opponentBoard = this.createElement("div", "opponentBoard");
    const activeBoard = this.createElement("div", "activeBoard");
    board.appendChild(opponentBoard);
    board.appendChild(activeBoard);

    // draw opponent board
    const row = this.createElement("div", "row");
    const emptyLabel = this.createElement("div", "label");
    opponentBoard.appendChild(row);
    row.appendChild(emptyLabel);

    for (let i = 0; i < 10; i++) {
      const label = this.createElement("div", "label");
      label.textContent = i + 1;
      row.appendChild(label);
    }

    let char;
    char = "A";
    for (let i = 0; i < 10; i++) {
      const row = this.createElement("div", "row");
      const label = this.createElement("div", "label");
      label.textContent = char;
      char = this.nextChar(char);
      opponentBoard.appendChild(row);
      row.appendChild(label);
      for (let j = 0; j < 10; j++) {
        const target = this.activePlayer.opponent.gameboard.board[i][j];
        console.log(target);
        // if already hit
        if (this.activePlayer.opponent.gameboard.board[i][j] === "hit") {
          const hitSquare = this.createElement("div", "square", `${i},${j}`);
          hitSquare.classList.add("hit");
          row.appendChild(hitSquare);
        } else if (
          // if already missed
          this.activePlayer.opponent.gameboard.board[i][j] === "miss"
        ) {
          const missedSquare = this.createElement("div", "square", `${i},${j}`);
          missedSquare.classList.add("miss");
          row.appendChild(missedSquare);
        } else {
          // if not attacked yet
          const square = this.createElement("button", "square", `${i},${j}`);
          row.appendChild(square);

          square.addEventListener("click", (e) => {
            this.attack([i, j]);
          });
        }
      }
    }

    const opponentName = this.createElement("div", "name");
    opponentName.textContent = this.activePlayer.opponent.name;
    opponentBoard.appendChild(opponentName);

    // draw active player board
    const activeRow = this.createElement("div", "row");
    const activeEmptyLabel = this.createElement("div", "label");
    activeBoard.appendChild(activeRow);
    activeRow.appendChild(activeEmptyLabel);

    for (let i = 0; i < 10; i++) {
      const label = this.createElement("div", "label");
      label.textContent = i + 1;
      activeRow.appendChild(label);
    }

    char = "A";
    for (let i = 0; i < 10; i++) {
      const row = this.createElement("div", "row");
      const label = this.createElement("div", "label");
      label.textContent = char;
      char = this.nextChar(char);
      activeBoard.appendChild(row);
      row.appendChild(label);
      for (let j = 0; j < 10; j++) {
        // if already hit
        if (this.activePlayer.gameboard.board[i][j] === "hit") {
          const hitSquare = this.createElement("div", "square", `${i},${j}`);
          hitSquare.classList.add("hit");
          row.appendChild(hitSquare);
        } else if (
          // if already missed
          this.activePlayer.gameboard.board[i][j] === "miss"
        ) {
          const missedSquare = this.createElement("div", "square", `${i},${j}`);
          missedSquare.classList.add("miss");
          row.appendChild(missedSquare);
        } else if (
          // if not attacked yet
          this.activePlayer.gameboard.board[i][j] === null
        ) {
          const square = this.createElement("div", "square", `${i},${j}`);
          row.appendChild(square);
        } else {
          // named ship present
          const shipSquare = this.createElement("div", "square", `${i},${j}`);
          shipSquare.classList.add("ship");
          row.appendChild(shipSquare);
        }
      }
    }

    const activeName = this.createElement("div", "name");
    activeName.textContent = this.activePlayer.name;
    activeBoard.appendChild(activeName);

    content.appendChild(board);
  }

  attack(coord) {
    this.activePlayer.opponent.gameboard.receiveAttack(coord);
    this.activePlayer === this.player1
      ? (this.activePlayer = this.player2)
      : (this.activePlayer = this.player1);

    // future state = pass turn activate, transition or cpu atk
    this.redraw();
  }

  message(string) {
    const msg = document.querySelector(".message");
    msg.textContent = string;
  }
}
