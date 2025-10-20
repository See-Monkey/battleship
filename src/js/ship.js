// Carrier - 5
// Battleship - 4
// Cruiser - 3
// Submarine - 3
// Destroyer - 2

export default class Ship {
  constructor(name) {
    const allowedNames = [
      "carrier",
      "battleship",
      "cruiser",
      "submarine",
      "destroyer",
    ];
    if (!allowedNames.includes(name)) {
      throw new Error("Invalid ship name");
    }
    this.name = name;

    switch (name) {
      case "carrier":
        this.length = 5;
        break;
      case "battleship":
        this.length = 4;
        break;
      case "cruiser":
        this.length = 3;
        break;
      case "submarine":
        this.length = 3;
        break;
      case "destroyer":
        this.length = 2;
        break;
    }

    this.hits = 0;
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return this.hits >= this.length ? true : false;
  }
}
