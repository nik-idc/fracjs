// const p = new Parallel([1, 2, 3]);

// console.log(p);
import { Point } from "./src/shared/point.js";
import { EqTriangle } from "./src/shared/triangle.js";
import { SierpinskiTriangle } from "./src/sierp.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const initialTriangle = new EqTriangle(
  new Point(0, canvas.height),
  canvas.height
);
const st = new SierpinskiTriangle(initialTriangle);
st.draw(context, canvas.width, canvas.height);

const iterateButton = document.getElementById("iterateButton");
iterateButton.addEventListener("click", (ev) => {
  st.iterate();
  st.draw(context, canvas.width, canvas.height);
});
