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
        this.mass = 1800.0;
        this.power = 1500.0;
        this.heading = 0.0; // positive y-axis (down on screen)
        this.rudder = 0;
        this.omega = 0.0; // angular velocity [1/s]
        this.speed = 0;
        this.throttle = 0;
        this.applyMatrix = true;

        this.hull = new paper.Path();
        this.hull.addSegments([
            [0.0, 12.0],
            [1.3, 8.0],
            [1.8, 6.0],
            [1.9, 4.0],
            [1.5, 0.0],
            [-1.5, 0.0],
            [-1.9, 4.0],
            [-1.8, 6.0],
            [-1.3, 8.0],
            [0.0, 12.0]
        ]);
        this.hull.strokeColor = "#444";
        this.hull.strokeWidth = 1.6;
        this.hull.fillColor = "#E8E4DA";

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

        this.klampebug = new Poller(0, 11.5);
        this.addChild(this.klampebug);
        this.klampeheckbb = new Poller(1.3, 0.0);
        this.addChild(this.klampeheckbb);
        this.klampehecksb = new Poller(-1.3, 0.0);
        this.addChild(this.klampehecksb);

        this.translate(posx, posy);
    }

    rudderLeft() {
        this.rudder -= 1;
        if (this.rudder < -5) this.rudder = -5;
    }

    rudderRight() {
        this.rudder += 1;
        if (this.rudder > 5) this.rudder = 5;
    }

    speedUp() {
        this.throttle += 1.0;
        if (this.throttle > 5) this.throttle = 5;
    }

    speedDown() {
        this.throttle -= 1.0;
        if (this.throttle < -5) this.throttle = -5;
    }

    update(d_t) {
        let p = new paper.Point(0.0, 1.0);
        let dir = p.rotate(this.heading);

        let accel = this.throttle * this.power / this.mass;
        let decel = Math.max(0.2, (this.speed * this.speed)) * 0.25 * Math.sign(this.speed);
    

        this.speed += (accel - decel) * d_t;
        if (Math.abs(this.speed) < 0.01) this.speed = 0.0;  // stop speed from oscilating around 0.0

        // alpha: angular accelaration [rad/s^2]
        let alpha = this.rudder * this.speed * 0.35 - Math.max(5.0, (this.omega * this.omega)) * 0.075 *  Math.sign(this.omega);
        this.omega += alpha * d_t;
        if (Math.abs(this.omega) < 0.01) this.omega = 0.0;  // stop omega from oscilating around 0.0

        this.heading += this.omega * d_t;
        this.rotation += this.omega * d_t;
        
        let d = this.speed * d_t;
        dir = dir.multiply(d);
        this.position = this.position.add(dir);
    }
}