console.log("Hi, Mom!");

import "../css/style.css";
import Display from "./display.js";

const display = new Display();

document.addEventListener("click", handleAction);
document.addEventListener("keydown", (e) => {
  if (e.code === "Enter" || e.code === "Space") {
    const actionBtn = document.querySelector("#actionBtn");
    // only trigger when the button is visible and enabled
    if (
      actionBtn &&
      actionBtn.offsetParent !== null && // visible in DOM
      !actionBtn.disabled &&
      display.activePlayer.type === 0 // <-- only human player can trigger via keyboard
    ) {
      e.preventDefault();
      handleAction({ target: actionBtn });
    }
  }
});

function handleAction(e) {
  let target = e.target;

  if (target.id === "startBtn") {
    display.start();
  }

  if (target.id === "actionBtn") {
    switch (display.state) {
      case null: // pregame
        break;
      case 1: // placement
        display.passTurnPlaceShip();
        break;
      case 2: // placement transition
        display.redrawPlaceShip();
        break;
      case 3: // player turn
        display.passTurn();
        break;
      case 4: // turn transition
        display.redraw();
        break;
      case 5: // game over
        display.start();
        break;
    }
  }

  if (target.id === "orientationBtn") {
    display.activePlayer.gameboard.toggleOrientation();
    display.redrawPlaceShip();
  }
}

display.init();
