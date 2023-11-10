var width = window.innerWidth;
var height = window.innerHeight;
var context;
var numRows = 6;
var numCols = 6;
var squares = [];

function createCanvas(w, h) {
  var canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  context = canvas.getContext("2d");
  document.body.appendChild(canvas);
}

function draw() {
  context.clearRect(0, 0, width, height);
  for (let i = 0; i < squares.length; i++) {
    var square = squares[i];
    square.draw(context);
  }
  requestAnimationFrame(draw);
}

function setup() {
  console.log("setup");
  createCanvas(width, height);

  document.addEventListener("click", mousePressed);

  var img = new Image();
  img.src = "./image/rosa.png";
  img.onload = function () {
    var squareSize = Math.min(width / numCols, height / numRows);
    for (let j = 0; j < numRows; j++) {
      for (let i = 0; i < numCols; i++) {
        var x = i * squareSize;
        var y = j * squareSize;
        var square = new Square(x, y, squareSize, img);
        squares.push(square);
      }
    }
    draw();
  };
}

function mousePressed(event) {
  console.log("mousePressed");
  console.log("x: ", event.clientX, "y: ", event.clientY);

  for (let i = 0; i < squares.length; i++) {
    var square = squares[i];
    if (
      event.clientX >= square.x &&
      event.clientX <= square.x + square.size &&
      event.clientY >= square.y &&
      event.clientY <= square.y + square.size
    ) {
      square.rotate();
    }
  }
}

window.onload = function () {
  console.log("on est prêt");
  setup();
};
