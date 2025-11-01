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
    // if searchAndDestroy active, run that as return
    // generate an array of available coordinates to attack
    // select one at random
    // attack
    // if hit, store the coord and activate searchAndDestroy
  }

  searchAndDestroy() {
    // from stored coord, go east until miss or invalid target
    // repeat for south, west, north
    // end mode when ship sunk
  }
}
