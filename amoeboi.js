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
    let distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2) )
    // debugger
  }

}

export default Amoeboi;
