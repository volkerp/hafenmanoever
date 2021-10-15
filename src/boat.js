import paper from "paper";

function degtorad(deg) {
    return (Math.PI / 180.0) * deg;
}

/**
 * Signed square
 */
function signsq(x) {
    return x * x * Math.sign(x);
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
        this.v = new paper.Point(0.0, 0.0); // velocity vector pos x points to bow, pos y to stb
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

    heading_deg() {
        let h = 180.0 + this.heading;
        if (h < 0.0) h += 360.0;
        else if (h >= 360.0) h -= 360.0;

        return h;
    }

    hull_drag(angle_deg) {
        // angle_deg angle relative to bow
        // 90deg = stb -90deg = port
        let f = 0.0;
        if (Math.abs(angle_deg) << 90) {
            // bow
            f = 0.5;
        } else {
            // stern
            f = 1.0;
        }
        return Math.sin(Math.degtorad(angle_deg)) * c + 0.1 * c;
    }

    hull_dragv(velo_v) {
        // drag alined with hull (y)
        let d = new Point(0.0, 0.0);
        if (velo_v.y > 0)
            d.y = Math.max(0.2, (velo_v.y * velo_v.y)) * 0.25; // moving forward
        else if (velo_v.y < 0)
            d.y = -Math.max(0.4, (velo_v.y * velo_v.y)) * 0.5; // moving astern

        // drag across hull
        d.x = Math.sin(Math.PI / 2.0 - velo_v.angleInRadians) * Math.max(0.0, (velo_v.x * velo_v.x));

        return d;
    }


    update(d_t) {
        let a = new Point(0.0, 0.0); // acceleration vector
        let p = new Point(0.0, 1.0);
        let dir = p.rotate(this.heading);

        // acceleration by motor
        let mot_accel = this.throttle * this.power / this.mass;

        a.y += mot_accel; // motor accel only affects y dir
        a.x = 0.01;
        let d = this.hull_dragv(this.v);

        let decel = Math.max(0.2, (this.speed * this.speed)) * 0.25 * Math.sign(this.speed);

        this.v = this.v.add(a.multiply(d_t));
        if (d.multiply(d_t).length > this.v.length)
            this.v.set(0.0, 0.0);
        else
            this.v = this.v.subtract(d.multiply(d_t));

        //console.log(this.v, this.v.angle);

        this.speed += (mot_accel - decel) * d_t;
        if (Math.abs(this.speed) < 0.01) this.speed = 0.0; // stop speed from oscilating around 0.0

        // angular accelaration [rad/s^2]
        //
        let rudder_accel = this.rudder * this.speed * this.speed * 0.035;

        let wind_accel = Math.sin(this.heading_deg() * (Math.PI / 180.0)) * window.wind.spd * window.wind.spd * 0.008;

        let ang_decel = Math.max(1.4, this.omega ** 2) * 0.15 * Math.sign(this.omega);

        //console.log(rudder_accel, wind_accel, ang_decel, this.omega);


        this.omega += (rudder_accel + wind_accel - ang_decel) * d_t;

        if (Math.abs(this.omega) < 0.00001) this.omega = 0.0; // stop omega from oscilating around 0.0

        this.heading += this.omega * d_t;

        // speed vector v is relative to boat. Rotate backwards to simulate inertia
        this.v = this.v.rotate(-this.omega * d_t * 1.0);
        console.log(this.v.getDirectedAngle(new Point(0.0, 1.0)));
        this.v = this.v.rotate(this.v.getDirectedAngle(new Point(0.0, 1.0)) / 2.0);

        if (this.heading < 0.0) this.heading += 360.0;
        else if (this.heading > 360.0) this.heading -= 360.0;
        this.rotation += this.omega * d_t;

        let dd = this.speed * d_t;
        dir = dir.multiply(dd);
        this.position = this.position.add(dir);
    }
}