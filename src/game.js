import paper from "paper";
import Slider from "./Slider";
import Boat from "/src/boat.js";

export default class Game {
    constructor() {
        var background = new Path.Rectangle({
            point: [0, 0],
            size: [view.size.width, view.size.height],
            fillColor: "#AFD7EC"
        });

        window.wind = { 'spd': 0.0, 'dir': 0.0 };

        this.throttle_slider = new Slider([686, 420], 120, [-5, 5]);
        this.throttle_slider.callback = (value) => { this.boat.throttle = value; }

        this.rudder_slider = new Slider([640, 560], 120, [-5, 5], true);
        this.rudder_slider.callback = (value) => { this.boat.rudder = value; }

        this.windspd_slider = new Slider([390, 420], 80, [0, 7]);
        this.windspd_slider.setValue(0);
        this.windspd_slider.callback = (value) => { window.wind.spd = value; }
        this.winddir_slider = new Slider([366, 510], 80, [-180, 180.0], true);
        this.winddir_slider.callback = (value) => { window.wind.dir = value; }

        this.pier = new Path.Rectangle(0, 340, paper.view.size.width, 600);
        this.pier.strokeColor = "black";
        this.pier.fillColor = "grey";
        this.pier.insertAbove(background);
        console.log(background, this.pier);

        this.boat = new Boat(100, 170);
        this.boat.scale(5.0);
        this.boat.insertAbove(this.pier);

        this.collisions = [];

        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    {
                        this.boat.rudderLeft();
                        this.rudder_slider.setValue(this.boat.rudder);
                        break;
                    }
                case "ArrowRight":
                    {
                        this.boat.rudderRight();
                        this.rudder_slider.setValue(this.boat.rudder);
                        break;
                    }
                case "ArrowUp":
                    {
                        this.boat.speedUp();
                        this.throttle_slider.setValue(this.boat.throttle);
                        break;
                    }
                case "ArrowDown":
                    {
                        this.boat.speedDown();
                        this.throttle_slider.setValue(this.boat.throttle);
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

    updatePanelValues() {
        let throttle_value = document.getElementById("throttle_value");
        let speed_value = document.getElementById("speed_value");
        let rudder_value = document.getElementById("rudder_value");
        let heading_value = document.getElementById("heading_value");
        let omega_value = document.getElementById("omega_value");
        let windspd_value = document.getElementById("windspd_value");
        let winddir_value = document.getElementById("winddir_value");
        throttle_value.innerHTML = this.boat.throttle;
        speed_value.innerHTML = Number.parseFloat(this.boat.speed).toFixed(2);
        rudder_value.innerHTML = this.boat.rudder;
        heading_value.innerHTML = Number.parseFloat(this.boat.heading_deg()).toFixed(2);
        omega_value.innerHTML = Number.parseFloat(this.boat.omega).toFixed(2);
        windspd_value.innerHTML = window.wind.spd;
        winddir_value.innerHTML = window.wind.dir + "°";
    }


    update(timedelta_s) {
        //this.boat.position = new paper.Point(100, 0);
        this.boat.update(timedelta_s);
        this.updatePanelValues();

        this.collisions.forEach((e) => e.remove());
        this.collisions = [];

        this.hitcheck();
    }

    hitcheck() {
        this.collisions.forEach((e) => e.remove());
        this.collisions = [];

        var intersections = this.pier.getIntersections(this.boat.hull);
        for (var i = 0; i < intersections.length; i++) {
            this.collisions.push(new paper.Path.Star({
                center: intersections[i].point,
                points: 5,
                radius1: 3.0,
                radius2: 7.0,
                fillColor: '#FDE600',
                strokeColor: "black"
            }));
        }
        this.collisions.forEach((e) => e.insertAbove(this.boat));
    }
}