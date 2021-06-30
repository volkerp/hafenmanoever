import "./styles.css";

import Konva from "konva";

import Game from "./game.js";
import { Boat } from "./boat.js";

const WIDTH = 800;
const HEIGHT = 600;

/*
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
*/
let laststamp = 0;

/*
let stage = new createjs.Stage("canvas");
stage.enableMouseOver(20); // 20 updates per second
let matrix = new createjs.Matrix2D();
matrix.scale(6.0, 6.0);
stage.transformMatrix = matrix;
*/

let stage = new Konva.Stage({
  container: "container",
  width: WIDTH,
  height: HEIGHT,
  scaleX: 6.0,
  scaleY: 6.0
});

let game = new Game(stage);

function gameloop(timestamp) {
  let timedelta = timestamp - laststamp;
  laststamp = timestamp;

  game.update(timedelta);

  requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);
