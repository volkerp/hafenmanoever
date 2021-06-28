import "./styles.css";

import Game from "./game.js";
import { Boat } from "./boat.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let laststamp = 0;

//Create a stage by getting a reference to the canvas
let stage = new createjs.Stage("canvas");
stage.enableMouseOver(20); // 20 updates per second
let matrix = new createjs.Matrix2D();
matrix.scale(6.0, 6.0);
stage.transformMatrix = matrix;

let game = new Game(stage);

function gameloop(timestamp) {
  let timedelta = timestamp - laststamp;
  laststamp = timestamp;
  ctx.clearRect(0, 0, 800, 600);

  game.update(timedelta);
  stage.update();

  requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);
