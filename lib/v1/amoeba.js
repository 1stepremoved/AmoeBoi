import { boundNum } from './util';

class Amoeba {
  constructor({ x, y, mass, momentum, boardVars }) {
    this.mass = mass || Math.floor((Math.random() * 100000) + 10000);
    this.radius = Math.sqrt(this.mass / (Math.PI));
    this.xpos = x || Math.floor(Math.random() * (boardVars.realBoardWidth - this.radius)) + this.radius;
    this.ypos = y || Math.floor(Math.random() * (boardVars.realBoardHeight - this.radius)) + this.radius;
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

  relativePos = (boardVars, mouseVars) => {
    let relativeX = (((this.xpos - boardVars.boardFocus['x']) / (boardVars.boardWidth / 2)) * 500)
                       + (window.innerWidth / 2) + mouseVars.mouseOffset['x'];
    let relativeY = (((this.ypos - boardVars.boardFocus['y']) / (boardVars.boardHeight/ 2)) * 500)
                       + (window.innerHeight / 2) + mouseVars.mouseOffset['y'];
    return {x: relativeX, y: relativeY};
  };

  colorize = (ctx, relativeX, relativeY, relativeRadius, baseMass) => {
    if (this.mass <= 0) {
      return;
    }

    let gradient = ctx.createRadialGradient(relativeX, relativeY, relativeRadius, relativeX, relativeY, 0);
    if (this.mass < baseMass) {
      gradient.addColorStop(0, `rgb(${20}, ${20}, ${255})`);
      gradient.addColorStop(boundNum(1 - (this.mass / baseMass),0, 1) , `rgb(${50}, ${20}, ${200})`);
      gradient.addColorStop(1 , `rgb(${255}, ${20}, ${20})`);
    } else {
      gradient.addColorStop(0, `rgb(${255}, ${20}, ${20})`);
      gradient.addColorStop(boundNum(1 -(baseMass / this.mass), 0, 1) , `rgb(${200}, ${20}, ${50})` );
      gradient.addColorStop(1 , `rgb(${20}, ${20}, ${255})`);
    }
    return gradient;
  };

  draw = (ctx, boardVars, mouseVars) => {
    if (this.mass <= 0) {
      return;
    }
    if (isNaN(this.xpos) || isNaN(this.ypos) ){
      // DEBUG: somehow these get turned into NaN when absorbed completely by another amoeba
      this.mass = 0;
      return;
    }

    this.adjustRadius();

    let relativeCoors = this.relativePos(boardVars, mouseVars);

    let relativeRadius = this.radius / boardVars.realBoardWidth * 1000 * boardVars.currentZoom;

    //radius cannot be kept proportional to window.innerWidth, it will throw off their size on screen

    let gradient = this.colorize(ctx, relativeCoors.x, relativeCoors.y, relativeRadius, boardVars.baseMass);

    ctx.beginPath();
    ctx.arc(relativeCoors.x, relativeCoors.y, relativeRadius, 0, Math.PI * 2);
    ctx.fillStyle=gradient;
    ctx.fill();
  };
}

Amoeba.prototype.momentumDelta = 1;
Amoeba.prototype.massDelta =  1 / 2;
Amoeba.prototype.momentumMax = 10;

export default Amoeba;
