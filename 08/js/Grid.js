import Circle from "./Circle.js";

export default class Grid {
  constructor(ctx) {
    console.log("Grid.js");
    // this.canvas = document.createElement("canvas");
    // this.canvas.width = window.innerWidth;
    // this.canvas.height = window.innerHeight;
    // document.body.appendChild(this.canvas);
    this.ctx = ctx; //this.canvas.getContext("2d");
    this.circle = new Circle(
      window.innerWidth / 2,
      window.innerHeight / 2,
      100,
      this.ctx
    );

    // this.draw()
  }

  draw(finger, landmarks) {
    // dessiner une grille de 4 x 4
    const largeur = window.innerWidth / 4;
    const hauteur = window.innerHeight / 4;

    let indexDoigt = -1;
    if (finger.x === null || finger.y === null) {
      indexDoigt = -1;
    } else {
      const x = Math.floor((finger.x * window.innerWidth) / largeur);
      const y = Math.floor((finger.y * window.innerHeight) / hauteur);
      indexDoigt = y * 4 + x;
    }

    if (landmarks.length > 0) {
      // if distance between index tip and thumb tip is less than 10px then console.log("ok")
      const indexTip = landmarks[0][8];
      const thumbTip = landmarks[0][4];
      const distance = dist(indexTip.x, indexTip.y, thumbTip.x, thumbTip.y);
      if (distance < 0.05) {
        this.ctx.beginPath();
        const newFinger = fingerToScreen(landmarks[0][4]);
        this.ctx.rect(newFinger.x - 10, newFinger.y - 100, 100, 100);
        this.ctx.fillStyle = "rgba(255, 0, 0)";
        this.ctx.fill();
        //this.ctx.stroke();
        this.ctx.closePath();
        this.circle.definirDestination(newFinger.x, newFinger.y);
        this.circle.definirRayonAleatoire();
        this.circle.toggleShape();
        this.circle.loucher();
      }
      this.circle.draw();
    }

    this.ctx.strokeStyle = "red";
    let index = 0;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        this.ctx.beginPath();
        // this.ctx.rect(x * largeur, y * hauteur, largeur, hauteur);
        //this.ctx.stroke();
        this.ctx.closePath();
        if (index === indexDoigt) {
          this.ctx.fillStyle = "rgba(255, 0, 0, 0)";
          this.ctx.fill();
        }

        // this.ctx.font = "30px Arial";
        // this.ctx.fillStyle = "red";
        // this.ctx.fillText(index, x * largeur + 10, y * hauteur + 30);

        index++;
      }
    }
  }
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function fingerToScreen(finger) {
  const x = finger.x * window.innerWidth;
  const y = finger.y * window.innerHeight;
  return { x: x, y: y };
}
