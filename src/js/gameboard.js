// 10 x 10 board
// Vertical axis A - J
// Horizontal axis 1 - 10
// Origin upper left
// Ship orentation = 0-horizontal, 1-vertical

import Ship from "./ship.js";

export default class Gameboard {
  constructor() {
    this.board = [];
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
      for (let j = 0; j < 10; j++) {
        this.board[i][j] = null;
      }
    }

    this.ships = {
      carrier: new Ship("carrier"),
      battleship: new Ship("battleship"),
      cruiser: new Ship("cruiser"),
      submarine: new Ship("submarine"),
      destroyer: new Ship("destroyer"),
    };
  }

  placeShip(shipName, shipOrigin, shipOrientation) {
    let vert = shipOrigin[0];
    let horiz = shipOrigin[1];

    const ship = this.ships[shipName];
    const shipLength = ship.length;

    if (this.testPlaceShip(shipLength, shipOrigin, shipOrientation) === false)
      return;

    for (let i = 0; i < shipLength; i++) {
      this.board[vert][horiz] = shipName;
      shipOrientation === 0 ? horiz++ : vert++;
    }
  }

  testPlaceShip(shipLength, shipOrigin, shipOrientation) {
    let vert = shipOrigin[0];
    let horiz = shipOrigin[1];

    for (let i = 0; i < shipLength; i++) {
      if (
        this.board[vert] === undefined ||
        this.board[vert][horiz] === undefined ||
        this.board[vert][horiz] !== null
      )
        return false;

      shipOrientation === 0 ? horiz++ : vert++;
    }
    return true;
  }
}
