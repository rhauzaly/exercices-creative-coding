var images = {
  orange: new Image(),
  rouge: new Image(),
  vert: new Image(),
  bleu1: new Image(),
  bleu2: new Image(),
  jaune: new Image(),
};
let imageChoisie;
// largeur totale de l'écran
var width = window.innerWidth;
// hauteur totale de l'écran
var height = window.innerHeight;
// contexte 2D
var context;
// image fixed
var image = null;
// largeur et hauteur par default de l'image ou de la video
var largeur = window.innerWidth;
var hauteur = window.innerHeight;
// tableau pour stocker la grille de cercles
var grille = [];
// variable pour stocker les pixels de l'image video
var video = null;
// une variable pour définir si on utilise la webcam ou l'image fixe
var webcam = false;
var data = null;

let midiCurseur;

// fonction pour créer un canvas
function createCanvas(w, h) {
  var canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  context = canvas.getContext("2d");
  document.body.appendChild(canvas);
}

function setup() {
  console.log("setup");
  createCanvas(width, height);
  // on active la gestion de la souris
  document.addEventListener("mousedown", mousePressed);

  // pour l'exemple avec la webcam , on initialise la caméra
  if (webcam) {
    initialiserCamera();
  } else {
    // pour l'exemple avec l'image fixe
    image = new Image();
    // on attend que l'image soit chargée avant de l'afficher
    image.onload = () => {
      // on prépare une variable pour stocker les pixels
      let pixels = null;
      // on dessine l'image dans le contexte
      // attention si on veut l'image static, il faut remplacer video par image
      context.drawImage(image, 0, 0, largeur, hauteur);

      // on récupère les pixels de l'image
      pixels = context.getImageData(0, 0, largeur, hauteur);
      data = pixels.data;
      draw();
    };
    // on définit la source de l'image
    image.src = "image/cheval2.jpeg";
    
    images.orange.src = "./image/rhino.jpeg";
    images.rouge.src = "./image/condor.jpeg";
    images.vert.src = "./image/dauphin2.jpeg";
    images.bleu1.src = "./image/lynx.jpeg";
    images.bleu2.src = "./image/kakapo.jpeg";
    images.jaune.src = "./image/tigre.jpg";

    console.log(image);
  }
  //on créé une grille de cercles
  // pour une grille de 1000x1000
  for (let j = 0; j < hauteur; j += 8) {
    for (let i = 0; i < largeur; i += 8) {
      let circle = new Circle(i, j, 1.5, context, "white");
      // on affecte un angle incrémenteal à chaque cercle
      circle.angle = i * 0.2;
      // on stock le cercle dans le tableau
      grille.push(circle);
    }
  }

  const midi = new MidiConnection();
  midi.addEventListener("midi", control);

  midiCurseur = new Circle(100, 100, 15, context, "white", 1);

}

function control(e) {
  if (e[3] === 1) {
    // Modifier la position x du cercle en fonction de la commande MIDI
    midiCurseur.x = e[4] * (largeur / 127); //
  }
  if (e[3] === 2) {
    // Modifier la position y du cercle en fonction de la commande MIDI
    midiCurseur.y = e[4] * (hauteur / 127); //
  }

  const couleurs = detectPixels(
    Math.round(midiCurseur.x),
    Math.round(midiCurseur.y)
  );

  midiCurseur.color = `rgb(${couleurs[0]},${couleurs[1]},${couleurs[2]})`;
  // console.log(midiCurseur.x,midiCurseur.y);
  console.log(couleurs);

  

  if (couleurs[0] === 194 && couleurs[1] === 39 && couleurs[2] === 45) {
    // Rouge
    imageChoisie = images.rouge;
  } else if (couleurs[0] === 58 && couleurs[1] === 181 && couleurs[2] === 74) {
    // Vert
    imageChoisie = images.vert;
  } else if (couleurs[0] === 41 && couleurs[1] === 170 && couleurs[2] === 225) {
    // Bleu1
    imageChoisie = images.bleu1;
  } else if (couleurs[0] === 46 && couleurs[1] === 49 && couleurs[2] === 146) {
    // Bleu2
    imageChoisie = images.bleu2;
  } else if (couleurs[0] === 241 && couleurs[1] === 90 && couleurs[2] === 37) {
    // orange
    imageChoisie = images.orange;
  } else if (couleurs[0] === 251 && couleurs[1] === 176 && couleurs[2] === 59) {
    // jaune
    imageChoisie = images.jaune;
  }else if (couleurs[0] === 255 && couleurs[1] === 255 && couleurs[2] === 255) {
    // blanc
    imageChoisie = null;
  }

  
}

function draw() {
  // on analyse les pixels de l'image
  //detectPixels();
  //on efface tout l'écran en noir

  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);
  // on dessine les cercles
  grille.forEach((circle, i) => {
    const x = circle.x;
    const y = circle.y;
    const couleurs = detectPixels(x, y);
    let intensity =
      0.2126 * couleurs[0] + 0.7152 * couleurs[1] + 0.0722 * couleurs[2];
    // circle.changeRadius(1-intensity/255);
    if (couleurs[0] != 255 && couleurs[1] != 255 && couleurs[2] != 255) {
      circle.changeRadius(1);
    } else {
      circle.changeRadius(0);
    }

    midiCurseur.draw();

    circle.draw();
    // le mouvment de chaque cercle est géré dans la fonction draw de la class Circle
  });

  if (imageChoisie) {
    // Afficher l'image choisie
    context.drawImage(imageChoisie, midiCurseur.x-50, midiCurseur.y-50, largeur/9, hauteur/9);
  }
  requestAnimationFrame(draw);
}

function detectPixels(x, y) {
  // // on prépare une variable pour stocker les pixels
  // let pixels = null;
  // // on dessine l'image dans le contexte
  // // attention si on veut l'image static, il faut remplacer video par image
  // context.drawImage(image, 0, 0, largeur, hauteur);

  // // on récupère les pixels de l'image
  // pixels = context.getImageData(0, 0, largeur, hauteur);

  // // on parcours tous les cercles
  // grille.forEach((circle, i) => {
  //récupérer la couleur du pixel par l'index
  let index = (y * largeur + x) * 4;
  // on récupère les valeurs de rouge, vert et bleu
  let r = data[index];
  let g = data[index + 1];
  let b = data[index + 2];
  // on calcule l'intensité de la couleur
  // let intensity = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return [r, g, b];
  // circle.changeColor(r, g, b);
  // on change le rayon du cercle en fonction de l'intensité (pourcentage de 0 à 1)
  //circle.changeRadius(intensity / 255);
  // });
}

function initialiserCamera() {
  video = document.createElement("video");
  navigator.getMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  navigator.getMedia(
    {
      video: { width: largeur, height: hauteur },
      audio: false,
    },
    (stream) => {
      video.srcObject = stream;
      video.play();
    },
    (error) => {
      console.log(error);
    }
  );
}

function mousePressed(e) {
  //appeler toggleshape sur tous les cercles
  // grille.forEach((circle, i) => {
  //   circle.toggleShape();
  // });
}

window.onload = function () {
  console.log("on est pret");
  setup();
};
