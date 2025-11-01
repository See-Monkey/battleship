// Player.type 0 = human
// Player.type 1 = computer

import Gameboard from "./gameboard.js";

export default class Player {
  constructor(name, type) {
    if (type !== 0 && type !== 1)
      throw new Error("Type needed. 0 = Human, 1 = Computer");

    this.name = name;
    this.gameboard = new Gameboard();
    this.type = type;
    this.opponent = null;
    this.search = 0;
    this.activeAttack = false;
    this.previousResult = null;
    this.previousShip = null;
    this.attackedCoordinates = new Set();
  }

  placeShips() {
    for (let ship in this.gameboard.ships) {
      let shipPlaced = false;
      while (!shipPlaced) {
        const orientation = Math.round(Math.random());
        const vert = Math.floor(Math.random() * 10);
        const horiz = Math.floor(Math.random() * 10);
        const coordinate = [vert, horiz];

        if (
          this.gameboard.testPlaceShip(
            this.gameboard.ships[ship].length,
            coordinate,
            orientation,
          )
        ) {
          this.gameboard.placeShip(ship, coordinate, orientation);
          shipPlaced = true;
        }
      }
    }
  }

  attack() {
    return this.search === 1 ? this.searchAndDestroy() : this.randomAttack();
  }

  randomAttack() {
    let vert, horiz, coordinate;
    do {
      vert = Math.floor(Math.random() * 10);
      horiz = Math.floor(Math.random() * 10);
      coordinate = `${vert},${horiz}`;
    } while (this.attackedCoordinates.has(coordinate));

    const hitShip = this.opponent.gameboard.board[vert][horiz];
    this.attackedCoordinates.add(coordinate);
    const result = this.opponent.gameboard.receiveAttack([vert, horiz]);

    if (result === "hit") {
      // this.search = 1;
      this.previousResult = "hit";
      this.previousShip = hitShip;
    } else if (result === "sunk") {
      this.search = 0;
      this.previousResult = "sunk";
      this.previousShip = hitShip;
    } else if (result === "miss") {
      this.previousResult = "miss";
    }
  }

  searchAndDestroy() {
    // from stored coord, go east until miss or invalid target
    // repeat for south, west, north
    // end mode when ship sunk
  }
}
