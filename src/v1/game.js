import { boundNum, baseLog, collidesWith, aabbCheck, wallCollision } from './util';
import Amoeba from './amoeba.js';
import Amoeboi from './amoeboi.js';
import QuadTree from './quadtree.js';
import BoardVars from './board-vars';
import TimeVars from './time-vars';
import MouseVars from './mouse-vars';

export const SET_UP_STATUS = 'set-up-status';
export const RESET_STATUS = 'reset-status';
export const NEXT_LEVEL_STATUS = 'next-level-status';
export const HOMEPAGE_STATUS = 'home-page-status';
export const MOVING_TO_INSTRUCTIONS_STATUS = 'moving-to-instructions-status';
export const INSTRUCTIONS_STATUS = 'instructions-status';
export const MOVING_TO_HOMEPAGE_STATUS = 'moving-to-homepage-status';
export const COLORING_LOSE_SCREEN_STATUS = 'coloring-lose-screen-status';
export const FINISHED_COLORING_LOSE_SCREEN_STATUS = 'finished-coloring-lose-screen-status';
export const MOVING_TO_LOSE_SCREEN_STATUS = 'moving-to-lose-screen-status';
export const LOSE_SCREEN_STATUS = 'lose-screen-status';
export const LOSE_SCREEN_TO_HOMEPAGE_STATUS = 'lose-screen-to-homepage-status';
export const PAUSED_STATUS = 'paused-status';
export const COLORING_WIN_SCREEN_STATUS = 'coloring-win-screen-status';
export const FINISHED_COLORING_WIN_SCREEN_STATUS = 'finished-coloring-win-screen-status';
export const MOVING_TO_WIN_SCREEN_STATUS = 'moving-to-win-screen-status';
export const WIN_SCREEN_STATUS = 'win-screen-status';
export const PLAYING_STATUS = 'playing-status';

class Game {
  constructor(realBoardWidth = 20000, realBoardHeight = 20000, audio) {
    this.audio = audio;
    this.muted = false;

    this.setBoardVars(realBoardWidth, realBoardHeight);
    this.setupTime();
    this.setupMouse();

    this.shiftDown = false;
    this.homepageAlpha = 0;
    this.autoscaleTime = true;
  }

  setupMouse = () => {
    this.mouseVars = new MouseVars({
      mouseDownTime: null,
      mouseDownInterval: null,
      mouseOffset: { x: 0, y: 0 },
      mousePos: { x: 0, y: 0 },
    }) ;
  };

  setupTime = () => {
    this.timeVars = new TimeVars({ timeBase: 10, timeCoefficient: 1 });
  };

  determineNextStatus = (status, canvas) => {
    if (status === SET_UP_STATUS) {
      return PLAYING_STATUS;
    } else if (status === RESET_STATUS) {
      return HOMEPAGE_STATUS;
    } else if (status === NEXT_LEVEL_STATUS) {
      return PLAYING_STATUS
    } else if (status === HOMEPAGE_STATUS) {
      return HOMEPAGE_STATUS;
    } else if (status === MOVING_TO_INSTRUCTIONS_STATUS) {
      return canvas.homepageYOffset > -1000 ? MOVING_TO_INSTRUCTIONS_STATUS : INSTRUCTIONS_STATUS;
    } else if (status === INSTRUCTIONS_STATUS) {
      return INSTRUCTIONS_STATUS;
    } else if(status === MOVING_TO_HOMEPAGE_STATUS) {
      return canvas.homepageYOffset < 0 ? MOVING_TO_HOMEPAGE_STATUS : HOMEPAGE_STATUS;
    } else if (status === COLORING_LOSE_SCREEN_STATUS) {
      return this.homepageAlpha < 0.5 ? COLORING_LOSE_SCREEN_STATUS : FINISHED_COLORING_LOSE_SCREEN_STATUS;
    } else if (status === FINISHED_COLORING_LOSE_SCREEN_STATUS) {
      return MOVING_TO_LOSE_SCREEN_STATUS;
    } else if (status === MOVING_TO_LOSE_SCREEN_STATUS) {
      return canvas.homepageYOffset > 1000 ? MOVING_TO_LOSE_SCREEN_STATUS : LOSE_SCREEN_STATUS;
    } else if (status === LOSE_SCREEN_STATUS) {
      return LOSE_SCREEN_STATUS;
    } else if (status === LOSE_SCREEN_TO_HOMEPAGE_STATUS) {
      return canvas.homepageYOffset > 0 ? LOSE_SCREEN_TO_HOMEPAGE_STATUS : HOMEPAGE_STATUS;
    } else if (status === PAUSED_STATUS) {
      return PAUSED_STATUS;
    } else if (status === COLORING_WIN_SCREEN_STATUS) {
      return this.homepageAlpha < 0.5 ? COLORING_WIN_SCREEN_STATUS : FINISHED_COLORING_WIN_SCREEN_STATUS;
    } else if (status === FINISHED_COLORING_WIN_SCREEN_STATUS) {
      return MOVING_TO_WIN_SCREEN_STATUS;
    } else if (status === MOVING_TO_WIN_SCREEN_STATUS) {
      return canvas.homepageYOffset > 1000 ? MOVING_TO_WIN_SCREEN_STATUS : WIN_SCREEN_STATUS;
    } else if (status === WIN_SCREEN_STATUS) {
      return WIN_SCREEN_STATUS;
    } else if (status === PLAYING_STATUS) {
      if (this.amoeboi.mass > 0) {
        return this.checkWin() ? COLORING_WIN_SCREEN_STATUS : PLAYING_STATUS;
      } else {
        return COLORING_LOSE_SCREEN_STATUS;
      }
    }

    return null;
  };

  animate = (status, canvas) => {
    canvas.ctx.clearRect(0,0, innerWidth, innerHeight);
    canvas.drawField(this.boardVars, this.mouseVars, this.quadTree);

    if (status === SET_UP_STATUS) {
      return this.setup(canvas);
    } else if (status === RESET_STATUS) {
      return this.reset();
    } else if (status === NEXT_LEVEL_STATUS) {
      return this.setUpNextLevel(canvas);
    } else if (status === HOMEPAGE_STATUS) {
      return this.animateHomepage(canvas);
    } else if (status === MOVING_TO_INSTRUCTIONS_STATUS) {
      return this.animateMovingToInstructions(canvas);
    } else if (status === INSTRUCTIONS_STATUS) {
      return this.animateInstructions(canvas);
    } else if(status === MOVING_TO_HOMEPAGE_STATUS) {
      return this.animateMovingToHomePage(canvas);
    } else if (status === COLORING_LOSE_SCREEN_STATUS) {
      return this.animateColoringLoseScreen(canvas);
    } else if (status === FINISHED_COLORING_LOSE_SCREEN_STATUS) {
      return this.animateFinishedColoringLoseScreen(canvas);
    } else if (status === MOVING_TO_LOSE_SCREEN_STATUS) {
      return this.animateMovingToLoseScreen(canvas);
    } else if (status === LOSE_SCREEN_STATUS) {
      return this.animateLosescreen(canvas);
    } else if (status === LOSE_SCREEN_TO_HOMEPAGE_STATUS) {
      return this.animateLosescreenToHomePage(canvas);
    } else if (status === PAUSED_STATUS) {
      return this.animatePause(canvas);
    } else if (status === COLORING_WIN_SCREEN_STATUS) {
      return this.animateColoringWinScreen(canvas);
    } else if (status === FINISHED_COLORING_WIN_SCREEN_STATUS) {
      return this.animateFinishedColoringWinScreen(canvas);
    } else if (status === MOVING_TO_WIN_SCREEN_STATUS) {
      return this.animateMovingToWinScreen(canvas);
    } else if (status === WIN_SCREEN_STATUS) {
      return this.animateWinScreen(canvas)
    } else if (status === PLAYING_STATUS) {
      this.moveAmoebas(canvas);

      canvas.drawMargins(this.timeVars);
      canvas.drawMassDisplay(this.amoeboi);
      canvas.drawInstructions(this.muted, this.autoscaleTime);
      if (this.autoscaleTime) {
        let largest = this.amoebas[0];
        this.amoebas.forEach(a => {largest = largest.radius < a.radius ? a : largest;});
        this.timeVars.timeCoefficient = (this.amoeboi.radius / largest.radius) * this.timeVars.timeBase * .75;
      }
      // canvas.drawClock(this.timeVars);
      if (this.amoeboi.mass > 0) {
        this.boardVars.boardFocus = { x: this.amoeboi.xpos, y: this.amoeboi.ypos };
        this.boardVars.baseMass = this.amoeboi.mass;
        if (this.amoeboi.radius / this.boardVars.realBoardWidth * 1000 * this.boardVars.currentZoom > 75) {
          this.boardVars.maxZoom = boundNum(75 / (this.amoeboi.radius / this.boardVars.realBoardWidth * 1000), 1, this.boardVars.absoluteMaxZoom);
          this.boardVars.currentZoom = boundNum(this.boardVars.currentZoom * 0.9999999, this.boardVars.minZoom, this.boardVars.maxZoom);
        }
        if (this.amoeboi.radius / this.boardVars.realBoardWidth * 1000 * this.boardVars.maxZoom < 75) {
          this.boardVars.maxZoom = boundNum(75 / (this.amoeboi.radius / this.boardVars.realBoardWidth * 1000), 1, this.boardVars.absoluteMaxZoom);
        }
      }
    }

    return null;
  };

  setup = canvas => {
    this.setBoardVars(30000,30000); //this will undo any leveling
    this.setUpAmoebas(true);
    canvas.homepageYOffset = 0;
    this.boardVars.currentZoom = 4;
    this.timeVars.timeCoefficient = 0.5;
    this.boardVars.baseMass = this.amoeboi.mass;
    this.boardVars.boardFocus = {x: this.amoeboi.xpos, y: this.amoeboi.ypos};
    this.audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10,this.timeVars.timeCoefficient)))) * 3.5);
  };

  setBoardVars = (realBoardWidth, realBoardHeight) => {
    const maxZoom = parseInt(50 / Math.sqrt(100000 / Math.PI) * realBoardWidth / 1000);  //100000 is the starting mass for amoeboi
    const absoluteMaxZoom = maxZoom;
    const currentZoom = maxZoom;

    this.boardVars = new BoardVars({
      boardSize: realBoardWidth / 30000,
      realBoardWidth,
      realBoardHeight,
      baseMass: 50000,
      maxZoom,
      absoluteMaxZoom,
      minZoom: 0.7,
      currentZoom,
      boardFocus: { x: realBoardWidth / 2, y: realBoardHeight / 2},
    });
  };

  setUpAmoebas = (amoeboi) => {
    this.amoebas = [];
    this.amoeboi = !amoeboi ? null : new Amoeboi({ x: this.boardVars.realBoardWidth / 2,
      y: this.boardVars.realBoardHeight / 2,
      mass: 10000000,
      momentum: {x: 0, y: 0},
      realBoardWidth: this.boardVars.realBoardWidth,
      realBoardHeight: this.boardVars.realBoardHeight,
    });
    this.quadTree = new QuadTree({ x: 0, y: 0, width: this.boardVars.realBoardWidth, height: this.boardVars.realBoardHeight });
    let mass, massFunc;

    massFunc = () => {
      mass = Math.pow(this.boardVars.realBoardHeight / 30 * Math.PI,2);
      return Math.floor((Math.random() * mass * 4) + mass);
    };
    this.addAmoebas(parseInt(2 * this.boardVars.boardSize), massFunc, 1000000);

    massFunc = () => Math.floor((Math.random() * 4000000 * Math.pow(this.boardVars.boardSize,2)) + (1000000 * Math.pow(this.boardVars.boardSize, 2)));
    this.addAmoebas(parseInt(20 * this.boardVars.boardSize), massFunc, 1000000);

    massFunc = () => Math.floor((Math.random() * 400000) + 100000);
    this.addAmoebas(parseInt(700 * this.boardVars.boardSize), massFunc, 1000000);

    massFunc = () => Math.floor((Math.random() * 400000) + 10000);
    this.addAmoebas(parseInt(50 * this.boardVars.boardSize), massFunc, 1000000);

    massFunc = () => Math.floor((Math.random() * 10000) + 10000);
    this.addAmoebas(parseInt(10000 * this.boardVars.boardSize), massFunc, 100000);

    for (let i = 0; i < this.amoebas.length; i++) {
      this.quadTree.insert1(this.amoebas[i]);
    }

    if (amoeboi) {
      this.amoeboi.mass /= 100;
      this.amoeboi.adjustRadius();
    }
  };

  addAmoebas = (num, massFunc, inertia) => {
    for (let i = 0; i < num; i++) {
      let mass = massFunc();
      let radius = Math.sqrt(mass / (Math.PI));
      let xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
      let ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      let momentum = {x: Math.floor(Math.random() * inertia) - (inertia / 2), y: Math.floor(Math.random() * inertia) - (inertia / 2)};
      let amoeba = new Amoeba({
        x: xpos,
        y: ypos,
        mass,
        momentum,
        realBoardWidth: this.boardVars.realBoardWidth,
        realBoardHeight: this.boardVars.realBoardHeight,
      });
      while (this.amoeboi && collidesWith(this.amoeboi, amoeba)) {
        amoeba.xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
        amoeba.ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      }
      this.amoebas.push(amoeba);
    }
  };

  reset = () => {
    this.boardVars.maxZoom = 4;
    this.boardVars.currentZoom = 2;
    this.timeVars.timeCoefficient = 0.5;
    this.boardVars.baseMass = 50000;

    this.setUpAmoebas(false);

    this.boardVars.boardFocus = { x: this.boardVars.realBoardWidth / 2, y: this.boardVars.realBoardHeight / 2};
  };

  setUpNextLevel = canvas => {
    canvas.homepageYOffset = 0;
    this.boardVars.currentZoom = 4;
    this.timeVars.timeCoefficient = 0.5;
    this.setBoardVars(
        (this.boardVars.realBoardWidth * 1.2) + (500 - ((this.boardVars.realBoardWidth * 1.2) % 500)),
        (this.boardVars.realBoardHeight * 1.2) + (500 - ((this.boardVars.realBoardHeight * 1.2) % 500)));
    this.setUpAmoebas(true);
    this.boardVars.baseMass = this.amoeboi.mass;
    this.boardVars.boardFocus = {x: this.amoeboi.xpos, y: this.amoeboi.ypos};
    this.audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10, this.timeVars.timeCoefficient)))) * 3.5);
  };

  animateHomepage = canvas => {
    this.moveAmoebas(canvas);
    canvas.drawHomepage(this.mouseVars, this.muted);
  };

  animateMovingToInstructions = canvas => {
    canvas.homepageYOffset -= 50;
    this.moveAmoebas(canvas);
    canvas.drawHomepage(this.mouseVars, this.muted);
  };

  animateInstructions = canvas => {
    this.moveAmoebas(canvas);
    canvas.drawHomepage(this.mouseVars, this.muted);
  };

  animateMovingToHomePage = canvas => {
    canvas.homepageYOffset += 50;
    this.moveAmoebas(canvas);
    canvas.drawHomepage(this.mouseVars, this.muted);
  };

  animateColoringLoseScreen = canvas => {
    this.boardVars.boardFocus.x += (this.boardVars.boardFocus.x < this.boardVars.realBoardWidth / 2) ? 10 : -10;
    this.boardVars.boardFocus.y += (this.boardVars.boardFocus.y < this.boardVars.realBoardHeight / 2) ? 10 : -10;
    this.boardVars.currentZoom = this.boardVars.currentZoom > 1 ? this.boardVars.currentZoom * 0.9 : this.boardVars.currentZoom;
    this.boardVars.baseMass = 0;
    this.moveAmoebas(canvas);
    this.homepageAlpha += .1;
    canvas.ctx.globalAlpha = this.homepageAlpha;
    canvas.ctx.fillStyle = 'black';
    canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  };

  animateFinishedColoringLoseScreen = canvas => {
    canvas.ctx.globalAlpha = this.homepageAlpha;
    canvas.ctx.fillStyle = 'black';
    canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    canvas.homepageYOffset = 1500;
    this.homepageAlpha = 0;
  };

  animateMovingToLoseScreen = canvas => {
    canvas.homepageYOffset -= 50;
    this.moveAmoebas(canvas);
    canvas.drawHomepage(this.mouseVars, this.muted);
  };

  animateLosescreen = canvas => {
    this.moveAmoebas(canvas);
    canvas.drawHomepage(this.mouseVars, this.muted);
  };

  animateLosescreenToHomePage = canvas => {
    canvas.homepageYOffset -= 50;
    this.moveAmoebas(canvas);
    canvas.drawHomepage(this.mouseVars, this.muted);
  };

  animatePause = canvas => {
    this.amoebas.forEach(amoeba => {
      canvas.drawAmoeba(amoeba, this.boardVars, this.mouseVars);
    });
    canvas.drawAmoeboi(this.amoeboi, this.boardVars, this.mouseVars);

    canvas.drawPause(this.mouseVars.mousePos.x, this.mouseVars.mousePos.y);
  };

  animateColoringWinScreen = canvas => {
    this.boardVars.boardFocus.x += (this.boardVars.boardFocus.x < this.boardVars.realBoardWidth / 2) ? 10 : -10;
    this.boardVars.boardFocus.y += (this.boardVars.boardFocus.y < this.boardVars.realBoardHeight / 2) ? 10 : -10;
    this.boardVars.currentZoom = this.boardVars.currentZoom > 1 ? this.boardVars.currentZoom * 0.9 : this.boardVars.currentZoom;
    this.boardVars.baseMass = this.amoeboi.mass;
    this.moveAmoebas(canvas);
    this.homepageAlpha += .1;
    canvas.ctx.globalAlpha = this.homepageAlpha;
    canvas.ctx.fillStyle = 'black';
    canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  };

  animateFinishedColoringWinScreen = canvas => {
    canvas.ctx.globalAlpha = this.homepageAlpha;
    canvas.ctx.fillStyle = 'black';
    canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    canvas.homepageYOffset = 1500;
    this.homepageAlpha = 0;
  };

  animateMovingToWinScreen = canvas => {
    canvas.homepageYOffset -= 50;
    this.boardVars.baseMass = this.amoeboi.mass;
    this.moveAmoebas(canvas);
    canvas.drawWinScreen(this.mouseVars);
  };

  animateWinScreen = canvas => {
    this.boardVars.baseMass = this.amoeboi.mass;
    this.moveAmoebas(canvas);
    canvas.drawWinScreen(this.mouseVars);
    return WIN_SCREEN_STATUS;
  };

  moveAmoebas = (canvas) => {
    this.amoebas = this.amoebas.filter(amoeba => {
      return amoeba.mass > 0;
    });
    this.quadTree.clear();
    for (let i = 0; i < this.amoebas.length; i++) {
      this.quadTree.insert1(this.amoebas[i]);
    }
    canvas.ctx.globalAlpha = 0.8;
    this.amoebas.forEach(amoeba => {
      amoeba.move(this.timeVars.timeCoefficient);
      canvas.drawAmoeba(amoeba, this.boardVars, this.mouseVars);
    });
    this.amoeboi ? this.amoeboi.move(this.timeVars.timeCoefficient) : null;
    this.amoeboi ? canvas.drawAmoeboi(this.amoeboi, this.boardVars, this.mouseVars) : null;
    canvas.ctx.globalAlpha = 1;
    this.quadTree.checkAllCollisions(aabbCheck(this.timeVars.timeCoefficient));
    this.amoebas.forEach(amoeba => {
      this.amoeboi ? aabbCheck(this.timeVars.timeCoefficient)(this.amoeboi, amoeba) : null;
      this.amoeboi ? aabbCheck(this.timeVars.timeCoefficient)(amoeba, this.amoeboi) : null;
      wallCollision(amoeba, this.boardVars);
    });
    this.amoeboi ? wallCollision(this.amoeboi, this.boardVars) : null;
  };

  checkWin = () => {
    for (let i = 0, num = this.amoebas.length; i < num; i++) {
      if (this.amoeboi.mass < this.amoebas[i].mass) {
        return false;
      }
    }
    return true;
  };

}


export default Game;
