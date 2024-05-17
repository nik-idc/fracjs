import { SierpinskiTriangle, sierpTriangleSplit } from "./src/sierp.js";
import { KochSnowflake, kochSplit } from "./src/koch.js";

const fractalSelect = document.getElementById("fractalSelect");
const stOption = document.getElementById("stOption");
const ksOption = document.getElementById("ksOption");
const linearIterateButton = document.getElementById("linearIterateButton");
const parallelIterateButton = document.getElementById("parallelIterateButton");
const goBackButton = document.getElementById("goBackButton");
const canvas = document.getElementById("canvas");

const context = canvas.getContext("2d");

let fractalType = localStorage.getItem("lastType");
let sierpinskiTriangle;
let kochSnowflake;

function sierpinskiInit() {
  const { Point, Triangle } = sierpTriangleSplit();
  const initialTriangle = Triangle(Point(0, canvas.height), canvas.height);
  sierpinskiTriangle = new SierpinskiTriangle(initialTriangle);
  sierpinskiTriangle.draw(context, canvas.width, canvas.height);
}

function kochInit() {
  const { Line, Point } = kochSplit();
  const size = canvas.height;
  const initLines = [Line(Point(0, size / 2), Point(size, size / 2), true)];

  kochSnowflake = new KochSnowflake(initLines);
  kochSnowflake.draw(context, canvas.width, canvas.height);
}

function init(type) {
  console.log(type);
  fractalType = type === null ? "sierspinskiTriangle" : type;
  if (fractalType === "sierspinskiTriangle") {
    stOption.setAttribute("selected", "selected");
    ksOption.removeAttribute("selected");

    sierpinskiInit();
  } else if (fractalType === "kochSnowflake") {
    ksOption.setAttribute("selected", "selected");
    stOption.removeAttribute("selected");

    kochInit();
  }
}

fractalSelect.addEventListener("change", (ev) => {
  localStorage.setItem("lastType", ev.target.value);
  init(ev.target.value);
});

linearIterateButton.addEventListener("click", (ev) => {
  if (fractalType === "sierspinskiTriangle") {
    const result = sierpinskiTriangle.iterate();
    if (!result) {
      alert("Maximum depth reached");
      return;
    }

    sierpinskiTriangle.draw(context, canvas.width, canvas.height);
  } else if (fractalType === "kochSnowflake") {
    const result = kochSnowflake.iterate();
    if (!result) {
      alert("Maximum depth reached");
      return;
    }

    kochSnowflake.draw(context, canvas.width, canvas.height);
  }
});

parallelIterateButton.addEventListener("click", (ev) => {
  linearIterateButton.disabled = true;
  parallelIterateButton.disabled = true;
  goBackButton.disabled = true;

  if (fractalType === "sierspinskiTriangle") {
    sierpinskiTriangle
      .parallelIterate(Parallel)
      .then((result) => {
        if (!result) {
          alert("Maximum depth reached");
          return;
        }

        sierpinskiTriangle.draw(context, canvas.width, canvas.height);

        linearIterateButton.disabled = false;
        parallelIterateButton.disabled = false;
        goBackButton.disabled = false;
      })
      .catch((error) => {
        console.log(error);

        linearIterateButton.disabled = false;
        parallelIterateButton.disabled = false;
        goBackButton.disabled = false;
      });
  } else if (fractalType === "kochSnowflake") {
    kochSnowflake
      .parallelIterate(Parallel)
      .then((result) => {
        if (!result) {
          alert("Maximum depth reached");
          return;
        }

        kochSnowflake.draw(context, canvas.width, canvas.height);
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

goBackButton.addEventListener("click", (ev) => {
  if (fractalType === "sierspinskiTriangle") {
    sierpinskiTriangle.goBack();

    sierpinskiTriangle.draw(context, canvas.width, canvas.height);
  } else if (fractalType === "kochSnowflake") {
  }
});

init(fractalType);
