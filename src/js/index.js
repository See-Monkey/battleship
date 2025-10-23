console.log("Hi, Mom!");

import "../css/style.css";
import Display from "./display.js";

const display = new Display();

document.addEventListener("click", (e) => {
  let target = e.target;
  if (target.id === "startBtn") {
    display.start();
  }
});

display.init();
