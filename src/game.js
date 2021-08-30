import paper from "paper";
import Boat from "/src/boat.js";

// import { Rect } from "./rectangle";

export default class Game {
  constructor() {
    this.boat = new Boat(50, 70);

    this.pier = new paper.Path.Rectangle(0, 85, 800, 600);
    this.pier.strokeColor = "black";
    this.pier.sendToBack();

    this.collisions = [];

    document.onkeydown = (event) => {
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
          console.log("arrowup");
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
    //this.boat.position = new paper.Point(100, 0);
    this.boat.update(timedelta);
    if (this.pier.intersects(this.boat.hull)) {
      this.pier.strokeColor = "red";
    } else {
      this.pier.strokeColor = "black";
    }


    this.collisions.forEach((e) => e.remove());

    var intersections = this.pier.getIntersections(this.boat.hull);
    for (var i = 0; i < intersections.length; i++) {
      this.collisions.push(new paper.Path.Circle({
        center: intersections[i].point,
        radius: 0.5,
        fillColor: '#009dec'
      }));
    }
  }

  hitcheck() {
    /*
    function scan_rect_for_collision(rect, s1, s2) {
      const step = 0.5;
      for (let x = rect.x; x <= rect.x + rect.width; x += step)
        for (let y = rect.y; y <= rect.y + rect.height; y += step) {
          //let p = inv_matrix.transformPoint(x, y);
          let p1 = s1.getTransform().invert().point({ x: x, y: y });
          //console.log(p1);
          if (s1.intersects(p1)) console.log("intersect", x, y);
        }
    }

    let rb = Rect.fromKonva(
      this.boat.getClientRect({ relativeTo: this.stage })
    );
    console.log(this.boat.getTransform());
    let rp = Rect.fromKonva(
      this.pier.getClientRect({ relativeTo: this.stage })
    );

    let i = rb.intersect(rp);
    if (!i.isEmpty()) {
      scan_rect_for_collision(i, this.boat.hull, this.pier);
    }
*/
    /*
      .getTransformedBounds()
      .intersection(this.pier_rect);
    if (intersection && !intersection.isEmpty()) {
      let hitpoint = scan_rect_for_collision(
        intersection,
        this.boat,
        this.pier
      );
    
    }
    */
  }
}
