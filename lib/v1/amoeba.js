import { boundNum } from './util';

class Amoeba {
  constructor(x, y, mass, momentum) {
    this.mass = mass || Math.floor((Math.random() * 100000) + 10000);
    this.radius = Math.sqrt(this.mass / (Math.PI));
    this.xpos = x || Math.floor(Math.random() * (this.boardVars.realBoardWidth - this.radius)) + this.radius;
    this.ypos = y || Math.floor(Math.random() * (this.boardVars.realBoardHeight - this.radius)) + this.radius;
    this.momentum = momentum || {x: Math.floor(Math.random() * 1000000) - 500000, y: Math.floor(Math.random() * 1000000) - 500000};
    this.nextMomentum = Object.assign({}, this.momentum);
    this.color = "blue";
  }

  move = () => {
    this.momentum = Object.assign({}, this.nextMomentum);
    let xDelta = (this.mass > 0 ? this.momentum['x'] / this.mass : 0);
    let yDelta = (this.mass > 0 ? this.momentum['y'] / this.mass : 0);
    this.xpos += xDelta * this.timeVars.timeCoefficient;
    this.ypos += yDelta * this.timeVars.timeCoefficient;
  };

  adjustRadius = () => {
    this.radius = Math.sqrt(this.mass / (Math.PI));
  };

  relativePos = () => {
    let relativeX = (((this.xpos - this.boardVars.boardFocus['x']) / (this.boardVars.boardWidth / 2)) * 500)
                       + (window.innerWidth / 2) + this.mouseVars.mouseOffset['x'];
    let relativeY = (((this.ypos - this.boardVars.boardFocus['y']) / (this.boardVars.boardHeight/ 2)) * 500)
                       + (window.innerHeight / 2) + this.mouseVars.mouseOffset['y'];
    return {x: relativeX, y: relativeY};
  };

  colorize = (ctx, relativeX, relativeY, relativeRadius) => {
    if (this.mass <= 0) {
      return;
    }

    let gradient = ctx.createRadialGradient(relativeX, relativeY,relativeRadius, relativeX, relativeY, 0);
    if (this.mass < this.boardVars.baseMass) {
      gradient.addColorStop(0, `rgb(${20}, ${20}, ${255})`);
      gradient.addColorStop(boundNum(1 - (this.mass / this.boardVars.baseMass),0, 1) , `rgb(${50}, ${20}, ${200})`);
      gradient.addColorStop(1 , `rgb(${255}, ${20}, ${20})`);
    } else {
      gradient.addColorStop(0, `rgb(${255}, ${20}, ${20})`);
      gradient.addColorStop(boundNum(1 -(this.boardVars.baseMass / this.mass), 0, 1) , `rgb(${200}, ${20}, ${50})` );
      gradient.addColorStop(1 , `rgb(${20}, ${20}, ${255})`);
    }
    return gradient;
  };

  draw = (ctx) => {
    if (this.mass <= 0) {
      return;
    }
    if (isNaN(this.xpos) || isNaN(this.ypos) ){
      // DEBUG: somehow these get turned into NaN when absorbed completely by another amoeba
      this.mass = 0;
      return;
    }

    this.adjustRadius();

    let relativeCoors = this.relativePos();

    let relativeRadius = this.radius / this.boardVars.realBoardWidth * 1000 * this.boardVars.currentZoom;

    //radius cannot be kept proportional to window.innerWidth, it will throw off their size on screen

    let gradient = this.colorize(ctx, relativeCoors['x'], relativeCoors['y'],relativeRadius);

    ctx.beginPath();
    ctx.arc(relativeCoors['x'], relativeCoors['y'], relativeRadius, 0, Math.PI * 2);
    ctx.fillStyle=gradient;
    ctx.fill();
  };
}

Amoeba.prototype.momentumDelta = 1;
Amoeba.prototype.massDelta =  1 / 2;
Amoeba.prototype.momentumMax = 10;

export default Amoeba;
