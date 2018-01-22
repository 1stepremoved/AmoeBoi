import Amoeba from './amoeba.js';
import Amoeboi from './amoeboi.js';
import {boundNum, baseLog, transitionVar} from './util';
import {moveAmoebas, makePause, makeGrid, makeClock,
        makeMargins, makeMassDisplay, makeHomescreen} from './game';


window.maxZoom = 4;
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
window.status = "playing";
window.mousePos= {x: 0, y: 0}
document.addEventListener("DOMContentLoaded", () => {
  window.onresize = ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener("mousedown", (e) => {
    if (window.paused || window.status !== "playing") {
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
        if (window.paused || window.status !== "playing") { return; }
        window.timeCoefficient = Math.min(window.timeCoefficient * 1.1, window.timeBase);
        return;
      case 37:
        if (window.paused || window.status !== "playing") { return; }
        window.timeCoefficient = Math.max(window.timeCoefficient * 0.9, Math.pow(window.timeBase, - 1));
        return;
      case 32:
        if (window.status !== "playing") { return; }
        window.paused = !window.paused;
        window.mouseDownTime = null;
        return;
      case 72:
        window.status = "reset";
        window.paused = false;
        return;
      default:
        return;
    }
  });

  document.addEventListener("mousewheel", (e)=> {
    e.preventDefault();
    if (window.paused  || window.status !== "playing") { return; }
    let zoomDelta = (e.deltaY / -1000);
    window.currentZoom = boundNum(window.currentZoom + zoomDelta, window.minZoom, window.maxZoom);
    window.boardHeight = window.realBoardHeight / window.currentZoom;
    window.boardWidth = window.realBoardWidth / window.currentZoom;
  });

  const canvas = document.getElementById("background");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.amoebas = [];
  window.amoeboi = new Amoeboi(ctx, window.realBoardWidth / 2, window.realBoardHeight / 2, 100000, {x: 100000, y: 0});
  for (let i = 0; i < 400; i++) {
    window.amoebas.push(new Amoeba(ctx));
  }
  // amoebas.push(new Amoeba(ctx, 4500, 5000, 100000, {x: 100000, y: 0}));
  // amoebas.push(new Amoeba(ctx, 5500, 5000, 300000, {x: -100000, y: 0}));
  // amoebas.push(new Amoeba(ctx, 5300, 5000, 100000, {x: -100000, y: 0}));
  let animate = () => {
    ctx.clearRect(0,0, innerWidth, innerHeight);
    makeGrid(ctx);

    if (window.status === "reset") {
      window.maxZoom = 4;
      window.currentZoom = 2;
      window.boardHeight = window.realBoardHeight / window.currentZoom;
      window.boardWidth = window.realBoardWidth / window.currentZoom;
      window.baseMass = 50000;
      window.amoeboi = null;
      window.amoebas = [];
      for (let i = 0; i < 400; i++) {
        window.amoebas.push(new Amoeba(ctx));
      }
      window.boardFocus = {x: window.realBoardWidth / 2, y: window.realBoardHeight / 2};
      window.status = "homescreen";
      return requestAnimationFrame(animate);
    }

    if (window.status === "homescreen") {
      moveAmoebas(ctx);
      makeHomescreen(ctx);
      return requestAnimationFrame(animate);
    }

    if (window.paused) {
      window.amoebas.forEach(amoeba => {
        amoeba.draw();
      });
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "black";
      ctx.fillRect(0,0, innerWidth, innerHeight);
      window.amoeboi.draw();
      makeMargins(ctx);
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
        window.maxZoom = boundNum(75 / (window.amoeboi.radius / window.realBoardWidth * 1000), 1, 4);
        window.currentZoom = boundNum(window.currentZoom * 0.999, window.minZoom, window.maxZoom);
        window.boardHeight = window.realBoardHeight / window.currentZoom;
        window.boardWidth = window.realBoardWidth / window.currentZoom;
      }
      if (window.amoeboi.radius / window.realBoardWidth * 1000 * window.maxZoom < 75) {
        window.maxZoom = boundNum(75 / (window.amoeboi.radius / window.realBoardWidth * 1000), 1, 4);
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
