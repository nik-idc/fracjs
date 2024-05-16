import { Point } from "./point.js";

export class Line {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  get right() {
    return this.p1.x >= this.p2.x ? this.p1 : this.p2;
  }

  get left() {
    return this.p1.x < this.p2.x ? this.p1 : this.p2;
  }

  get top() {
    return this.p1.y >= this.p2.y ? this.p1 : this.p2;
  }

  get bottom() {
    return this.p1.y < this.p2.y ? this.p1 : this.p2;
  }

  get middle() {
    const distX = Math.abs(this.right.x - this.left.x);
    const middleX = this.left.x + distX / 2;

    const distY = Math.abs(this.bottom.y - this.top.y);
    const middleY = this.top.y + distY / 2;

    return new Point(middleX, middleY);
  }

  get isHor() {
    return this.p1.x === this.p2.x;
  }

  get isVert() {
    return this.p1.y === this.p2.y;
  }
}
