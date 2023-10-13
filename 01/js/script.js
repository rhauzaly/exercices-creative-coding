var context;
var backgroundColor;

function rect(x, y, w, h) {
  context.beginPath();
  context.rect(x, y, w, h);
  context.fill();
  context.closePath();
}

function createCanvas(width, height) {
  var canvas = document.createElement("canvas");
  context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
}
function setup() {
  console.log("setup");
  createCanvas(1200, 800);
  backgroundColor = "white";
  draw();
}

function draw() {
  context.clearRect(0, 0, 800, 800);
  for (i = 0; i < 100; i++) {
    for (j = 0; j < 100; j++) {
      context.fillStyle = getRandomColor();
      context.lineWidth = 5;
      context.strokeStyle = "white";

      rect(i * 50, j * 20, 50, 20);
      context.strokeRect(i * 50, j * 20, 50, 20);
    }
  }
  //noLoop();
  requestAnimationFrame(draw);
}
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

window.onload = function () {
  console.log("on est pret");
  setup();
  draw();
};
