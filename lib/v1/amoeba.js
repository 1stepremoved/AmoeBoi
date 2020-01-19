class Amoeba {
  constructor({ x, y, mass, momentum, boardWidth, boardHeight }) {
    this.mass = mass || Math.floor((Math.random() * 100000) + 10000);
    this.radius = Math.sqrt(this.mass / (Math.PI));
    this.xpos = x || Math.floor(Math.random() * (boardWidth - this.radius)) + this.radius;
    this.ypos = y || Math.floor(Math.random() * (boardHeight - this.radius)) + this.radius;
    this.momentum = momentum || {x: Math.floor(Math.random() * 1000000) - 500000, y: Math.floor(Math.random() * 1000000) - 500000};
    this.nextMomentum = Object.assign({}, this.momentum);
    this.color = "blue";
  }

  move = (timeCoefficient) => {
    this.momentum = Object.assign({}, this.nextMomentum);
    let xDelta = (this.mass > 0 ? this.momentum['x'] / this.mass : 0);
    let yDelta = (this.mass > 0 ? this.momentum['y'] / this.mass : 0);
    this.xpos += xDelta * timeCoefficient;
    this.ypos += yDelta * timeCoefficient;
  };

  adjustRadius = () => {
    this.radius = Math.sqrt(this.mass / (Math.PI));
  };
}

Amoeba.prototype.momentumDelta = 1;
Amoeba.prototype.massDelta =  1 / 2;
Amoeba.prototype.momentumMax = 10;

export default Amoeba;
