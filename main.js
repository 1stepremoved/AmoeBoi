import Amoeba from './amoeba.js';
import {boundNum} from './util';

window.momentumDelta = 1;
window.massDelta = 3000;
window.momentumMax = 10;
window.maxZoom = 2;
window.minZoom = 1;
window.currentZoom = window.minZoom;
window.realBoardHeight = 10000;
window.realBoardWidth = 10000;
window.boardFocus = {x: 5000, y: 5000};
window.timeCoefficient = 0.1;
window.baseMass = 50000;

document.addEventListener("DOMContentLoaded", () => {
  window.onresize = ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
      case 39:
        window.timeCoefficient = Math.min(window.timeCoefficient * 1.1, 10);
        return;
      case 37:
        window.timeCoefficient = Math.max(window.timeCoefficient * 0.9, 0.5);
        return;
      default:
        return;
    }
  });

  document.addEventListener("mousewheel", (e)=> {
    e.preventDefault();
    let zoomDelta = (e.deltaY / -1000);
    window.currentZoom = boundNum(window.currentZoom + zoomDelta, window.minZoom, window.maxZoom);
  });

  const canvas = document.getElementById("background");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let amoebas = [];
  for (let i = 0; i < 30; i++) {
    amoebas.push(new Amoeba(ctx));
  }
  // amoebas.push(new Amoeba(ctx, 4500, 5000, 100000, {x: 100000, y: 0}));
  // amoebas.push(new Amoeba(ctx, 5500, 5000, 10000, {x: -100000, y: 0}));
  // amoebas.push(new Amoeba(ctx, 5300, 5000, 100000, {x: -100000, y: 0}));
  let animate = () => {
    ctx.clearRect(0,0, innerWidth, innerHeight);
    amoebas = amoebas.filter(amoeba => {
      return amoeba.radius > 0;
    });
    amoebas.forEach(amoeba => {
      amoebas.forEach(amoeba2 =>{
        if (amoeba2 !== amoeba){
          amoeba.aabbCheck(amoeba2);
        }
      });
      amoeba.wallCollision();
    });
    ctx.globalAlpha = 0.8;
    amoebas.forEach(amoeba => {
      amoeba.move();
      amoeba.draw();
    });
    ctx.globalAlpha = 1;
    makeMargins(ctx);
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
});

const makeMargins = (ctx) => {
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = "black";
  let marginHeight = Math.floor(window.innerHeight / 8);
  let marginWidth = Math.floor(window.innerWidth / 8);
  ctx.fillRect(0,0, window.innerWidth, marginHeight);
  ctx.fillRect(0,  window.innerHeight - marginHeight, window.innerWidth, window.innerHeight);
  ctx.fillRect(0, marginHeight, marginWidth, window.innerHeight - (marginHeight * 2));
  ctx.fillRect(window.innerWidth - marginWidth, marginHeight, window.innerWidth, window.innerHeight - (marginHeight * 2));
  ctx.globalAlpha = 1;
};
