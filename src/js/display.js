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

    this.redrawPlaceShip();
  }

  redrawPlaceShip() {
    if (this.activePlayer === this.player2) this.state = 3;

    const content = document.querySelector(".content");
    const message = document.querySelector(".message");
    const actionBtn = document.querySelector("#actionBtn");

    content.innerHTML = "";
    message.style.display = "block";
    if (this.activePlayer.gameboard.activeShip !== "done") {
      message.textContent = `${this.activePlayer.name}, place your ${this.activePlayer.gameboard.activeShip}.`;
    } else {
      message.textContent = "All ships placed.";
    }
    actionBtn.style.display = "none";

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
        const square = this.createElement("div", "square", `${i},${j}`);
        row.appendChild(square);
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
        // if null
        if (this.activePlayer.gameboard.board[i][j] === null) {
          // create button with placeShip event listener
          const square = this.createElement(
            this.activePlayer.gameboard.activeShip !== "done"
              ? "button"
              : "div",
            "square",
            `${i},${j}`,
          );
          row.appendChild(square);

          if (this.activePlayer.gameboard.activeShip !== "done") {
            square.addEventListener("click", (e) => {
              this.activePlayer.gameboard.placeShip(
                this.activePlayer.gameboard.activeShip,
                [i, j],
                this.activePlayer.gameboard.activeOrientation,
              );
              this.redrawPlaceShip();
            });
          }
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

    const orientationBtn = document.createElement("button");
    orientationBtn.id = "orientationBtn";
    this.activePlayer.gameboard.activeOrientation === 0
      ? orientationBtn.classList.add("horiz")
      : orientationBtn.classList.add("vert");
    if (this.activePlayer.gameboard.activeShip === "done") {
      orientationBtn.classList.add("hidden");
      actionBtn.textContent = "Done";
      actionBtn.style.display = "block";
    }

    content.appendChild(board);
    content.appendChild(orientationBtn);
  }

  passTurnPlaceShip() {
    if (this.activePlayer === this.player1) {
      if (this.player2.type === 0) {
        this.state = 2;

        // transition screen to allow player 2 to become active and ready up
        this.transition();
      } else {
        // computer place all ships and move to player 1 attack
        // this.state = 3;
      }
    } else if (this.activePlayer === this.player2) {
      this.state = 4;

      // transition screen to allow player 1 to become active and ready for attack
      this.transition();
    }
  }

  passTurn() {
    if (this.player2.type === 0) {
      this.state = 4;
      this.transition();
    } else {
      // computer attack and display result
    }
  }

  transition() {
    const content = document.querySelector(".content");
    const message = document.querySelector(".message");
    const actionBtn = document.querySelector("#actionBtn");

    content.innerHTML = "";
    message.style.display = "none";
    actionBtn.textContent = "Ready";

    const transitionMsg = this.createElement("div", "transition");

    if (this.state === 2) {
      this.activePlayer = this.activePlayer.opponent;
      transitionMsg.textContent = `Pass the device to ${this.activePlayer.name} so they can place their ships.`;
    }
    if (this.state === 4) {
      this.activePlayer = this.activePlayer.opponent;
      transitionMsg.textContent = `Pass the device to ${this.activePlayer.name}.`;
    }

    content.appendChild(transitionMsg);
  }

  redraw() {
    this.state = 3;
    const content = document.querySelector(".content");
    const message = document.querySelector(".message");
    const actionBtn = document.querySelector("#actionBtn");

    content.innerHTML = "";
    message.style.display = "block";
    if (this.activePlayer.opponent.previousResult === "miss") {
      message.textContent = `${this.activePlayer.opponent.name} missed.`;
    } else if (this.activePlayer.opponent.previousResult === "hit") {
      message.textContent = `${this.activePlayer.opponent.name} hit your ${this.activePlayer.opponent.previousShip}.`;
    } else if (this.activePlayer.opponent.previousResult === "sunk") {
      message.textContent = `${this.activePlayer.opponent.name} sunk your ${this.activePlayer.opponent.previousShip}.`;
    }
    message.appendChild(document.createElement("br"));
    message.append(`${this.activePlayer.name}, you may attack when ready.`);
    actionBtn.style.display = "none";

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

  attack(coordinate) {
    const vert = coordinate[0];
    const horiz = coordinate[1];
    const hitShip = this.activePlayer.opponent.gameboard.board[vert][horiz];
    const result =
      this.activePlayer.opponent.gameboard.receiveAttack(coordinate);

    this.redraw();
    const message = document.querySelector(".message");
    const actionBtn = document.querySelector("#actionBtn");

    if (this.activePlayer.opponent.gameboard.fleetSunk() !== true) {
      if (result === "miss") {
        message.textContent = "You missed.";
        this.activePlayer.previousResult = "miss";
      } else if (result === "hit") {
        message.textContent = "You hit something!";
        this.activePlayer.previousResult = "hit";
        this.activePlayer.previousShip = hitShip;
      } else if (result === "sunk") {
        message.textContent = `You sunk ${this.activePlayer.opponent.name}'s ${hitShip}!`;
        this.activePlayer.previousResult = "sunk";
        this.activePlayer.previousShip = hitShip;
      }
      actionBtn.textContent = "Pass Turn";
      actionBtn.style.display = "block";
    } else {
      // game over
      this.state = 5;
      message.textContent = "You won!";
      actionBtn.textContent = "New Game";
      actionBtn.style.display = "block";
    }
  }

  message(string) {
    const msg = document.querySelector(".message");
    msg.textContent = string;
  }
}
