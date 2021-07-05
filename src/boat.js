import paper from "paper";

function degtorad(deg) {
  return (Math.PI / 180.0) * deg;
}

export class Poller extends paper.Path.Circle {
  constructor(posx, posy) {
    super(posx, posy, 0.8);
    this.fillColor = "red";

    this.on("mouseenter", (event) => {
      this.radius = 1.0;
      this.strokeColor = "black";
      this.strokeWidth = 0.4;
    });

    this.on("mouseleave", (event) => {
      this.radius = 0.8;
      this.strokeColor = undefined;
      this.strokeWidth = undefined;
    });
  }
}

export default class Boat extends paper.Group {
  constructor(posx, posy) {
    super();
    this.heading = 0.0; // positive y-axis (down on screen)
    this.rudder = 0;
    this.speed = 0;
    this.applyMatrix = true;

    this.hull = new paper.Path();
    this.hull.addSegments([
      [0.0, 11.0],
      [1.3, 8.0],
      [1.8, 6.0],
      [1.9, 4.0],
      [1.5, 0.0],
      [-1.5, 0.0],
      [-1.9, 4.0],
      [-1.8, 6.0],
      [-1.3, 8.0],
      [0.0, 11.0]
    ]);
    this.hull.strokeColor = "#444";
    this.hull.strokeWidth = 1.0;

    this.addChild(this.hull);

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
    this.addChild(this.klampebug);
    this.klampeheckbb = new Poller(1.3, 0.0);
    this.addChild(this.klampeheckbb);
    this.klampehecksb = new Poller(-1.3, 0.0);
    this.addChild(this.klampehecksb);

    this.translate(posx, posy);
  }

  rudderLeft() {
    this.rotation -= 10;
  }

  rudderRight() {
    this.rotation += 10;
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
    //console.log(this.hull.matrix);
    //let dir = this.hull.globalToLocal(new paper.Point(0.0, 1.0));
    let dir = new paper.Point(0.0, 1.0).rotate(this.rotation);

    let d = this.speed * (timedelta / 1000.0);
    dir = dir.multiply(d);
    this.position = this.position.add(dir);

    //this.setPos(this.x() + dir.x, this.y() + dir.y);
  }
}
