import Game from './game';

import Amoeba from './amoeba.js';
import Amoeboi from './amoeboi.js';
import {boundNum, baseLog, transitionVar} from './util';
// import {moveAmoebas, makePause, makeGrid, makeClock,
//         makeMargins, makeMassDisplay, makeHomepage} from './game';


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("background");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let game = new Game(ctx, 30000, 30000);

  window.onresize = ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener("click", (e) => {
    if (game.currentStatus === "homepage") {
      let mouseOffsetX = game.mousePos['x'] / window.innerWidth * 50;
      let mouseOffsetY = game.mousePos['y'] / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + game.homepageYOffset;
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
          game.currentStatus = "movingToInstructions";
          document.body.style.cursor = "default";
      }
    } else if (game.currentStatus === "instructions") {
      let mouseOffsetX = game.mousePos['x'] / window.innerWidth * 50;
      let mouseOffsetY = game.mousePos['y'] / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + game.homepageYOffset;
      if (e.pageX > titlePosX + 110 && e.pageX < titlePosX + 335
       && e.pageY > titlePosY + 805 && e.pageY < titlePosY + 850) {
         game.currentStatus = "movingToHomePage";
         document.body.style.cursor = "default";
      }
    }
  });

  window.addEventListener("mousedown", (e) => {
    if (game.paused || game.currentStatus !== "playing") {
      return;
    }
    game.mouseVars.mouseDownTime = Date.now();
    game.amoeboi.mousePosX = e.pageX;
    game.amoeboi.mousePosY = e.pageY;
    game.amoeboi.propel(e,game.amoebas);
    game.mouseDownInterval = setInterval(() => {
      game.amoeboi.propel(e,game.amoebas);
    }, 200);
  });

  window.addEventListener("mousemove", (e) => {
    if (game.currentStatus === "homepage") {
      let mouseOffsetX = game.mousePos['x'] / window.innerWidth * 50;
      let mouseOffsetY = game.mousePos['y'] / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + game.homepageYOffset;
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
    } else if (game.currentStatus === "instructions") {
      let mouseOffsetX = game.mousePos['x'] / window.innerWidth * 50;
      let mouseOffsetY = game.mousePos['y'] / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + game.homepageYOffset;

        if (e.pageX > titlePosX + 110 && e.pageX < titlePosX + 335
            && e.pageY > titlePosY + 805 && e.pageY < titlePosY + 850) {
          document.body.style.cursor = "pointer";
        } else {
          document.body.style.cursor = "default";
        }
    } else if (game.currentStatus === "playing" && game.shiftDown) {
      game.mouseVars.mouseOffset['x'] = ((window.innerWidth / 2) - e.pageX) / 2;
      game.mouseVars.mouseOffset['y'] = ((window.innerHeight / 2) - e.pageY) / 2;
    }

    game.mousePos['x'] = e.pageX;
    game.mousePos['y'] = e.pageY;
    if (game.mouseVars.mouseDownTime) {
      game.amoeboi.mousePosX = e.pageX;
      game.amoeboi.mousePosY = e.pageY;
    }
  });

  window.addEventListener("mouseup", (e) => {
    game.mouseVars.mouseDownTime = null;
    clearInterval(game.mouseDownInterval);
  });

  window.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
      case 39:
        if (game.paused || game.currentStatus !== "playing") { return; }
        game.timeVars.timeCoefficient = Math.min(game.timeVars.timeCoefficient * 1.1, game.timeVars.timeBase);
        return;
      case 37:
        if (game.paused || game.currentStatus !== "playing") { return; }
        game.timeVars.timeCoefficient = Math.max(game.timeVars.timeCoefficient * 0.9, Math.pow(game.timeVars.timeBase, - 1));
        return;
      case 32:
        if (game.currentStatus !== "playing") { return; }
        game.paused = !game.paused;
        game.mouseVars.mouseDownTime = null;
        return;
      case 72:
        if (game.currentStatus === "instructions") {
          document.body.style.cursor = "default";
          game.currentStatus = "movingToHomePage";
          return;
        }
        game.currentStatus = "reset";
        game.paused = false;
        return;
      case 13:
        game.homepageTime = null;
        if (game.currentStatus !== "homepage") { return; }
        game.currentStatus = "setup";
        return;
      case 16:
        game.shiftDown = true;
        return;
      default:
        return;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.keyCode) {
      case 16:
        game.mouseVars.mouseOffset['x'] = 0;
        game.mouseVars.mouseOffset['y'] = 0;
        game.shiftDown = false;
        return;
      default:
        return;
    }
  });

  document.addEventListener("mousewheel", (e)=> {
    e.preventDefault();
    if (game.paused  || game.currentStatus !== "playing") { return; }
    let zoomDelta = (e.deltaY / -1000);
    game.boardVars.currentZoom = boundNum(game.boardVars.currentZoom + zoomDelta, game.boardVars.minZoom, game.boardVars.maxZoom);
    game.boardVars.boardHeight = game.boardVars.realBoardHeight / game.boardVars.currentZoom;
    game.boardVars.boardWidth = game.boardVars.realBoardWidth / game.boardVars.currentZoom;
  });

  // amoebas.push(new Amoeba(ctx, 4500, 5000, 100000, {x: 100000, y: 0}));
  // amoebas.push(new Amoeba(ctx, 5500, 5000, 300000, {x: -100000, y: 0}));
  // amoebas.push(new Amoeba(ctx, 5300, 5000, 100000, {x: -100000, y: 0}));

  game.animate();
});
