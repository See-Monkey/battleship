import Player from "./player.js";

export default class Display {
  constructor() {
    this.player1;
    this.player2;
    this.activePlayer = this.player1;
  }

  createElement(tag, className, id) {
    const element = document.createElement(tag);
    element.className = className;
    if (id !== undefined) element.id = id;
  }

  init() {
    const dialog = document.querySelector("dialog");
    dialog.showModal();
  }

  start() {
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
  }

  message(string) {
    const msg = document.querySelector(".message");
    msg.textContent = string;
  }
}
