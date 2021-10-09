import paper from "paper";

// import { Rect } from "./rectangle";

function bound(min, val, max) {
    return Math.min(max, Math.max(val, min));
}


export default class Slider extends paper.Group {
    handle_width = 32;
    handle_height = 14;

    constructor(pos, length, range, is_horiz = false) {
        super();
        this.applyMatrix = false;

        this.length = length;
        [this.min, this.max] = range;
        this.is_horiz = is_horiz;
        this.callback = undefined;
        this.mousepos = undefined;

        if (is_horiz) {
            let rail = new paper.Path.Rectangle(new paper.Point(0, 12), new paper.Size(length, 8));
            rail.fillColor = "black";
            this.addChild(rail);
            this.handle = new paper.Path.Rectangle(new paper.Point(length / 2 - this.handle_height / 2, 0), new paper.Size(this.handle_height, this.handle_width));
            this.handle.on("mousedrag", (event) => {
                this.handle.position.x = bound(0, event.point.x - this.bounds.left, length);

                if (this.value() != this.currentValue) {
                    this.currentValue = this.value();
                    if (typeof this.callback == "function")
                        this.callback(this.currentValue);
                }
            });
        } else {
            let rail = new paper.Path.Rectangle(new paper.Point(12, 0), new paper.Size(8, length));
            rail.fillColor = "black";
            this.addChild(rail);
            this.handle = new paper.Path.Rectangle(new paper.Point(0, length / 2 - this.handle_height / 2), new paper.Size(this.handle_width, this.handle_height));
            // this.handle.on("mousedown", (event) => { this.handle.fillColor = "red"; this.mousepos = event.point; });
            // this.handle.on("mouseup", (event) => { this.handle.fillColor = "white"; });
            this.handle.on("mousedrag", (event) => {
                // event.point.y is relative to group
                this.handle.position.y = bound(0, event.point.y - this.bounds.top, length);

                if (this.value() != this.currentValue) {
                    this.currentValue = this.value();
                    if (typeof this.callback == "function")
                        this.callback(this.currentValue);
                }
            });
        }
        this.handle.strokeColor = "black";
        this.handle.fillColor = "white";

        this.addChild(this.handle);

        this.currentValue = this.value();

        this.translate(pos); 
    }

    value() {
        let v;
        if (this.is_horiz) {
            v = Math.floor((this.handle.position.x / this.length) * (this.max - this.min));
            return v + this.min;
        } else {
            v = Math.floor((1.0 - this.handle.position.y / this.length) * (this.max - this.min));
            return v + this.min;
        }
    }

    setValue(val) {
        if (this.is_horiz) {
            this.handle.position.x = (val - this.min) * this.length / 10.0;
        } else {
            this.handle.position.y = -(val + this.min) * this.length / 10.0;
        }
    }
}