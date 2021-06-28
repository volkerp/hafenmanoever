import Boat from "/src/boat.js";

export default class Game {
  constructor(stage) {
    this.stage = stage;
    this.boat = new Boat(50, 50);
    stage.addChild(this.boat);

    let pier = new createjs.Shape();
    pier.graphics.beginFill("#999").drawRect(0, 85, 800, 600);
    stage.addChild(pier);

    window.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowLeft": {
          this.boat.rudderLeft();
          break;
        }
        case "ArrowRight": {
          this.boat.rudderRight();
          break;
        }
        case "ArrowUp": {
          this.boat.speedUp();
          break;
        }
        case "ArrowDown": {
          this.boat.speedDown();
          break;
        }
        default:
          break;
      }
    };
  }

  drawBackground(ctx) {
    ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 550, 800, 600);
    ctx.beginPath();
    ctx.moveTo(0, 550);
    ctx.lineTo(800, 550);
    ctx.stroke();
  }

  update(timedelta) {
    this.boat.update(timedelta);
  }
}
