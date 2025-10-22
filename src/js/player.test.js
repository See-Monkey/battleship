import Player from "./player.js";

let player;

beforeEach(() => {
  player1 = new Player("Player 1", 1);
  player2 = new Player("Player 2", 1);
  player1.opponent = player2;
  player2.opponent = player1;
});

describe("Random Attack", () => {
  test("array of options", () => {
    expect().toBeNull();
  });

  test("random selection", () => {
    expect().toBeUndefined();
  });
});

describe("Search and Destroy", () => {
  test("mode activation", () => {
    expect().toBeNull();
  });

  test("correct targeting", () => {
    expect().toBeUndefined();
  });

  test("direction change after miss", () => {
    expect().toBeNull();
  });

  test("disengage after sunk", () => {
    expect().toBeUndefined();
  });
});
