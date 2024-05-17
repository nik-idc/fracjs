export function kochSplit() {
  const Point = (x, y) => {
    return {
      x: x,
      y: y,
    };
  };

  const Line = (p1, p2, out) => {
    const width = (p1, p2) => {
      const left = Math.max(p1.x, p2.x);
      const right = Math.min(p1.x, p2.x);

      return left - right;
    };

    const height = (p1, p2) => {
      const top = Math.max(p1.y, p2.y);
      const bottom = Math.min(p1.y, p2.y);

      return top - bottom;
    };

    return {
      p1: p1,
      p2: p2,
      out: out,
      width: () => {
        return width(p1, p2);
      },
      height: () => {
        return height(p1, p2);
      },
      size: () => {
        const w = width(p1, p2);
        const h = height(p1, p2);
        const size = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));

        console.log(w, "w");
        console.log(h, "h");
        console.log(size, "size");

        return size;
      },
    };
  };

  function split(line) {
    console.log(line);
    const left = Math.min(line.p1.x, line.p2.x);
    const right = Math.max(line.p1.x, line.p2.x);
    const y = line.p1.y;

    const newSize = line.size() / 3;
    const height = (newSize * Math.sqrt(3)) / 2;

    const p11 = Point(left, y);
    const p12 = Point(left + newSize, y);
    const line1 = Line(p11, p12);

    const p21 = p12;
    const p22 = Point(p21.x + newSize / 2, p21.y + height);
    const line2 = Line(p21, p22);

    const p31 = p22;
    const p32 = Point(p31.x + newSize / 2, p31.y - height);
    const line3 = Line(p31, p32);

    const p41 = p32;
    const p42 = Point(p41.x + newSize, p41.y);
    const line4 = Line(p41, p42);

    return [line1, line2, line3, line4];
  }

  return { Point, Line, split };
}

export class KochSnowflake {
  constructor(initLines) {
    this.prevLevels = [];
    this.curLevel = initLines;
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
    for (const line of prevLevel) {
      this.curLevel.push(...kochSplit().split(line));
    }

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
        fn: kochSplit,
        name: "kochSplit",
      });

      const before = performance.now();
      p.map((line) => {
        return kochSplit().split(line);
      }).then(
        (data) => {
          this.prevLevels.push(this.curLevel);
          this.curLevel = [].concat(...data);
          this.curLevelNum++;

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

    console.log(this.curLevel);
    for (const line of this.curLevel) {
      context.fillStyle = "rgb(255 0 0)";
      context.beginPath();
      context.moveTo(line.p1.x, line.p1.y);
      context.lineTo(line.p2.x, line.p2.y);
      context.stroke();
    }
  }
}
