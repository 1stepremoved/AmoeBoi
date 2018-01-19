import {boundNum} from './util';

class Amoeba {
  constructor(ctx, x, y, mass, momentum) {
    this.ctx = ctx;
    this.mass = mass || Math.floor((Math.random() * 100000) + 10000);
    this.radius = Math.sqrt(this.mass / (Math.PI));
    this.xpos = x || Math.floor(Math.random() * (window.realBoardWidth - this.radius)) + this.radius;
    this.ypos = y || Math.floor(Math.random() * (window.realBoardHeight - this.radius)) + this.radius;
    this.momentum = momentum || {x: Math.floor(Math.random() * 100000) - 50000, y: Math.floor(Math.random() * 100000) - 50000};
    this.nextMomentum = Object.assign({}, this.momentum);
    this.draw = this.draw.bind(this);
    this.collision = this.collision.bind(this);
    this.adjustRadius = this.adjustRadius.bind(this);
    this.colorize = this.colorize.bind(this);
    this.relativePos = this.relativePos.bind(this);
    this.color = "blue";
  }

  move() {
    this.momentum = Object.assign({}, this.nextMomentum);
    let xDelta = this.momentum['x'] / this.mass;
    let yDelta = this.momentum['y'] / this.mass;
    xDelta = (xDelta > window.momentumMax) ? Math.abs(xDelta) / xDelta * window.momentumMax : xDelta;
    yDelta = (yDelta > window.momentumMax) ? Math.abs(yDelta) / yDelta * window.momentumMax : yDelta;
    this.xpos += xDelta * window.timeCoefficient;
    this.ypos += yDelta * window.timeCoefficient;
  }

  adjustRadius() {
    this.radius = Math.sqrt(this.mass / (Math.PI));
  }

  aabbCheck(amoeba) {
    if (amoeba.xpos + amoeba.radius + this.radius > this.xpos
     && amoeba.xpos < this.xpos + this.radius + amoeba.radius
     && amoeba.ypos + amoeba.radius + this.radius > this.ypos
     && amoeba.ypos < this.ypos + this.radius + amoeba.radius) {
      this.collision(amoeba);
     }
}

  collision(amoeba) {
    let distance = this.radius + amoeba.radius;
    let currentDistance = Math.sqrt(
      Math.pow(this.xpos - amoeba.xpos ,2)  + Math.pow(this.ypos - amoeba.ypos ,2)
    );
    if (distance > currentDistance){

      this.nextMomentum['x'] += boundNum(amoeba.momentum['x']
        * amoeba.mass * (currentDistance / distance) * window.timeCoefficient, -50, 50);
      amoeba.nextMomentum['x'] = amoeba.nextMomentum['x']
        * boundNum(amoeba.mass / this.mass, .99, 1);
      this.nextMomentum['y'] += boundNum(amoeba.momentum['y']
        * amoeba.mass * (currentDistance / distance) * window.timeCoefficient, -50, 50);
      amoeba.nextMomentum['y'] = amoeba.nextMomentum['y']
        * boundNum(amoeba.mass / this.mass, .99, 1);

      if (this.mass <= amoeba.mass) {
        if ((currentDistance - amoeba.radius) / this.radius < 0 || this.mass < 100) {
          amoeba.mass += this.mass;
          this.mass = 0;
          amoeba.nextMomentum['x'] += this.nextMomentum['x'];
          amoeba.nextMomentum['y'] += this.nextMomentum['y'];
          return;
        }

        let bubble = window.massDelta
            * boundNum( (this.radius - (currentDistance - amoeba.radius)) / this.radius, .1, 1)
            * window.timeCoefficient;

        this.mass -= bubble;
        amoeba.mass += bubble;
      }
    }
  }



  wallCollision() {
    if (this.xpos + this.radius >= window.realBoardWidth) {
      this.nextMomentum['x'] = -1 * this.momentum['x'];
      this.xpos = window.realBoardWidth - this.radius - 1;
    } else if (this.xpos - this.radius <= 0) {
      this.nextMomentum['x'] = -1 * this.momentum['x'];
      this.xpos = 0 + this.radius + 1;
    }
    if (this.ypos + this.radius >= window.realBoardHeight) {
      this.nextMomentum['y'] = -1 * this.momentum['y'];
      this.ypos = window.realBoardHeight - this.radius - 1;
    } else if (this.ypos - this.radius <= 0) {
      this.nextMomentum['y'] = -1 * this.momentum['y'];
      this.ypos = 0 + this.radius + 1;
    }
  }

  colorize(relativeX, relativeY, relativeRadius) {
    let gradient = this.ctx.createRadialGradient(relativeX, relativeY,relativeRadius, relativeX, relativeY, 0);
    if (this.mass < window.baseMass) {
      gradient.addColorStop(0, `rgb(${20}, ${20}, ${255})`);
      gradient.addColorStop(1 - (this.mass / window.baseMass) , `rgb(${50}, ${20}, ${200})`);
      gradient.addColorStop(1 , `rgb(${255}, ${20}, ${20})`);
    } else {
      gradient.addColorStop(0, `rgb(${255}, ${20}, ${20})`);
      gradient.addColorStop(1 -(window.baseMass / this.mass) , `rgb(${200}, ${20}, ${50})` );
      gradient.addColorStop(1 , `rgb(${20}, ${20}, ${255})`);
    }
    return gradient;
  }

  relativePos() {
    let relativeX = (((this.xpos - window.boardFocus['x']) / (window.boardWidth / 2)) * 500) + (window.innerWidth / 2);
    let relativeY = (((this.ypos - window.boardFocus['y']) / (window.boardHeight/ 2)) * 500) + (window.innerHeight / 2);
    return {x: relativeX, y: relativeY}
  }

  draw() {
    if (this.mass <= 0) {
      return;
    }
    this.adjustRadius();

    let relativeCoors = this.relativePos();

    let relativeRadius = this.radius / window.realBoardWidth * 1000 * window.currentZoom;
    //radius cannot be kept proportional to window.innerWidth, it will throw of there size on screen

    let gradient = this.colorize(relativeCoors['x'], relativeCoors['y'],relativeRadius);

    this.ctx.beginPath();
    this.ctx.arc(relativeCoors['x'], relativeCoors['y'], relativeRadius, 0, Math.PI * 2);
    this.ctx.fillStyle=gradient;
    this.ctx.fill();
  }
}

export default Amoeba;
