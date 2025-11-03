// 10 x 10 board
// Vertical axis A - J
// Horizontal axis 1 - 10
// Origin upper left
// Ship orentation = 0-horizontal, 1-vertical

import Ship from "./ship.js";
import hitSoundFile from "../audio/cannonball.mp3";
import missSoundFile from "../audio/water-splash.mp3";
const hitSound = new Audio(hitSoundFile);
const missSound = new Audio(missSoundFile);

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
      Carrier: new Ship("Carrier"),
      Battleship: new Ship("Battleship"),
      Cruiser: new Ship("Cruiser"),
      Submarine: new Ship("Submarine"),
      Destroyer: new Ship("Destroyer"),
    };

    this.activeShip = "Carrier";
    this.activeOrientation = 0;
    this.previousAttack = null;
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
    this.nextShip();
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

  nextShip() {
    switch (this.activeShip) {
      case "Carrier":
        this.activeShip = "Battleship";
        break;
      case "Battleship":
        this.activeShip = "Cruiser";
        break;
      case "Cruiser":
        this.activeShip = "Submarine";
        break;
      case "Submarine":
        this.activeShip = "Destroyer";
        break;
      case "Destroyer":
        this.activeShip = "done";
    }
  }

  toggleOrientation() {
    this.activeOrientation === 0
      ? (this.activeOrientation = 1)
      : (this.activeOrientation = 0);
  }

  receiveAttack(coordinate) {
    const vert = coordinate[0];
    const horiz = coordinate[1];

    if (this.board[vert][horiz] === undefined) return;
    else if (this.board[vert][horiz] === "miss") {
      throw new Error("This spot was already attacked");
    } else if (this.board[vert][horiz] === null) {
      this.board[vert][horiz] = "miss";
      this.playMissSound();
      this.previousAttack = [vert, horiz];
      return "miss";
    } else {
      const shipName = this.board[vert][horiz];
      const ship = this.ships[shipName];
      ship.hit();
      this.board[vert][horiz] = "hit";
      this.playHitSound();
      this.previousAttack = [vert, horiz];
      if (ship.isSunk()) return "sunk";
      return "hit";
    }
  }

  fleetSunk() {
    return Object.values(this.ships).every((ship) => ship.isSunk());
  }

  playHitSound() {
    hitSound.currentTime = 0;
    hitSound.play();
  }

  playMissSound() {
    missSound.currentTime = 0;
    missSound.play();
  }
}
