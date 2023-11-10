// la définition de la classe Circle c'est comme définir une function mais sans les parenthèses
// la fonction par défaul est le constructor
// on peut passer des paramètres au constructor
// dans une class on n'écrit pas "function" pour TOUTES les fonctions
// une variable globale de class s'écrit avec "this."
class Square {
  constructor(x, y, size, image) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.rotation = 0;
    this.color = "transparent";
    this.image = image; 
  }

  draw(context) {
    context.save();
    context.translate(this.x + this.size / 2, this.y + this.size / 2);
    context.rotate(this.rotation);
    context.fillStyle = this.color;
    context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    context.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
    context.restore();
  }

  rotate() {
    this.rotation += Math.PI / 2;
  }
}