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
