class Circle {
  constructor(x, y, rayon, context) {
    // Propriétés initiales
    this.x = x;
    this.y = y;
    this.origin = { x, y };
    this.target = { x, y };
    this.rayon = rayon;
    this.rayonOrigin = { rayon };
    this.rayonFinal = { rayon };
    this.context = context;

    // Couleurs et transition
    this.currentColor = { r: 255, g: 0, b: 0 }; // Rouge de départ
    this.targetColor = this.generateRandomColor();
    this.colorTransition = 0;

    this.rotation = 0;
    this.frameCount = 0;

    this.speed = 1;
    this.uniteDeTemps = 0;
    this.uniteDeTemps1 = 0;
    this.transitionFrameCount = 0;
    this.maxTransitionFrames = 90;

    // Points pour l'étoile à 12 branches
    this.customShapePoints = this.createStarPoints(rayon);
    this.transitionValue = 0;

    // Transitions
    this.isStar = false;
    this.isLouching = false;
    this.shapeTransition = 0;
    this.transitionSpeed = 0.01;
    this.starFrameCount = 0;
    this.louchingFrameCount = 0;
  }

  createStarPoints(rayon) {
    const points = [];
    const rayonExterieur = rayon;
    const rayonInterieur = rayon / 2;

    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI / 12) * i;
      const r = i % 2 === 0 ? rayonExterieur : rayonInterieur;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      points.push({ x, y });
    }

    return points;
  }

  generateRandomColor() {
    return {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    };
  }

  updateColor() {
    if (this.colorTransition < 1) {
      this.currentColor.r +=
        (this.targetColor.r - this.currentColor.r) * this.colorTransition;
      this.currentColor.g +=
        (this.targetColor.g - this.currentColor.g) * this.colorTransition;
      this.currentColor.b +=
        (this.targetColor.b - this.currentColor.b) * this.colorTransition;
      this.colorTransition += 0.009;
    } else {
      this.targetColor = this.generateRandomColor();
      this.colorTransition = 0;
    }
  }

  changeColor() {
    // Fonction pour déclencher le changement de couleur
    this.targetColor = this.generateRandomColor();
    this.colorTransition = 100;
  }

  isInMe(mouseX, mouseY) {
    const d = this.dist(mouseX, mouseY, this.x, this.y);
    return d < this.rayon;
  }

  dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  definirDestination(x, y) {
    this.target = { x, y };
    this.uniteDeTemps = 0;
  }

  definirRayonAleatoire() {
    this.rayonFinal.rayon = Math.random() * 200 + 50;
    this.uniteDeTemps1 = 0;
  }

  move() {
    const d = this.dist(this.x, this.y, this.target.x, this.target.y);
    if (d < 0.01) {
      this.origin = { x: this.target.x, y: this.target.y };
      return;
    }

    const easing = Easing.bounceOut(this.uniteDeTemps);
    this.uniteDeTemps += 0.01;

    let distX = this.target.x - this.origin.x;
    let distY = this.target.y - this.origin.y;
    this.x = this.origin.x + distX * easing;
    this.y = this.origin.y + distY * easing;
  }

  rapetisser() {
    let differenceRayon2 = this.rayonFinal.rayon - this.rayon;
    if (Math.abs(differenceRayon2) < 0.01) {
      this.rayonOrigin.rayon = this.rayonFinal.rayon;
      return;
    }

    const easing = Easing.elasticOut(this.uniteDeTemps1);
    this.uniteDeTemps1 += 0.01;
    let differenceRayon = this.rayonFinal.rayon - this.rayonOrigin.rayon;
    this.rayon = this.rayonOrigin.rayon + differenceRayon * easing;
  }

  loucher() {
    this.isLouching = true;
    this.louchingFrameCount = 0;
    this.shapeTransition = 0;
  }

  draw() {
    this.updateColor();
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.rotate(this.rotation);

    // Gestion de la transition de l'étoile et du louchement
    if (this.isLouching) {
      // Incrémenter shapeTransition jusqu'à 1 puis le diminuer
      if (this.louchingFrameCount < 90) {
        this.shapeTransition = Math.min(
          this.shapeTransition + this.transitionSpeed,
          1
        );
      } else {
        this.shapeTransition = Math.max(
          this.shapeTransition - this.transitionSpeed,
          0
        );
        if (this.shapeTransition === 0) {
          this.isLouching = false;
        }
      }
      this.louchingFrameCount++;
    }

    // Appliquer la couleur courante
    const { r, g, b } = this.currentColor;
    this.context.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(
      g
    )}, ${Math.floor(b)})`;

    // Dessiner l'étoile ou le cercle
    this.context.fillStyle = this.color;
    this.context.beginPath();
    if (this.shapeTransition > 0) {
      for (let i = 0; i < this.customShapePoints.length; i++) {
        let point = this.customShapePoints[i];
        let circlePoint = {
          x: this.rayon * Math.cos((Math.PI / 12) * i),
          y: this.rayon * Math.sin((Math.PI / 12) * i),
        };
        let x =
          circlePoint.x + (point.x - circlePoint.x) * this.shapeTransition;
        let y =
          circlePoint.y + (point.y - circlePoint.y) * this.shapeTransition;
        if (i === 0) {
          this.context.moveTo(x, y);
        } else {
          this.context.lineTo(x, y);
        }
      }
    } else {
      this.context.arc(0, 0, this.rayon, 0, 2 * Math.PI);
    }
    this.context.closePath();
    this.context.fill();

    this.context.restore();
    this.move();

    this.context.fillStyle = "white";
    this.context.beginPath();
    this.context.arc(this.x - 40, this.y - 10, 30, 30, 2 * Math.PI, true);
    this.context.arc(this.x + 40, this.y - 10, 30, 30, 2 * Math.PI, true);
    this.context.fill();
    this.context.closePath();

    // Ajouter les pupilles avec louchement
    this.context.fillStyle = "black";
    this.context.beginPath();
    let decalagePupille = this.isLouching ? 15 * this.shapeTransition : 0;
    this.context.arc(
      this.x - 40 + decalagePupille,
      this.y - 10,
      20,
      20,
      2 * Math.PI,
      true
    );
    this.context.arc(
      this.x + 40 - decalagePupille,
      this.y - 10,
      20,
      20,
      2 * Math.PI,
      true
    );
    this.context.fill();
    this.context.closePath();
  }

  toggleShape() {
    this.isStar = !this.isStar;
    if (this.isStar) {
      this.starFrameCount = 0;
    }
  }
}
