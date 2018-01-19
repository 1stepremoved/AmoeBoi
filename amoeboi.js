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


}

export default Amoeboi;
