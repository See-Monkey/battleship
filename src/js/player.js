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
    this.searchCoordinate = null;
    this.searchDirection = null;
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
    let vert, horiz;
    do {
      vert = Math.floor(Math.random() * 10);
      horiz = Math.floor(Math.random() * 10);
      this.searchCoordinate = `${vert},${horiz}`;
    } while (this.attackedCoordinates.has(this.searchCoordinate));

    const hitShip = this.opponent.gameboard.board[vert][horiz];
    this.attackedCoordinates.add(this.searchCoordinate);
    const result = this.opponent.gameboard.receiveAttack([vert, horiz]);

    if (result === "hit") {
      this.search = 1;
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
    if (!this.searchCoordinate) return this.randomAttack();

    let [originVert, originHoriz] = this.searchCoordinate
      .split(",")
      .map(Number);

    let vert = originVert;
    let horiz = originHoriz;

    // randomly choose east or south initially
    if (this.searchDirection === null) {
      const randomDirection = Math.floor(Math.random() * 2);
      this.searchDirection = randomDirection === 0 ? [0, 1] : [1, 0];
    }

    let attacked = false;

    while (!attacked) {
      // step in the current direction
      vert += this.searchDirection[0];
      horiz += this.searchDirection[1];

      const coordinate = `${vert},${horiz}`;

      // out of bounds; change direction
      if (vert < 0 || vert > 9 || horiz < 0 || horiz > 9) {
        this.nextDirection();
        vert = originVert;
        horiz = originHoriz;
        continue;
      }

      // already attacked; if miss, switch direction early
      if (this.attackedCoordinates.has(coordinate)) {
        const square = this.opponent.gameboard.board[vert][horiz];
        if (square === "miss") {
          this.nextDirection();
          vert = originVert;
          horiz = originHoriz;
        }
        continue;
      }

      // valid square found; attack
      const hitShip = this.opponent.gameboard.board[vert][horiz];
      this.attackedCoordinates.add(coordinate);
      const result = this.opponent.gameboard.receiveAttack([vert, horiz]);

      if (result === "hit") {
        this.previousResult = "hit";
        this.previousShip = hitShip;
      } else if (result === "sunk") {
        this.previousResult = "sunk";
        this.previousShip = hitShip;
        this.search = 0;
        this.searchDirection = null;
        this.searchCoordinate = null;
      } else if (result === "miss") {
        this.previousResult = "miss";
        this.nextDirection();
        vert = originVert;
        horiz = originHoriz;
      }

      attacked = true; // exit loop after attacking one square
    }
  }

  nextDirection() {
    const [vert, horiz] = this.searchDirection;

    if (vert === 0 && horiz === 1) {
      this.searchDirection = [0, -1]; // east to west
    } else if (vert === 0 && horiz === -1) {
      this.searchDirection = [1, 0]; // west to south
    } else if (vert === 1 && horiz === 0) {
      this.searchDirection = [-1, 0]; // south to north
    } else if (vert === -1 && horiz === 0) {
      this.searchDirection = [0, 1]; // wrap back around, north to east
    }
  }
}
