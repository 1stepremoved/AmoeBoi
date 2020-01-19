import { boundNum, baseLog, collidesWith, aabbCheck, wallCollision } from './util';
import Amoeba from './amoeba.js';
import Amoeboi from './amoeboi.js';
import QuadTree from './quadtree.js';
import BoardVars from './board-vars';
import TimeVars from './time-vars';
import MouseVars from './mouse-vars';

class Game {
  constructor(realBoardWidth = 20000, realBoardHeight = 20000, audio) {
    this.audio = audio;
    this.muted = false;

    this.setupProportions(realBoardWidth, realBoardHeight);
    this.setupTime();
    this.setupMouse();

    this.paused = false;
    this.currentStatus = "reset";
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

  setupProportions = (realBoardWidth, realBoardHeight) => {
    this.boardSize = (realBoardWidth / 30000);

    const maxZoom = parseInt(50 / Math.sqrt(100000 / Math.PI) * realBoardWidth / 1000);  //100000 is the starting mass for amoeboi
    const absoluteMaxZoom = maxZoom;
    const currentZoom = maxZoom;

    this.boardVars = new BoardVars({
      realBoardWidth,
      realBoardHeight,
      baseMass: 50000,
      maxZoom,
      absoluteMaxZoom,
      minZoom: 0.7,
      currentZoom,
      boardWidth: realBoardWidth / currentZoom,
      boardHeight: realBoardHeight / currentZoom,
      boardFocus: { x: realBoardWidth / 2, y: realBoardHeight / 2},
    });
  };

  addAmoebas = (num, massFunc, inertia) => {
    for (let i = 0; i < num; i++) {
      let mass = massFunc();
      let radius = Math.sqrt(mass / (Math.PI));
      let xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
      let ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      let momentum = {x: Math.floor(Math.random() * inertia) - (inertia / 2), y: Math.floor(Math.random() * inertia) - (inertia / 2)};
      let amoeba = new Amoeba({ x: xpos, y: ypos, mass, momentum, boardVars: this.boardVars });
      while (this.amoeboi && collidesWith(this.amoeboi, amoeba)) {
        amoeba.xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
        amoeba.ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      }
      this.amoebas.push(amoeba);
    }
  };

  setupAmoebas = (amoeboi) => {
    this.amoebas = [];
    this.amoeboi = !amoeboi ? null : new Amoeboi({ x: this.boardVars.realBoardWidth / 2,
                                                   y: this.boardVars.realBoardHeight / 2,
                                                   mass: 10000000,
                                                   momentum: {x: 0, y: 0},
                                                   boardVars: this.boardVars
                                                });
    this.quadTree = new QuadTree({ x: 0, y: 0, width: this.boardVars.realBoardWidth, height: this.boardVars.realBoardHeight });
    let mass, massFunc;

    massFunc = () => {
      mass = Math.pow(this.boardVars.realBoardHeight / 30 * Math.PI,2);
      return Math.floor((Math.random() * mass * 4) + mass);
    };
    this.addAmoebas(parseInt(2 * this.boardSize), massFunc, 1000000);

    massFunc = () => Math.floor((Math.random() * 4000000 * Math.pow(this.boardSize,2)) + (1000000 * Math.pow(this.boardSize, 2)));
    this.addAmoebas(parseInt(20 * this.boardSize), massFunc, 1000000);

    massFunc = () => Math.floor((Math.random() * 400000) + 100000);
    this.addAmoebas(parseInt(700 * this.boardSize), massFunc, 1000000);

    massFunc = () => Math.floor((Math.random() * 400000) + 10000);
    this.addAmoebas(parseInt(50 * this.boardSize), massFunc, 1000000);

    massFunc = () => Math.floor((Math.random() * 10000) + 10000);
    this.addAmoebas(parseInt(10000 * this.boardSize), massFunc, 100000);

    for (let i = 0; i < this.amoebas.length; i++) {
      this.quadTree.insert1(this.amoebas[i]);
    }

    if (amoeboi) {
      this.amoeboi.mass /= 100;
      this.amoeboi.adjustRadius();
    }
  };

  animate = (canvas) => {
    console.log(this.currentStatus)
    canvas.ctx.clearRect(0,0, innerWidth, innerHeight);
    canvas.makeGrid(this.boardVars, this.mouseVars);

    if (this.currentStatus === "reset") {
      this.boardVars.maxZoom = 4;
      this.boardVars.currentZoom = 2;
      this.timeVars.timeCoefficient = 0.5;
      this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
      this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
      this.boardVars.baseMass = 50000;

      this.setupAmoebas(false);

      this.boardVars.boardFocus = { x: this.boardVars.realBoardWidth / 2, y: this.boardVars.realBoardHeight / 2};
      this.currentStatus = "homepage";
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "setup") {
      this.setupProportions(30000,30000); //this will undo any leveling
      this.setupAmoebas(true);
      canvas.homepageYOffset = 0;
      this.boardVars.currentZoom = 4;
      this.timeVars.timeCoefficient = 0.5;
      this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
      this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
      this.boardVars.baseMass = this.amoeboi.mass;
      this.boardVars.boardFocus = {x: this.amoeboi.xpos, y: this.amoeboi.ypos};
      this.currentStatus = "playing";
      this.audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10,this.timeVars.timeCoefficient)))) * 3.5);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "nextLevel") {
      canvas.homepageYOffset = 0;
      this.boardVars.currentZoom = 4;
      this.timeVars.timeCoefficient = 0.5;
      this.setupProportions(
        (this.boardVars.realBoardWidth * 1.2) + (500 - ((this.boardVars.realBoardWidth * 1.2) % 500)),
        (this.boardVars.realBoardHeight * 1.2) + (500 - ((this.boardVars.realBoardHeight * 1.2) % 500)));
      this.setupAmoebas(true);
      this.boardVars.baseMass = this.amoeboi.mass;
      this.boardVars.boardFocus = {x: this.amoeboi.xpos, y: this.amoeboi.ypos};
      this.currentStatus = "playing";
      this.audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10, this.timeVars.timeCoefficient)))) * 3.5);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "homepage") {
      this.moveAmoebas(canvas);
      canvas.makeHomepage(this.mouseVars, this.muted);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "movingToInstructions") {
      if (canvas.homepageYOffset > -1000) {
        canvas.homepageYOffset -= 80;
      } else {
        this.currentStatus = "instructions";
      }
      this.moveAmoebas(canvas);
      canvas.makeHomepage(this.mouseVars, this.muted);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "instructions") {
      this.moveAmoebas(canvas);
      canvas.makeHomepage(this.mouseVars, this.muted);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "movingToHomePage") {
      if (canvas.homepageYOffset < 0) {
        canvas.homepageYOffset += 80;
      } else {
        this.currentStatus = "homepage";
      }
      this.moveAmoebas(canvas);
      canvas.makeHomepage(this.mouseVars, this.muted);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "coloringLoseScreen") {
      this.boardVars.boardFocus.x += (this.boardVars.boardFocus.x < this.boardVars.realBoardWidth / 2) ? 10 : -10;
      this.boardVars.boardFocus.y += (this.boardVars.boardFocus.y < this.boardVars.realBoardHeight / 2) ? 10 : -10;
      this.boardVars.currentZoom = this.boardVars.currentZoom > 1 ? this.boardVars.currentZoom * 0.9 : this.boardVars.currentZoom;
      this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
      this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
      this.boardVars.baseMass = 0;
      this.moveAmoebas(canvas);
      if (this.homepageAlpha < 0.5) {
        this.homepageAlpha += .1;
      } else {
        canvas.ctx.globalAlpha = this.homepageAlpha;
        canvas.ctx.fillStyle = 'black';
        canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        canvas.homepageYOffset = 1500;
        this.homepageAlpha = 0;
        this.currentStatus = "movingToLoseScreen";
        return requestAnimationFrame(() => this.animate(canvas));
      }
      canvas.ctx.globalAlpha = this.homepageAlpha;
      canvas.ctx.fillStyle = 'black';
      canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "movingToLoseScreen") {
      if (canvas.homepageYOffset > 1000) {
        canvas.homepageYOffset -= 80;
      } else {
        this.currentStatus = "losescreen";
      }
      this.moveAmoebas(canvas);
      canvas.makeHomepage(this.mouseVars, this.muted);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "losescreen") {
      this.moveAmoebas(canvas);
      canvas.makeHomepage(this.mouseVars, this.muted);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "losescreenToHomePage") {
      if (canvas.homepageYOffset > 0) {
        canvas.homepageYOffset -= 80;
      } else {
        this.currentStatus = "homepage";
      }
      this.moveAmoebas(canvas);
      canvas.makeHomepage(this.mouseVars, this.muted);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.paused) {
      this.amoebas.forEach(amoeba => {
        canvas.drawAmoeba(amoeba, this.boardVars, this.mouseVars);
      });
      canvas.drawAmoeboi(this.amoeboi, this.boardVars, this.mouseVars);

      canvas.makePause(this.mouseVars.mousePos.x, this.mouseVars.mousePos.y);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "playing" && this.checkWin()) {
      this.currentStatus = "coloringWinScreen";
    }

    if (this.currentStatus === "coloringWinScreen") {
      this.boardVars.boardFocus.x += (this.boardVars.boardFocus.x < this.boardVars.realBoardWidth / 2) ? 10 : -10;
      this.boardVars.boardFocus.y += (this.boardVars.boardFocus.y < this.boardVars.realBoardHeight / 2) ? 10 : -10;
      this.boardVars.currentZoom = this.boardVars.currentZoom > 1 ? this.boardVars.currentZoom * 0.9 : this.boardVars.currentZoom;
      this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
      this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
      this.boardVars.baseMass = this.amoeboi.mass;
      this.moveAmoebas(canvas);
      if (this.homepageAlpha < 0.5) {
        this.homepageAlpha += .1;
      } else {
        canvas.ctx.globalAlpha = this.homepageAlpha;
        canvas.ctx.fillStyle = 'black';
        canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        canvas.homepageYOffset = 1500;
        this.homepageAlpha = 0;
        this.currentStatus = "movingToWinScreen";
        return requestAnimationFrame(() => this.animate(canvas));
      }
      canvas.ctx.globalAlpha = this.homepageAlpha;
      canvas.ctx.fillStyle = 'black';
      canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "movingToWinScreen") {
      if (canvas.homepageYOffset > 1000) {
        canvas.homepageYOffset -= 80;
      } else {
        this.currentStatus = "winScreen";
      }
      this.boardVars.baseMass = this.amoeboi.mass;
      this.moveAmoebas(canvas);
      canvas.makeWinScreen(this.mouseVars);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    if (this.currentStatus === "winScreen") {
      this.boardVars.baseMass = this.amoeboi.mass;
      this.moveAmoebas(canvas);
      canvas.makeWinScreen(this.mouseVars);
      return requestAnimationFrame(() => this.animate(canvas));
    }

    this.moveAmoebas(canvas);

    canvas.makeMargins(this.timeVars);
    canvas.makeMassDisplay(this.amoeboi);
    canvas.makeInstructions(this.muted, this.autoscaleTime);
    if (this.autoscaleTime) {
      let largest = this.amoebas[0];
      this.amoebas.forEach(a => {largest = largest.radius < a.radius ? a : largest;});
      this.timeVars.timeCoefficient = (this.amoeboi.radius / largest.radius) * this.timeVars.timeBase * .75;
    }
    // canvas.makeClock(this.timeVars);
    if (this.amoeboi.mass > 0) {
      this.boardVars.boardFocus = {x: this.amoeboi.xpos, y: this.amoeboi.ypos};
      this.boardVars.baseMass = this.amoeboi.mass;
      if (this.amoeboi.radius / this.boardVars.realBoardWidth * 1000 * this.boardVars.currentZoom > 75) {
        this.boardVars.maxZoom = boundNum(75 / (this.amoeboi.radius / this.boardVars.realBoardWidth * 1000), 1, this.boardVars.absoluteMaxZoom);
        this.boardVars.currentZoom = boundNum(this.boardVars.currentZoom * 0.9999999, this.boardVars.minZoom, this.boardVars.maxZoom);
        this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
        this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
      }
      if (this.amoeboi.radius / this.boardVars.realBoardWidth * 1000 * this.boardVars.maxZoom < 75) {
        this.boardVars.maxZoom = boundNum(75 / (this.amoeboi.radius / this.boardVars.realBoardWidth * 1000), 1, this.boardVars.absoluteMaxZoom);
      }
    } else {
      this.currentStatus = "coloringLoseScreen";
    }
    requestAnimationFrame(() => this.animate(canvas));
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
