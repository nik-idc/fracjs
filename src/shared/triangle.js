import { Point } from "./point.js";

export class EqTriangle {
  constructor(p, size) {
    this.p = p;
    this.size = size;
  }

  scale(scaleFactor) {
    this.size *= scaleFactor;
  }

  get points() {
    const p1 = this.p;
    const p2 = new Point(this.p.x + this.size, this.p.y);
    const p3 = new Point(this.p.x + this.size / 2, this.p.y - this.size);

    return [p1, p2, p3];
  }
}
