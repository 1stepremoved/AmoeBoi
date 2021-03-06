import { boundNum } from './util';

class Amoeba {
  constructor(ctx, x, y, mass, momentum) {
    this.ctx = ctx;
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

  aabbCheck = (amoeba) => {
    if (amoeba.xpos + amoeba.radius + this.radius > this.xpos
     && amoeba.xpos < this.xpos + this.radius + amoeba.radius
     && amoeba.ypos + amoeba.radius + this.radius > this.ypos
     && amoeba.ypos < this.ypos + this.radius + amoeba.radius) {
      this.collision(amoeba);
     }
  };

  collision = (amoeba) => {
    let distance = this.radius + amoeba.radius;
    let currentDistance = Math.sqrt(
      Math.pow(this.xpos - amoeba.xpos ,2)  + Math.pow(this.ypos - amoeba.ypos ,2)
    );
    if (distance > currentDistance){

      this.nextMomentum['x'] += boundNum(amoeba.momentum['x']
        * amoeba.mass * (currentDistance / distance) * this.timeVars.timeCoefficient, -50, 50);
      amoeba.nextMomentum['x'] = amoeba.nextMomentum['x']
        * boundNum(amoeba.mass / this.mass, .99, 1);

      amoeba.nextMomentum['x'] += boundNum(this.momentum['x']
        * this.mass * (currentDistance / distance) * this.timeVars.timeCoefficient, -50, 50);
      this.nextMomentum['x'] = this.nextMomentum['x']
        * boundNum(this.mass / amoeba.mass, .99, 1);

      this.nextMomentum['y'] += boundNum(amoeba.momentum['y']
        * amoeba.mass * (currentDistance / distance) * this.timeVars.timeCoefficient, -50, 50);
      amoeba.nextMomentum['y'] = amoeba.nextMomentum['y']
        * boundNum(amoeba.mass / this.mass, .99, 1);

      amoeba.nextMomentum['y'] += boundNum(this.momentum['y']
        * this.mass * (currentDistance / distance) * this.timeVars.timeCoefficient, -50, 50);
      this.nextMomentum['y'] = this.nextMomentum['y']
        * boundNum(this.mass / amoeba.mass, .99, 1);

      let amoebae;
      if (this.mass <= amoeba.mass) {
        amoebae = {big: amoeba, small: this};
      } else {
        amoebae = {big: this, small: amoeba};
      }
        if ((currentDistance - amoebae['big'].radius) < 0 || amoebae['small'].mass < 100) {
          amoebae['big'].mass += amoebae['small'].mass;
          amoebae['small'].mass = 0;
          amoebae['big'].nextMomentum['x'] += amoebae['small'].nextMomentum['x'];
          amoebae['big'].nextMomentum['y'] += amoebae['small'].nextMomentum['y'];
          return;
        }

        let bubble = amoebae['small'].massDelta * amoebae['small'].mass
            * boundNum( (amoebae['small'].radius - (currentDistance - amoebae['big'].radius)) / amoebae['small'].radius, .01, .1)
            * boundNum(this.timeVars.timeCoefficient, 0.5, 2);

        amoebae['small'].mass -= bubble;
        amoebae['big'].mass += bubble;
    }
  };

  collidesWith = (amoeba) => {
    let distance = this.radius + amoeba.radius;
    let currentDistance = Math.sqrt(
      Math.pow(this.xpos - amoeba.xpos ,2)  + Math.pow(this.ypos - amoeba.ypos ,2)
    );
    if (distance > currentDistance) {
      return true;
    } else {
      return false;
    }
  };

  wallCollision = () => {
    if (this.xpos + this.radius >= this.boardVars.realBoardWidth) {
      this.nextMomentum['x'] = -1 * this.momentum['x'];
      this.xpos = this.boardVars.realBoardWidth - this.radius - 1;
    } else if (this.xpos - this.radius <= 0) {
      this.nextMomentum['x'] = -1 * this.momentum['x'];
      this.xpos = 0 + this.radius + 1;
    }
    if (this.ypos + this.radius >= this.boardVars.realBoardHeight) {
      this.nextMomentum['y'] = -1 * this.momentum['y'];
      this.ypos = this.boardVars.realBoardHeight - this.radius - 1;
    } else if (this.ypos - this.radius <= 0) {
      this.nextMomentum['y'] = -1 * this.momentum['y'];
      this.ypos = 0 + this.radius + 1;
    }
  }

  colorize = (relativeX, relativeY, relativeRadius) => {
    if (this.mass <= 0) {
      return;
    }

    let gradient = this.ctx.createRadialGradient(relativeX, relativeY,relativeRadius, relativeX, relativeY, 0);
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

  relativePos = () => {
    let relativeX = (((this.xpos - this.boardVars.boardFocus['x']) / (this.boardVars.boardWidth / 2)) * 500)
                       + (window.innerWidth / 2) + this.mouseVars.mouseOffset['x'];
    let relativeY = (((this.ypos - this.boardVars.boardFocus['y']) / (this.boardVars.boardHeight/ 2)) * 500)
                       + (window.innerHeight / 2) + this.mouseVars.mouseOffset['y'];
    return {x: relativeX, y: relativeY};
  };

  draw = () => {
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

    let gradient = this.colorize(relativeCoors['x'], relativeCoors['y'],relativeRadius);

    this.ctx.beginPath();
    this.ctx.arc(relativeCoors['x'], relativeCoors['y'], relativeRadius, 0, Math.PI * 2);
    this.ctx.fillStyle=gradient;
    this.ctx.fill();
  };
}

Amoeba.prototype.momentumDelta = 1;
Amoeba.prototype.massDelta =  1 / 2;
Amoeba.prototype.momentumMax = 10;

export default Amoeba;
