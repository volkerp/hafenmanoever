import paper from "paper";

// import { Rect } from "./rectangle";

export default class Slider extends paper.Group {
    handle_width = 32;
    handle_height = 14;

    constructor(pos, length, range, is_vert = false) {
        super();
        this.applyMatrix = false;

        this.length = length;
        [this.min, this.max] = range;
        this.callback = undefined;

        let rail = new paper.Path.Rectangle(new paper.Point(12, 0), new paper.Size(8, length));
        rail.fillColor = "black";
        this.addChild(rail);

        this.handle = new paper.Path.Rectangle(new paper.Point(0, length / 2 - this.handle_height / 2), new paper.Size(this.handle_width, this.handle_height));
        this.handle.strokeColor = "black";
        this.handle.fillColor = "white";
        //this.handle.on("mouseenter", (event) => { this.handle.fillColor = "red"; });
        //this.handle.on("mouseleave", (event) => { this.handle.fillColor = "white"; });
        this.handle.on("mousedrag", (event) => {
            this.handle.position.y += event.delta.y;
            if (this.handle.position.y < 0)
                this.handle.position.y = 0;
            if (this.handle.position.y > length)
                this.handle.position.y = length;

            if (this.value() != this.currentValue) {
                this.currentValue = this.value();
                if (typeof this.callback == "function")
                    this.callback(this.currentValue);
            }
        });
        this.addChild(this.handle);

        this.currentValue = this.value();

        this.translate(pos);
    }

    value() {
        let v = Math.floor(this.handle.position.y / this.length * (this.max - this.min));
        return -(v + this.min);
    }

    setValue(val) {
        this.handle.position.y = -(val + this.min) * this.length / 10.0;
    }
}