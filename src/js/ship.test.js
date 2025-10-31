import Ship from "./ship.js";

describe("Ship", () => {
  let ship;

  test("length", () => {
    ship = new Ship("Battleship");
    expect(ship.length).toBe(4);
  });

  test("hit", () => {
    ship = new Ship("Submarine");
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  test("is sunk", () => {
    ship = new Ship("Destroyer");
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
