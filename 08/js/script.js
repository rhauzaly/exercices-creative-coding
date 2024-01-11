var a1;
var a2;
var centerX;
var centerY;
var width = 1000;
var height = 1000;
var context;

var monCercle;

function createCanvas(w, h) {
  var canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  context = canvas.getContext("2d");
  document.body.appendChild(canvas);
}

function draw() {
  // console.log("draw");
  context.clearRect(0, 0, width, height);

  monCercle.draw();
  requestAnimationFrame(draw);
}

function setup() {
  console.log("setup");
  createCanvas(width, height);
  monCercle = new Circle(500, 500, 200, context);
  document.addEventListener("click", mousePressed);
  draw();
}

function mousePressed(e) {
  console.log("mousePressed", e);
  // monCercle.changeColor();
  monCercle.definirDestination(e.x, e.y);
  monCercle.definirRayonAleatoire();
  monCercle.toggleShape();
  monCercle.loucher();
}

window.onload = function () {
  console.log("on est pret");
  setup();
};
