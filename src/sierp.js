import { Point } from "./shared/point.js";
import { EqTriangle } from "./shared/triangle.js";

export class SierpinskiTriangle {
  /**
   *
   * @param {EqTriangle} initialTriangle
   */
  constructor(initialTriangle) {
    this.prevLevels = [];
    this.curLevel = [initialTriangle];
    this.curLevelNum = 1;
  }

  static sierpTriangleSplit(triangle) {
    const newSize = triangle.size / 2;

    const p1 = new Point(triangle.p.x, triangle.p.y);
    const leftTriangle = new EqTriangle(p1, newSize);

    const p2 = new Point(triangle.p.x + newSize, triangle.p.y);
    const rightTriangle = new EqTriangle(p2, newSize);

    const p3 = new Point(triangle.p.x + newSize / 2, triangle.p.y - newSize);
    const topTriangle = new EqTriangle(p3, newSize);

    return [leftTriangle, rightTriangle, topTriangle];
  }

  iterate() {
    this.prevLevels.push(this.curLevel);
    this.curLevel = [];
    this.curLevelNum++;
    const prevLevel = this.prevLevels[this.prevLevels.length - 1];

    for (const triangle of prevLevel) {
      this.curLevel.push(...SierpinskiTriangle.sierpTriangleSplit(triangle));
    }

    console.log(this.curLevel);
  }

  static degToRad(degrees) {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Draws current level of the Sierpinski triangle
   * @param {CanvasRenderingContext2D} context
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   */
  draw(context, canvasWidth, canvasHeight) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    
    for (const triangle of this.curLevel) {
      const points = triangle.points;

      context.fillStyle = "rgb(255 0 0)";
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      context.lineTo(points[1].x, points[1].y);
      context.lineTo(points[2].x, points[2].y);
      context.lineTo(points[0].x, points[0].y);
      context.fill();
    }
  }
}
