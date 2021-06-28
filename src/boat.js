import Victor from "victor";

function degtorad(deg) {
  return (Math.PI / 180.0) * deg;
}

export class Poller extends createjs.Shape {
  constructor(posx, posy) {
    super();

    let g = new createjs.Graphics();
    g.beginFill("#f00").drawCircle(posx, posy, 0.5);
    this.graphics = g;

    this.on("mouseover", (event) => {
      let g = new createjs.Graphics();
      g.beginFill("#f00").drawCircle(posx, posy, 0.5);
      g.beginStroke("#000").setStrokeStyle(0.3).drawCircle(posx, posy, 0.8);
      this.graphics = g;
    });

    this.on("mouseout", (event) => {
      let g = new createjs.Graphics();
      g.beginFill("#f00").drawCircle(posx, posy, 0.5);
      this.graphics = g;
    });
  }
}

export default class Boat extends createjs.Container {
  constructor(posx, posy) {
    super();
    this.heading = 0.0; // positive y-axis (down on screen)
    this.rudder = 0;
    this.speed = 0;

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

    this.klampebug = new Poller(0, 11.0);
    this.addChild(this.klampebug);
    this.klampeheckbb = new Poller(1.3, 0.0);
    this.addChild(this.klampeheckbb);
    this.klampehecksb = new Poller(-1.3, 0.0);
    this.addChild(this.klampehecksb);
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
    //this.pos.add();
    dir.multiply(Victor(d, d));
    [this.x, this.y] = [this.x + dir.x, this.y + dir.y];
  }

  draw2(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(degtorad(this.heading + 180.0));
    ctx.scale(4.0, 4.0);

    ctx.beginPath();
    ctx.moveTo(0.0, 11.0);
    ctx.lineTo(1.5, 9.5);
    ctx.lineTo(1.9, 6.0);
    ctx.lineTo(2.0, 4.0);
    ctx.lineTo(1.6, 0);
    ctx.lineTo(-1.6, 0.0);
    ctx.lineTo(-2.0, 4.0);
    ctx.lineTo(-1.9, 6.0);
    ctx.lineTo(-1.5, 9.5);
    ctx.lineTo(0.0, 11.0);
    ctx.stroke();

    ctx.restore();
  }
}
