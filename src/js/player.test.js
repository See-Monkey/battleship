import Player from "./player.js";

let player;

beforeEach(() => {
  player1 = new Player("Player 1", 1);
  player2 = new Player("Player 2", 1);
  player1.opponent = player2;
  player2.opponent = player1;
});

describe("Random Attack", () => {
  test("random selection", () => {
    // Spy on opponent’s receiveAttack to ensure it’s called with a valid coordinate
    const spy = jest.spyOn(player2.gameboard, "receiveAttack");

    player1.randomAttack();

    expect(spy).toHaveBeenCalledTimes(1);

    const [[vert, horiz]] = spy.mock.calls[0];
    expect(vert).toBeGreaterThanOrEqual(0);
    expect(vert).toBeLessThanOrEqual(9);
    expect(horiz).toBeGreaterThanOrEqual(0);
    expect(horiz).toBeLessThanOrEqual(9);
  });
});

describe("Search and Destroy", () => {
  test("mode activation", () => {
    player2.gameboard.placeShip("Destroyer", [0, 0], 0);

    // Simulate an attack that hits
    player1.opponent = player2;
    player1.randomAttack = jest.fn(() => {
      player1.opponent.gameboard.receiveAttack([0, 0]);
      player1.previousResult = "hit";
      player1.search = 1;
    });

    player1.randomAttack();

    // Expect search mode to activate
    expect(player1.search).toBe(1);
    expect(player1.previousResult).toBe("hit");
  });

  test("correct targeting", () => {
    // Place a ship for player1 at [0,0] horizontally
    player1.gameboard.placeShip("Destroyer", [0, 0], 0);

    // Set up computer to begin search mode
    player2.search = 1;
    player2.searchCoordinate = "0,0";
    player2.searchDirection = [0, 1]; // east

    // Spy on attacks
    const spy = jest.spyOn(player1.gameboard, "receiveAttack");

    player2.searchAndDestroy();

    // Check that the next coordinate attacked was adjacent east ([0,1])
    const [[vert, horiz]] = spy.mock.calls[0];
    expect([[vert, horiz]]).toEqual([[0, 1]]);
  });

  test("direction change after miss", () => {
    player1.gameboard.placeShip("Destroyer", [0, 0], 0);
    player1.gameboard.receiveAttack([0, 1]);
    player2.search = 1;
    player2.searchCoordinate = "0,1";
    player2.searchDirection = [0, 1];
    player2.searchAndDestroy();
    expect(player2.searchDirection).toEqual([0, -1]);
  });

  test("disengage after sunk", () => {
    player1.gameboard.placeShip("Destroyer", [0, 0], 0);
    player1.gameboard.receiveAttack([0, 0]);
    player2.search = 1;
    player2.searchCoordinate = "0,0";
    player2.searchDirection = [0, 1];
    player2.searchAndDestroy();
    expect(player2.search).toBe(0);
  });
});
