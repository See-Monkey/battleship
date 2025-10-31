// Carrier - 5
// Battleship - 4
// Cruiser - 3
// Submarine - 3
// Destroyer - 2

export default class Ship {
  constructor(name) {
    const allowedNames = [
      "Carrier",
      "Battleship",
      "Cruiser",
      "Submarine",
      "Destroyer",
    ];
    if (!allowedNames.includes(name)) {
      throw new Error("Invalid ship name");
    }
    this.name = name;

    switch (name) {
      case "Carrier":
        this.length = 5;
        break;
      case "Battleship":
        this.length = 4;
        break;
      case "Cruiser":
        this.length = 3;
        break;
      case "Submarine":
        this.length = 3;
        break;
      case "Destroyer":
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
