export function sierpTriangleSplit() {
  const Point = (x, y) => {
    return {
      x: x,
      y: y,
    };
  };

  const points = (p, size) => {
    const p1 = Point(p.x, p.y);
    const p2 = Point(p.x + size, p.y);
    const p3 = Point(p.x + size / 2, p.y - size);

    return [p1, p2, p3];
  };

  const Triangle = (p, size) => {
    return { p: p, size: size, points: points(p, size) };
  };

  function split(triangle) {
    const newSize = triangle.size / 2;

    const p1 = Point(triangle.p.x, triangle.p.y);
    const leftTriangle = Triangle(p1, newSize);

    const p2 = Point(triangle.p.x + newSize, triangle.p.y);
    const rightTriangle = Triangle(p2, newSize);

    const p3 = Point(triangle.p.x + newSize / 2, triangle.p.y - newSize);
    const topTriangle = Triangle(p3, newSize);

    return [leftTriangle, rightTriangle, topTriangle];
  }

  return { Point, points, Triangle, split };
}

export class SierpinskiTriangle {
  constructor(initialTriangle) {
    this.prevLevels = [];
    this.curLevel = [initialTriangle];
    this.curLevelNum = 1;
    this.maxLevel = 12;
  }

  iterate() {
    if (this.curLevelNum >= this.maxLevel) {
      return false;
    }

    this.prevLevels.push(this.curLevel);
    this.curLevel = [];
    this.curLevelNum++;
    const prevLevel = this.prevLevels[this.prevLevels.length - 1];

    const before = performance.now();
    for (const triangle of prevLevel) {
      this.curLevel.push(...sierpTriangleSplit().split(triangle));
    }

    console.log(this.curLevel);

    console.log(
      `Completed in ${performance.now() - before} ms\n` +
        `Triangles count: ${this.curLevel.length}\n` +
        `Current level: ${this.curLevelNum}\n\n`
    );

    return true;
  }

  parallelIterate() {
    if (this.curLevelNum >= this.maxLevel) {
      return false;
    }

    return new Promise((resolve, reject) => {
      const curLevel = this.curLevel;

      const p = new Parallel(curLevel, {
        evalPath: "../eval.js",
      });

      p.require({
        fn: sierpTriangleSplit,
        name: "sierpTriangleSplit",
      });

      const before = performance.now();
      p.map((triangle) => {
        return sierpTriangleSplit().split(triangle);
      }).then(
        (data) => {
          this.prevLevels.push(this.curLevel);
          this.curLevel = [].concat(...data);
          this.curLevelNum++;

          console.log(this.curLevel);

          console.log(
            `Completed in ${performance.now() - before} ms\n` +
              `Triangles count: ${this.curLevel.length}\n` +
              `Current level: ${this.curLevelNum}\n\n`
          );

          resolve(true);
        },
        (error) => {
          reject(error);
        }
      );
    });
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

  goBack() {
    if (this.curLevelNum === 1) {
      return;
    }

    this.curLevel = this.prevLevels[this.prevLevels.length - 1];
    this.curLevelNum--;
    this.prevLevels.splice(this.prevLevels.length - 1);

    console.log(
      "Went back" +
        `Triangles count: ${this.curLevel.length}\n` +
        `Current level: ${this.curLevelNum}\n\n`
    );
  }
}
