import Amoeba from './amoeba';
import { boundNum } from './util';

class Amoeboi extends Amoeba {
  propel = (e, amoebas, boardVars, mouseVars) => {
    if (this.mass <= 0) {
      return;
    }
    let diffX = mouseVars.mousePos.x - (window.innerWidth / 2);
    let diffY = mouseVars.mousePos.y - (window.innerHeight / 2);
    let angle = Math.atan2(diffY, diffX);
    let dirX = Math.cos(angle);
    let dirY = Math.sin(angle);

    let mass = this.mass * boundNum(((Date.now() - mouseVars.mouseDownTime) / 30000), .01, .1);
    this.mass -= mass;
    let radius = Math.sqrt(mass / (Math.PI));
    let xpos = this.xpos + (dirX * this.radius) + ((dirX > 0 ) ? radius : -1 * radius);
    let ypos = this.ypos + (dirY * this.radius) + ((dirY > 0 ) ? radius : -1 * radius);
    let momentum = {x: mass * 50 * dirX * 2, y: mass * 50 * dirY * 2};
    amoebas.push(new Amoeba({
      x: xpos,
      y: ypos,
      mass,
      momentum,
      realBoardWidth: boardVars.realBoardWidth,
      realBoardHeight: boardVars.realBoardHeight,
    }));
    this.nextMomentum.x += momentum.x * -1 * 3;
    this.nextMomentum.y += momentum.y * -1 * 3;
  };

}

export default Amoeboi;
