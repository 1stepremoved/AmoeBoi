import Amoeba from './amoeba';

class Amoeboi extends Amoeba {
  constructor(ctx, x, y, mass, momentum) {
    super(ctx, x, y, mass, momentum);
  }

  colorize(relativeX, relativeY, relativeRadius) {
    if (this.mass <= 0) {
      return;
    }
    let gradient = this.ctx.createRadialGradient(relativeX, relativeY,relativeRadius, relativeX, relativeY, 0);
    gradient.addColorStop(0, `rgb(${0}, ${255}, ${0})`);
    gradient.addColorStop(1, `rgb(${0}, ${150}, ${0})`);
    return gradient;
  }

  propel(e, amoebas) {
    let diffX = e.pageX - (window.innerWidth / 2);
    let diffY = e.pageY - (window.innerHeight / 2);
    let angle = Math.atan2(diffY, diffX);
    let dirX = Math.cos(angle);
    let dirY = Math.sin(angle);


    let mass = this.mass * .02;
    this.mass -= mass;
    let radius = Math.sqrt(mass / (Math.PI));
    let xpos = this.xpos + (dirX * this.radius) + ((dirX > 0 ) ? radius : -1 * radius);
    let ypos = this.ypos + (dirY * this.radius) + ((dirY > 0 ) ? radius : -1 * radius);
    let momentum = {x: mass * 50 * dirX, y: mass * 50 * dirY};
    amoebas.push(new Amoeba(this.ctx, xpos, ypos, mass, momentum));
    this.nextMomentum['x'] += momentum['x'] * -1 * 10;
    this.nextMomentum['y'] += momentum['y'] * -1 * 10;
    // debugger
    let distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2) );
    // debugger
  }

}

export default Amoeboi;
