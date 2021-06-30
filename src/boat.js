import Konva from "konva";
import Victor from "victor";

function degtorad(deg) {
  return (Math.PI / 180.0) * deg;
}

function setPos(x, y) {
  this.x(x);
  this.y(y);
}

export class Poller extends Konva.Circle {
  constructor(posx, posy) {
    super({
      x: posx,
      y: posy,
      radius: 0.6,
      fill: "#f00"
    });
    this.setPos = setPos;

    this.on("mouseenter", (event) => {
      this.setAttrs({ radius: 0.8, stroke: "#000", strokeWidth: 0.3 });
    });

    this.on("mouseleave", (event) => {
      this.setAttrs({ radius: 0.6, stroke: undefined, strokeWidth: undefined });
    });
  }
}

export default class Boat extends Konva.Group {
  constructor(posx, posy) {
    super({
      x: posx,
      y: posy
    });
    this.setPos = setPos;
    this.heading = 0.0; // positive y-axis (down on screen)
    this.rudder = 0;
    this.speed = 0;

    this.hull = new Konva.Line({
      points: [
        0.0,
        11.0,
        1.3,
        8.0,
        1.8,
        6.0,
        1.9,
        4.0,
        1.5,
        0.0,
        -1.5,
        0.0,
        -1.9,
        4.0,
        -1.8,
        6.0,
        -1.3,
        8.0
      ],
      stroke: "#444",
      strokeWidth: 0.3,
      closed: true
    });

    this.add(this.hull);

    /*
    let g = new createjs.Graphics();
    g.beginStroke("#444")
      .setStrokeStyle(0.3)
      .moveTo(0.0, 11.0)
      .lineTo(1.3, 8.0)
      .lineTo(1.8, 6.0)
      .lineTo(1.9, 4.0)
      .lineTo(1.5, 0.0)
      .lineTo(-1.5, 0.0)
      .lineTo(-1.9, 4.0)
      .lineTo(-1.8, 6.0)
      .lineTo(-1.3, 8.0)
      .lineTo(0.0, 11.0);

    g.beginStroke("#aaa")
      .setStrokeStyle(0.2)
      .moveTo(0.0, 0.6)
      .lineTo(1.0, 0.6)
      .lineTo(1.1, 3.0)
      .lineTo(-1.1, 3.0)
      .lineTo(-1.0, 0.6)
      .lineTo(0.0, 0.6);
    this.hull = new createjs.Shape(g);
    this.addChild(this.hull);
    [this.x, this.y] = [posx, posy];
    */

    this.klampebug = new Poller(0, 11.0);
    this.add(this.klampebug);
    this.klampeheckbb = new Poller(1.3, 0.0);
    this.add(this.klampeheckbb);
    this.klampehecksb = new Poller(-1.3, 0.0);
    this.add(this.klampehecksb);
  }

  rudderLeft() {
    this.heading -= 10;
  }

  rudderRight() {
    this.heading += 10;
  }

  speedUp() {
    this.speed += 1.0;
    if (this.speed > 6) this.speed = 6;
  }

  speedDown() {
    this.speed -= 1.0;
    if (this.speed < -6) this.speed = -6;
  }

  update(timedelta) {
    let dir = Victor(0.0, 1.0);
    dir.rotateDeg(this.heading + 180.0);
    let d = this.speed * (timedelta / 1000.0);

    dir.multiply(Victor(d, d));
    this.setPos(this.x() + dir.x, this.y() + dir.y);
  }
}
