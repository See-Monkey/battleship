import Player from "./player.js";

export default class Display {
  constructor() {
    this.player1;
    this.player2;
    this.activePlayer = this.player1;
    this.inactivePlayer = this.player2;
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
    // validate data
    // take values from the dom
    // initialize players
    // redraw and await input
  }

  redraw() {
    content = document.querySelector(".content");
    content.innerHTML = "";
  }
}
