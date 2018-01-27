import {boundNum, baseLog} from './util';
import Amoeba from './amoeba.js';
import Amoeboi from './amoeboi.js';
import QuadTree from './quadtree.js';

class Game {
  constructor(ctx, realBoardWidth=20000, realBoardHeight=20000) {
    this.ctx = ctx;

    this.setupImages();
    this.setupProportions(realBoardWidth, realBoardHeight);
    this.setupTime();
    this.setupMouse();

    this.homepageClock = null;
    this.clockAngle = 0;
    this.mouseDownTime = null;
    this.mouseDownInterval = null;
    this.paused = false;
    this.currentStatus = "reset";
    this.homepageYOffset = 0;
    this.homepageTime = null;
    this.mousePos = {x: 0, y: 0};
    this.shiftDown = false;

    this.animate = this.animate.bind(this);
    this.moveAmoebas = this.moveAmoebas.bind(this);
    this.makePause = this.makePause.bind(this);
    this.makeClock = this.makeClock.bind(this);
    this.makeGrid = this.makeGrid.bind(this);
    this.makeMassDisplay = this.makeMassDisplay.bind(this);
    this.makeMargins = this.makeMargins.bind(this);
    this.makeHomepage = this.makeHomepage.bind(this);
  }

  setupMouse() {
    this.mouseVars = {};
    this.mouseVars.mouseDownTime = null;
    this.mouseVars.mouseOffset = {x: 0, y: 0};

    Amoeba.prototype.mouseVars = this.mouseVars;
  }

  setupTime() {
    this.timeVars = {};
    this.timeVars.timeBase = 10;
    this.timeVars.timeCoefficient = .2;

    Amoeba.prototype.timeVars = this.timeVars;
  }

  setupProportions(realBoardWidth, realBoardHeight) {
    this.boardVars = {};
    this.boardVars.realBoardWidth = realBoardWidth;
    this.boardVars.realBoardHeight = realBoardHeight;
    this.boardVars.baseMass = 50000;
    this.boardVars.maxZoom = 8;
    this.boardVars.absoluteMaxZoom = 8;
    this.boardVars.minZoom = 0.7;
    this.boardVars.currentZoom = this.boardVars.maxZoom;
    this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
    this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
    this.boardVars.boardFocus = {x: this.boardVars.realBoardWidth / 2, y: this.boardVars.realBoardHeight / 2};

    Amoeba.prototype.boardVars = this.boardVars;
  }

  setupImages() {
    this.iconImages = {};
    this.iconImages.githubLogo = new Image();
    this.iconImages.githubLogo.src = './assets/images/githubLogo.png';
    this.iconImages.linkedInLogo = new Image();
    this.iconImages.linkedInLogo.src = './assets/images/linkedInLogo.png';
    this.iconImages.folderIcon = new Image();
    this.iconImages.folderIcon.src = './assets/images/folderIcon.png';
  }

  setupAmoebas(amoeboi) {
    this.amoebas = [];
    this.amoeboi = !amoeboi ? null : new Amoeboi(this.ctx, this.boardVars.realBoardWidth / 2,
                                                 this.boardVars.realBoardHeight / 2,
                                                 100000, {x: 0, y: 0});
    this.quadTree = new QuadTree(0,0, this.boardVars.realBoardWidth, this.boardVars.realBoardHeight);
    let mass, radius, xpos, ypos, momentum, amoeba;
    for (let i = 0; i < 2; i++) {
      mass = Math.floor((Math.random() * 40000000) + 10000000);
      radius = Math.sqrt(mass / (Math.PI));
      xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
      ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      momentum = {x: Math.floor(Math.random() * 1000000) - 500000, y: Math.floor(Math.random() * 1000000) - 500000};
      amoeba = new Amoeba(this.ctx, xpos, ypos, mass);
      while (this.amoeboi && this.amoeboi.collidesWith(amoeba)) {
        amoeba.xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
        amoeba.ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      }
      this.amoebas.push(amoeba);
    }
    for (let i = 0; i < 20; i++) {
      mass = Math.floor((Math.random() * 4000000) + 1000000);
      radius = Math.sqrt(mass / (Math.PI));
      xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
      ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      momentum = {x: Math.floor(Math.random() * 1000000) - 500000, y: Math.floor(Math.random() * 1000000) - 500000};
      amoeba = new Amoeba(this.ctx, xpos, ypos, mass);
      while (this.amoeboi && this.amoeboi.collidesWith(amoeba)) {
        amoeba.xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
        amoeba.ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      }
      this.amoebas.push(amoeba);
    }
    for (let i = 0; i < 180; i++) {
      mass = Math.floor((Math.random() * 400000) + 100000);
      radius = Math.sqrt(mass / (Math.PI));
      xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
      ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      momentum = {x: Math.floor(Math.random() * 1000000) - 500000, y: Math.floor(Math.random() * 1000000) - 500000};
      amoeba = new Amoeba(this.ctx, xpos, ypos, mass);
      while (this.amoeboi && this.amoeboi.collidesWith(amoeba)) {
        amoeba.xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
        amoeba.ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      }
      this.amoebas.push(amoeba);
    }
    for (let i = 0; i < 300; i++) {
      mass = Math.floor((Math.random() * 400000) + 10000);
      radius = Math.sqrt(mass / (Math.PI));
      xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
      ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      momentum = {x: Math.floor(Math.random() * 1000000) - 500000, y: Math.floor(Math.random() * 1000000) - 500000};
      amoeba = new Amoeba(this.ctx, xpos, ypos, mass);
      while (this.amoeboi && this.amoeboi.collidesWith(amoeba)) {
        amoeba.xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
        amoeba.ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      }
      this.amoebas.push(amoeba);
    }
    for (let i = 0; i < 600; i++) {
      mass = Math.floor((Math.random() * 10000) + 10000);
      radius = Math.sqrt(mass / (Math.PI));
      xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
      ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      momentum = {x: Math.floor(Math.random() * 500000) - 250000, y: Math.floor(Math.random() * 500000) - 250000};
      amoeba = new Amoeba(this.ctx, xpos, ypos, mass);
      while (this.amoeboi && this.amoeboi.collidesWith(amoeba)) {
        amoeba.xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
        amoeba.ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      }
      this.amoebas.push(amoeba);
    }

    // for (let i = 0; i < 20; i++) {
    //   mass = Math.floor((Math.random() * 10000) + 10000);
    //   radius = Math.sqrt(mass / (Math.PI));
    //   xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
    //   ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
    //   momentum = {x: Math.floor(Math.random() * 500000) - 250000, y: Math.floor(Math.random() * 500000) - 250000};
    //   this.amoebas.push(new Amoeba(this.ctx, xpos, ypos, mass));
    // }
    for (let i = 0; i < this.amoebas.length; i++) {
      this.quadTree.insert1(this.amoebas[i]);
    }
  }

  animate() {
    this.ctx.clearRect(0,0, innerWidth, innerHeight);
    this.makeGrid(this.ctx);

    if (this.currentStatus === "reset") {
      this.boardVars.maxZoom = 4;
      this.boardVars.currentZoom = 2;
      this.timeVars.timeCoefficient = 0.2;
      this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
      this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
      this.boardVars.baseMass = 50000;

      this.setupAmoebas(false);

      this.boardVars.boardFocus = {x: this.boardVars.realBoardWidth / 2, y: this.boardVars.realBoardHeight / 2};
      this.currentStatus = "homepage";
      return requestAnimationFrame(this.animate);
    }

    if (this.currentStatus === "setup") {
      this.setupAmoebas(true);

      this.boardVars.currentZoom = 4;
      this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
      this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
      this.boardVars.baseMass = this.amoeboi.mass;
      this.boardVars.boardFocus = {x: this.amoeboi.xpos, y: this.amoeboi.ypos};
      this.currentStatus = "playing";
      return requestAnimationFrame(this.animate);
    }

    if (this.currentStatus === "homepage") {
      this.moveAmoebas(this.ctx);
      this.makeHomepage(this.ctx);
      return requestAnimationFrame(this.animate);
    }

    if (this.currentStatus === "movingToInstructions") {
      if (this.homepageYOffset > -1000) {
        this.homepageYOffset -= 20;
      } else {
        this.currentStatus = "instructions";
      }
      this.moveAmoebas(this.ctx);
      this.makeHomepage(this.ctx);
      return requestAnimationFrame(this.animate);
    }

    if (this.currentStatus === "instructions") {
      this.moveAmoebas(this.ctx);
      this.makeHomepage(this.ctx);
      return requestAnimationFrame(this.animate);
    }

    if (this.currentStatus === "movingToHomePage") {
      if (this.homepageYOffset < 0) {
        this.homepageYOffset += 20;
      } else {
        this.currentStatus = "homepage";
      }
      this.moveAmoebas(this.ctx);
      this.makeHomepage(this.ctx);
      return requestAnimationFrame(this.animate);
    }

    if (this.paused) {
      this.amoebas.forEach(amoeba => {
        amoeba.draw();
      });
      this.amoeboi.draw();

      this.makePause(this.ctx);
      // makeMargins(this.ctx);
      return requestAnimationFrame(this.animate);
    }

    this.moveAmoebas(this.ctx);

    this.makeMargins(this.ctx);
    this.makeMassDisplay(this.ctx);
    this.makeInstructions(this.ctx);
    // this.makeClock(this.ctx);
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
      this.boardVars.boardFocus['x'] += (this.boardVars.boardFocus['x'] < this.boardVars.realBoardWidth / 2) ? 10 : -10;
      this.boardVars.boardFocus['y'] += (this.boardVars.boardFocus['y'] < this.boardVars.realBoardHeight / 2) ? 10 : -10;
      this.boardVars.currentZoom = this.boardVars.currentZoom > 1 ? this.boardVars.currentZoom * 0.9 : this.boardVars.currentZoom;
      this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
      this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
      this.boardVars.baseMass = 0;
    }
    requestAnimationFrame(this.animate);
  }

  makePause(ctx) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    let mouseOffsetX = this.mousePos['x'] / window.innerWidth * 50;
    let mouseOffsetY = this.mousePos['y'] / window.innerHeight * 50;

    let homepageWave = Math.sin(((Date.now() - this.homepageTime) % 1500) / 1500 * Math.PI);

    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = '70px Impact';
    let titlePosX = (window.innerWidth / 2) - 75 - mouseOffsetX;
    let titlePosY = (window.innerHeight / 2) + 50 - mouseOffsetY + this.homepageYOffset;
    ctx.fillText(`PAUSED`, titlePosX, titlePosY);
  }

  makeClock(ctx) {
    ctx.globalAlpha = 0.5;

    ctx.beginPath();
    ctx.arc(120, 120, 65, 0, ((baseLog(this.timeVars.timeBase, this.timeVars.timeCoefficient) + 1) / 2 * Math.PI * 2));
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(120, 120, 60, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(120,120);
    ctx.lineTo(120 + (60*Math.cos(this.clockAngle * Math.PI / 180)), 120 + (60*Math.sin(this.clockAngle * Math.PI / 180)));
    ctx.fillStyle = 'black';
    ctx.stroke();
    this.clockAngle = (this.clockAngle + (this.timeVars.timeCoefficient)) % 360;
    ctx.globalAlpha = 1;
  }

  makeGrid(ctx) {
    // let currentLineX = this.boardFocus['x'] - (this.boardWidth / 2);
    ctx.globalAlpha = 0.4;

    let interval = 500;
    let realX = 0;
    let topBorderY =  (((0 - this.boardVars.boardFocus['y'])  / (this.boardVars.boardHeight / 2)) * 500) + (window.innerHeight / 2) + this.mouseVars.mouseOffset['y'];
    let bottomBorderY =  (((this.boardVars.realBoardHeight - this.boardVars.boardFocus['y']) / (this.boardVars.boardHeight / 2)) * 500) + (window.innerHeight / 2)  + this.mouseVars.mouseOffset['y'];
    while (realX <= this.boardVars.realBoardWidth) {
      ctx.fillStyle = (realX ===this.boardVars.realBoardWidth || realX === 0) ? "red" :"black";
      let lineX = (((realX - this.boardVars.boardFocus['x']) / (this.boardVars.boardWidth / 2)) * 500) + (window.innerWidth / 2);
      ctx.fillRect(lineX + this.mouseVars.mouseOffset['x'],topBorderY, 2, bottomBorderY - topBorderY);
      realX += interval;
    }

    let realY = 0;
    let leftBorderX = (((0 - this.boardVars.boardFocus['x']) / (this.boardVars.boardWidth / 2)) * 500) + (window.innerWidth / 2) + this.mouseVars.mouseOffset['x'];
    let rightBorderX = (((this.boardVars.realBoardWidth - this.boardVars.boardFocus['x']) / (this.boardVars.boardWidth / 2)) * 500) + (window.innerWidth / 2) + this.mouseVars.mouseOffset['x'];
    while (realY <= this.boardVars.realBoardHeight) {
      ctx.fillStyle = (realY ===this.boardVars.realBoardHeight || realY === 0) ? "red" :"black";
      let lineY = (((realY - this.boardVars.boardFocus['y']) / (this.boardVars.boardHeight / 2)) * 500) + (window.innerHeight / 2);
      ctx.fillRect(leftBorderX,lineY + this.mouseVars.mouseOffset['y'], rightBorderX - leftBorderX, 2);
      realY += interval;
    }

    ctx.globalAlpha = 1;
  }

  makeMassDisplay(ctx) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'black';
    let displayWidth;
    if (this.amoeboi.mass > 0) {
      displayWidth = 130 + (15 * boundNum(Math.floor(Math.log10(this.amoeboi.mass / 100),1, 10000)));
    } else {
      displayWidth = 145;
    }
    ctx.fillRect(window.innerWidth - 220, 65, displayWidth, 50);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = '30px Impact';
    ctx.fillText(`Mass: ${Math.floor(this.amoeboi.mass / 100) }`, window.innerWidth - 200, 100);
  }

  makeInstructions(ctx) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'black';
    ctx.fillRect(50, 60, 150, 80);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = '20px Georgia';
    ctx.fillText(`Space: Pause`, 60, 90);
    ctx.fillText(`H: Main Menu`, 60, 130);
  }

  makeMargins(ctx) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "black";
    let marginHeight = Math.floor(window.innerHeight / 8);
    let marginWidth = Math.floor(window.innerWidth / 8);
    // ctx.fillRect(0,0, window.innerWidth, marginHeight);
    // ctx.fillRect(0,  window.innerHeight - marginHeight, window.innerWidth, window.innerHeight);
    // ctx.fillRect(0, marginHeight, marginWidth, window.innerHeight - (marginHeight * 2));
    // ctx.fillRect(window.innerWidth - marginWidth, marginHeight, window.innerWidth, window.innerHeight - (marginHeight * 2));


    let timebarWidth = 500;
    let timebarHeight = 50;
    let timebarX = (window.innerWidth / 2) - (timebarWidth / 2);
    let timebarY = window.innerHeight - (marginHeight / 2) - (timebarHeight / 2);
    let time0to1 = (baseLog(this.timeVars.timeBase, this.timeVars.timeCoefficient) + 1) / 2;

    // let gradient = ctx.createLinearGradient(timebarX, timebarY, timebarX + timebarWidth, timebarY + timebarHeight);
    // gradient.addColorStop(0, "rgb(0,0,0)");
    // gradient.addColorStop(time0to1, "rgb(255,255,255)");
    // gradient.addColorStop(time0to1, "rgb(255,255,255)");
    // gradient.addColorStop(1, "rgb(0,0,0)");
    // let color = (baseLog(this.timeVars.timeBase, this.timeVars.timeCoefficient) + 1) / 2 * 255;
    // ctx.fillStyle = gradient;
    // ctx.fillStyle = `rgb(${255 - color},0,${color})`;
    ctx.fillStyle = `black`;
    ctx.fillRect(timebarX - 10, timebarY, timebarWidth + 20, timebarHeight);
    ctx.fillStyle = `white`;
    ctx.fillRect(timebarX + (timebarWidth * time0to1) - 10, timebarY, 20, timebarHeight);
    ctx.globalAlpha = 1;
  }

  moveAmoebas(ctx) {
    this.amoebas = this.amoebas.filter(amoeba => {
      return amoeba.mass > 0;
    });
    this.quadTree.clear();
    for (let i = 0; i < this.amoebas.length; i++) {
      this.quadTree.insert1(this.amoebas[i]);
    }
    ctx.globalAlpha = 0.8;
    this.amoebas.forEach(amoeba => {
      amoeba.move();
      amoeba.draw();
    });
    this.amoeboi ? this.amoeboi.move() : null;
    this.amoeboi ? this.amoeboi.draw() : null;
    ctx.globalAlpha = 1;
    this.quadTree.checkAllCollisions();
    this.amoebas.forEach(amoeba => {
      this.amoeboi ? this.amoeboi.aabbCheck(amoeba) : null;
      this.amoeboi ? amoeba.aabbCheck(this.amoeboi) : null;
      amoeba.wallCollision();
    });
    this.amoeboi ? this.amoeboi.wallCollision() : null;
  }

  makeHomepage(ctx) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    let mouseOffsetX = this.mousePos['x'] / window.innerWidth * 50;
    let mouseOffsetY = this.mousePos['y'] / window.innerHeight * 50;

    let homepageWave = Math.sin(((Date.now() - this.homepageTime) % 1500) / 1500 * Math.PI);

    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = '120px Impact';
    let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
    let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + this.homepageYOffset;
    ctx.fillText(`AmoeBoi`, titlePosX, titlePosY);

    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "rgb(0,0,50)";
    ctx.fillRect(titlePosX - 300, titlePosY + 885, 1050, 530);
    ctx.globalAlpha = 1;


    ctx.fillStyle = "rgb(240,240,240)";
    ctx.font = `${30 + (2 * homepageWave) }px Impact`;
    ctx.fillText(`PRESS ENTER TO START`, titlePosX + 85 - (5 * homepageWave), titlePosY + 100 + (2*homepageWave));

    ctx.font = '50px Impact';
    ctx.fillText(`⬇ INSTRUCTIONS ⬇`, titlePosX + 15, titlePosY + 360);

    ctx.fillText(`⬆ MAIN MENU ⬆`, titlePosX + 50, titlePosY + 850);

    ctx.font = '25px Arial Black';
    ctx.fillText("Become the Biggest!", titlePosX + 80, titlePosY + 930);

    ctx.fillText("Absorb smaller amoebas, avoid the bigger ones,", titlePosX - 100, titlePosY + 1000);
    ctx.fillText("and become the biggest blob in the land.", titlePosX - 50, titlePosY + 1030);

    ctx.fillText("Aim and hold the left mouse button to shoot out smaller amoebas", titlePosX - 230, titlePosY + 1100);
    ctx.fillText("and propel yourself the other way... but be careful!", titlePosX - 120, titlePosY + 1130);
    ctx.fillText("Every shot uses a little bit of your own mass.", titlePosX - 80, titlePosY + 1160);

    ctx.fillText("You can speed up or slow down time using the left/right arrow keys.", titlePosX - 250, titlePosY + 1230);

    ctx.fillText("Press space to pause the game", titlePosX + 5, titlePosY + 1300);
    ctx.fillText("and press H to return to the Main Menu at any time.", titlePosX - 130, titlePosY + 1330);

    ctx.fillText("Have fun!", titlePosX + 150, titlePosY + 1400);

    ctx.drawImage(this.iconImages.githubLogo, titlePosX - 50, titlePosY + 170, 80, 80);
    ctx.drawImage(this.iconImages.linkedInLogo, titlePosX + 180, titlePosY + 170, 72, 72);
    ctx.drawImage(this.iconImages.folderIcon, titlePosX + 380, titlePosY + 170, 88, 88);
  }

}


export default Game;
