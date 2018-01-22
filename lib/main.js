import Amoeba from './amoeba.js';
import Amoeboi from './amoeboi.js';
import {boundNum, baseLog, transitionVar} from './util';
import {moveAmoebas, makePause, makeGrid, makeClock,
        makeMargins, makeMassDisplay, makeHomepage} from './game';


window.iconImages = {};
window.iconImages.githubLogo = new Image();
window.iconImages.githubLogo.src = './assets/images/githubLogo.png';
window.iconImages.linkedInLogo = new Image();
window.iconImages.linkedInLogo.src = './assets/images/linkedInLogo.png';
window.iconImages.folderIcon = new Image();
window.iconImages.folderIcon.src = './assets/images/folderIcon.png';

window.homepageClock = null;

window.maxZoom = 4;
window.absoluteMaxZoom = 4;
window.minZoom = 0.7;
window.currentZoom = window.maxZoom;
window.realBoardHeight = 20000;
window.realBoardWidth = 20000;
window.boardHeight = window.realBoardHeight / window.currentZoom;
window.boardWidth = window.realBoardWidth / window.currentZoom;
window.boardFocus = {x: window.realBoardWidth / 2, y: window.realBoardHeight / 2};
window.timeBase = 10;
window.timeCoefficient = .2;
window.clockAngle = 0;
window.baseMass = 50000;
window.mouseDownTime = null;
window.mouseDownInterval = null;
window.paused = false;
window.currentStatus = "reset";
window.homepageYOffset = 0;
window.homepageTime = null;
window.mousePos= {x: 0, y: 0};

document.addEventListener("DOMContentLoaded", () => {
  window.onresize = ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener("click", (e) => {
    if (window.currentStatus === "homepage") {
      let mouseOffsetX = window.mousePos['x'] / window.innerWidth * 50;
      let mouseOffsetY = window.mousePos['y'] / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + window.homepageYOffset;
      if (e.pageX > titlePosX - 40 && e.pageX < titlePosX + 40
       && e.pageY > titlePosY + 170 && e.pageY < titlePosY + 250) {
         window.location = "https://github.com/1stepremoved";
      } else if (e.pageX > titlePosX + 180 && e.pageX < titlePosX + 252
        && e.pageY > titlePosY + 170 && e.pageY < titlePosY + 242) {
        window.location = "https://linkedin.com/in/hamilton-sands";
      } else if (e.pageX > titlePosX + 380 && e.pageX < titlePosX + 468
        && e.pageY > titlePosY + 170 && e.pageY < titlePosY + 258) {
        window.location = "https://1stepremoved.github.io/portfolio/";
      } else if (e.pageX > titlePosX + 75 && e.pageX < titlePosX + 365
        && e.pageY > titlePosY + 315 && e.pageY < titlePosY + 360) {
          window.currentStatus = "movingToInstructions";
          document.body.style.cursor = "default";
      }
    } else if (window.currentStatus === "instructions") {
      let mouseOffsetX = window.mousePos['x'] / window.innerWidth * 50;
      let mouseOffsetY = window.mousePos['y'] / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + window.homepageYOffset;
      if (e.pageX > titlePosX + 110 && e.pageX < titlePosX + 335
       && e.pageY > titlePosY + 805 && e.pageY < titlePosY + 850) {
         window.currentStatus = "movingToHomePage";
         document.body.style.cursor = "default";
      }
    }
  });

  window.addEventListener("mousedown", (e) => {
    if (window.paused || window.currentStatus !== "playing") {
      return;
    }
    window.mouseDownTime = Date.now();
    window.amoeboi.mousePosX = e.pageX;
    window.amoeboi.mousePosY = e.pageY;
    window.amoeboi.propel(e,window.amoebas);
    window.mouseDownInterval = setInterval(() => {
      window.amoeboi.propel(e,window.amoebas);
    }, 200);
  });

  window.addEventListener("mousemove", (e) => {
    if (window.currentStatus === "homepage") {
      let mouseOffsetX = window.mousePos['x'] / window.innerWidth * 50;
      let mouseOffsetY = window.mousePos['y'] / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + window.homepageYOffset;
      if (e.pageX > titlePosX - 40 && e.pageX < titlePosX + 40
       && e.pageY > titlePosY + 170 && e.pageY < titlePosY + 250) {
        document.body.style.cursor = "pointer";
      } else if (e.pageX > titlePosX + 180 && e.pageX < titlePosX + 252
        && e.pageY > titlePosY + 170 && e.pageY < titlePosY + 242) {
        document.body.style.cursor = "pointer";
      } else if (e.pageX > titlePosX + 380 && e.pageX < titlePosX + 468
        && e.pageY > titlePosY + 170 && e.pageY < titlePosY + 258) {
        document.body.style.cursor = "pointer";
      } else if (e.pageX > titlePosX + 75 && e.pageX < titlePosX + 365
        && e.pageY > titlePosY + 315 && e.pageY < titlePosY + 360) {
          document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    } else if (window.currentStatus === "instructions") {
      let mouseOffsetX = window.mousePos['x'] / window.innerWidth * 50;
      let mouseOffsetY = window.mousePos['y'] / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + window.homepageYOffset;

      if (e.pageX > titlePosX + 110 && e.pageX < titlePosX + 335
       && e.pageY > titlePosY + 805 && e.pageY < titlePosY + 850) {
         document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    }

    window.mousePos = {x: e.pageX, y: e.pageY};
    if (window.mouseDownTime) {
      window.amoeboi.mousePosX = e.pageX;
      window.amoeboi.mousePosY = e.pageY;
    }
  });

  window.addEventListener("mouseup", (e) => {
    window.mouseDownTime = null;
    clearInterval(window.mouseDownInterval);
  });

  window.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
      case 39:
        if (window.paused || window.currentStatus !== "playing") { return; }
        window.timeCoefficient = Math.min(window.timeCoefficient * 1.1, window.timeBase);
        return;
      case 37:
        if (window.paused || window.currentStatus !== "playing") { return; }
        window.timeCoefficient = Math.max(window.timeCoefficient * 0.9, Math.pow(window.timeBase, - 1));
        return;
      case 32:
        if (window.currentStatus !== "playing") { return; }
        window.paused = !window.paused;
        window.mouseDownTime = null;
        return;
      case 72:
        if (window.currentStatus === "instructions") {
          document.body.style.cursor = "default";
          window.currentStatus = "movingToHomePage";
          return;
        }
        window.currentStatus = "reset";
        window.paused = false;
        return;
      case 13:
        window.homepageTime = null;
        if (window.currentStatus !== "homepage") { return; }
        window.currentStatus = "setup";
      default:
        return;
    }
  });

  document.addEventListener("mousewheel", (e)=> {
    e.preventDefault();
    if (window.paused  || window.currentStatus !== "playing") { return; }
    let zoomDelta = (e.deltaY / -1000);
    window.currentZoom = boundNum(window.currentZoom + zoomDelta, window.minZoom, window.maxZoom);
    window.boardHeight = window.realBoardHeight / window.currentZoom;
    window.boardWidth = window.realBoardWidth / window.currentZoom;
  });

  const canvas = document.getElementById("background");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // amoebas.push(new Amoeba(ctx, 4500, 5000, 100000, {x: 100000, y: 0}));
  // amoebas.push(new Amoeba(ctx, 5500, 5000, 300000, {x: -100000, y: 0}));
  // amoebas.push(new Amoeba(ctx, 5300, 5000, 100000, {x: -100000, y: 0}));
  let animate = () => {
    ctx.clearRect(0,0, innerWidth, innerHeight);
    makeGrid(ctx);

    if (window.currentStatus === "reset") {
      window.maxZoom = 4;
      window.currentZoom = 2;
      window.timeCoefficient = 0.2;
      window.boardHeight = window.realBoardHeight / window.currentZoom;
      window.boardWidth = window.realBoardWidth / window.currentZoom;
      window.baseMass = 50000;
      window.amoeboi = null;
      window.amoebas = [];
      for (let i = 0; i < 400; i++) {
        window.amoebas.push(new Amoeba(ctx));
      }
      window.boardFocus = {x: window.realBoardWidth / 2, y: window.realBoardHeight / 2};
      window.currentStatus = "homepage";
      return requestAnimationFrame(animate);
    }

    if (window.currentStatus === "setup") {
      window.amoebas = [];
      window.amoeboi = new Amoeboi(ctx, window.realBoardWidth / 2, window.realBoardHeight / 2, 100000, {x: 100000, y: 0});
      for (let i = 0; i < 400; i++) {
        window.amoebas.push(new Amoeba(ctx));
      }
      window.currentZoom = 4;
      window.boardHeight = window.realBoardHeight / window.currentZoom;
      window.boardWidth = window.realBoardWidth / window.currentZoom;
      window.baseMass = window.amoeboi.mass;
      window.boardFocus = {x: window.amoeboi.xpos, y: window.amoeboi.ypos};
      window.currentStatus = "playing";
      return requestAnimationFrame(animate);
    }

    if (window.currentStatus === "homepage") {
      moveAmoebas(ctx);
      makeHomepage(ctx);
      return requestAnimationFrame(animate);
    }

    if (window.currentStatus === "movingToInstructions") {
      if (window.homepageYOffset > -1000) {
        window.homepageYOffset -= 20;
      } else {
        window.currentStatus = "instructions";
      }
      moveAmoebas(ctx);
      makeHomepage(ctx);
      return requestAnimationFrame(animate);
    }

    if (window.currentStatus === "instructions") {
      moveAmoebas(ctx);
      makeHomepage(ctx);
      return requestAnimationFrame(animate);
    }

    if (window.currentStatus === "movingToHomePage") {
      if (window.homepageYOffset < 0) {
        window.homepageYOffset += 20;
      } else {
        window.currentStatus = "homepage";
      }
      moveAmoebas(ctx);
      makeHomepage(ctx);
      return requestAnimationFrame(animate);
    }

    if (window.paused) {
      window.amoebas.forEach(amoeba => {
        amoeba.draw();
      });
      window.amoeboi.draw();

      makePause(ctx);
      // makeMargins(ctx);
      return requestAnimationFrame(animate);
    }

    moveAmoebas(ctx);

    makeMargins(ctx);
    makeMassDisplay(ctx);
    // makeClock(ctx);
    if (window.amoeboi.mass > 0) {
      window.boardFocus = {x: window.amoeboi.xpos, y: window.amoeboi.ypos};
      window.baseMass = window.amoeboi.mass;
      if (window.amoeboi.radius / window.realBoardWidth * 1000 * window.currentZoom > 75) {
        window.maxZoom = boundNum(75 / (window.amoeboi.radius / window.realBoardWidth * 1000), 1, window.absoluteMaxZoom);
        window.currentZoom = boundNum(window.currentZoom * 0.999, window.minZoom, window.maxZoom);
        window.boardHeight = window.realBoardHeight / window.currentZoom;
        window.boardWidth = window.realBoardWidth / window.currentZoom;
      }
      if (window.amoeboi.radius / window.realBoardWidth * 1000 * window.maxZoom < 75) {
        window.maxZoom = boundNum(75 / (window.amoeboi.radius / window.realBoardWidth * 1000), 1, window.absoluteMaxZoom);
      }
    } else {
      window.boardFocus['x'] += (window.boardFocus['x'] < window.realBoardWidth / 2) ? 10 : -10;
      window.boardFocus['y'] += (window.boardFocus['y'] < window.realBoardHeight / 2) ? 10 : -10;
      window.currentZoom = window.currentZoom > 1 ? window.currentZoom * 0.9 : window.currentZoom;
      window.boardHeight = window.realBoardHeight / window.currentZoom;
      window.boardWidth = window.realBoardWidth / window.currentZoom;
      window.baseMass = 0;
    }
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
});
