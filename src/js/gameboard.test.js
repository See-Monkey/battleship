import Gameboard from "./gameboard.js";

let gameboard;

beforeEach(() => {
  gameboard = new Gameboard();
});

describe("Gameboard Array", () => {
  test("array of arrays", () => {
    expect(gameboard.board[9][9]).toBeNull();
  });

  test("size of array", () => {
    expect(gameboard.board[10]).toBeUndefined();
  });
});

describe("Gameboard Place Ship", () => {
  test("place ship horizontal", () => {
    gameboard.placeShip("destroyer", [0, 0], 0);
    expect(gameboard.board[0][1]).toBe("destroyer");
  });

  test("place ship vertical", () => {
    gameboard.placeShip("submarine", [0, 1], 1);
    expect(gameboard.board[2][1]).toBe("submarine");
  });
});

describe("Gameboard Test Place Ship", () => {
  test("test place ship horizontal", () => {
    expect(gameboard.testPlaceShip(3, [0, 0], 0)).toBe(true);
  });

  test("test place ship vertical", () => {
    gameboard.placeShip("destroyer", [0, 1], 1);
    expect(gameboard.testPlaceShip(3, [0, 1], 1)).toBe(false);
  });

  test("test place ship out of bounds", () => {
    expect(gameboard.testPlaceShip(3, [0, 8], 0)).toBe(false);
  });
});

describe("Receive Attack", () => {
  test("receive hit", () => {
    gameboard.placeShip("destroyer", [0, 1], 1);
    gameboard.receiveAttack([0, 1]);
    expect(gameboard.ships.destroyer.hits).toBe(1);
  });

  test("receive miss", () => {
    gameboard.receiveAttack([7, 7]);
    expect(gameboard.board[7][7]).toBe("miss");
  });
});

describe("Check If Fleet Sunk", () => {
  beforeEach(() => {
    gameboard.placeShip("carrier", [0, 0], 0);
    gameboard.placeShip("battleship", [1, 0], 0);
    gameboard.placeShip("cruiser", [2, 0], 0);
    gameboard.placeShip("submarine", [3, 0], 0);
    gameboard.placeShip("destroyer", [4, 0], 0);

    const shipPositions = {
      carrier: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
      ],
      battleship: [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      cruiser: [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      submarine: [
        [3, 0],
        [3, 1],
        [3, 2],
      ],
      destroyer: [
        [4, 0],
        // [4, 1],  intentionally commented to be hit manually in 2nd test
      ],
    };

    for (const positions of Object.values(shipPositions)) {
      positions.forEach((coord) => gameboard.receiveAttack(coord));
    }
  });

  test("not all sunk", () => {
    expect(gameboard.fleetSunk()).toBe(false);
  });

  test("all sunk", () => {
    gameboard.receiveAttack([4, 1]);
    expect(gameboard.fleetSunk()).toBe(true);
  });
});
