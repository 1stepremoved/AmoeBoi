import Amoeba from './amoeba.js';
import Amoeboi from './amoeboi.js';
import {boundNum, baseLog} from './util';


window.maxZoom = 4;
window.minZoom = 1;
window.currentZoom = window.maxZoom;
window.realBoardHeight = 20000;
window.realBoardWidth = 20000;
window.boardHeight = window.realBoardHeight / window.currentZoom;
window.boardWidth = window.realBoardWidth / window.currentZoom;
window.boardFocus = {x: 5000, y: 5000};
window.timeBase = 10;
window.timeCoefficient = .2;
window.clockAngle = 0;
window.baseMass = 50000;
window.mouseDownTime = null;
window.mouseDownInterval = null;
window.paused = false;

document.addEventListener("DOMContentLoaded", () => {
  window.onresize = ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener("mousedown", (e) => {
    if (window.paused) {
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
        if (window.paused) {return;}
        window.timeCoefficient = Math.min(window.timeCoefficient * 1.1, window.timeBase);
        return;
      case 37:
        if (window.paused) {return;}
        window.timeCoefficient = Math.max(window.timeCoefficient * 0.9, Math.pow(window.timeBase, - 1));
        return;
      case 32:
        window.paused = !window.paused;
        window.mouseDownTime = null;
        return;
      default:
        return;
    }
  });

  document.addEventListener("mousewheel", (e)=> {
    if (window.paused) {
      return;
    }
    e.preventDefault();
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

    window.amoebas = window.amoebas.filter(amoeba => {
      return amoeba.radius > 0;
    });
    window.amoebas.forEach(amoeba => {
      window.amoeboi.aabbCheck(amoeba);
      amoeba.aabbCheck(window.amoeboi);
      window.amoebas.forEach(amoeba2 =>{
        if (amoeba2 !== amoeba){
          amoeba.aabbCheck(amoeba2);
        }
      });
      amoeba.wallCollision();
    });
    window.amoeboi.wallCollision();
    ctx.globalAlpha = 0.8;
    window.amoebas.forEach(amoeba => {
      amoeba.move();
      amoeba.draw();
    });
    window.amoeboi.move();
    window.amoeboi.draw();
    ctx.globalAlpha = 1;

    makeMargins(ctx);
    makeMassDisplay(ctx);
    // makeClock(ctx);
    if (window.amoeboi.mass > 0) {
      window.boardFocus = {x: window.amoeboi.xpos, y: window.amoeboi.ypos};
      window.baseMass = window.amoeboi.mass;
      if (window.amoeboi.radius / window.realBoardWidth * 1000 * window.currentZoom > 75) {
        window.maxZoom = 75 / (window.amoeboi.radius / window.realBoardWidth * 1000);
        window.currentZoom = boundNum(window.currentZoom * 0.999, window.minZoom, window.maxZoom);
        window.boardHeight = window.realBoardHeight / window.currentZoom;
        window.boardWidth = window.realBoardWidth / window.currentZoom;
      }
      if (window.amoeboi.radius / window.realBoardWidth * 1000 * window.maxZoom < 75) {
        window.maxZoom = 75 / (window.amoeboi.radius / window.realBoardWidth * 1000);
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

const makePause = (ctx) => {

};

const makeClock = (ctx) => {
  ctx.globalAlpha = 0.5;

  ctx.beginPath();
  ctx.arc(120, 120, 65, 0, ((baseLog(window.timeBase, window.timeCoefficient) + 1) / 2 * Math.PI * 2));
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
  ctx.lineTo(120 + (60*Math.cos(window.clockAngle * Math.PI / 180)), 120 + (60*Math.sin(window.clockAngle * Math.PI / 180)));
  ctx.fillStyle = 'black';
  ctx.stroke();
  window.clockAngle = (window.clockAngle + (window.timeCoefficient)) % 360;
  ctx.globalAlpha = 1;
};

const makeGrid = (ctx) => {
  // let currentLineX = window.boardFocus['x'] - (window.boardWidth / 2);
  ctx.globalAlpha = 0.4;

  let interval = 500;
  let realX = 0;
  let topBorderY =  (((0 - window.boardFocus['y']) / (window.boardHeight / 2)) * 500) + (window.innerHeight / 2);
  let bottomBorderY =  (((window.realBoardHeight - window.boardFocus['y']) / (window.boardHeight / 2)) * 500) + (window.innerHeight / 2);
  while (realX <= window.realBoardWidth) {
    ctx.fillStyle = (realX ===window.realBoardWidth || realX === 0) ? "red" :"black";
    let lineX = (((realX - window.boardFocus['x']) / (window.boardWidth / 2)) * 500) + (window.innerWidth / 2);
    ctx.fillRect(lineX,topBorderY, 2, bottomBorderY - topBorderY);
    realX += interval;
  }

  let realY = 0;
  let leftBorderX = (((0 - window.boardFocus['x']) / (window.boardWidth / 2)) * 500) + (window.innerWidth / 2);
  let rightBorderX = (((window.realBoardWidth - window.boardFocus['x']) / (window.boardWidth / 2)) * 500) + (window.innerWidth / 2);
  while (realY <= window.realBoardHeight) {
    ctx.fillStyle = (realY ===window.realBoardHeight || realY === 0) ? "red" :"black";
    let lineY = (((realY - window.boardFocus['y']) / (window.boardHeight / 2)) * 500) + (window.innerHeight / 2);
    ctx.fillRect(leftBorderX,lineY, rightBorderX - leftBorderX, 2);
    realY += interval;
  }

  ctx.globalAlpha = 1;
};

const makeMassDisplay = (ctx) => {
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = 'black';
  ctx.fillRect(window.innerWidth - 300, 65, 130 + (20 * boundNum(Math.floor(Math.log10(window.amoeboi.mass / 100),1, 10000))), 50);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'white';
  ctx.font = '30px Georgia';
  ctx.fillText(`Mass: ${Math.floor(window.amoeboi.mass / 100) }`, window.innerWidth - 280, 100);
};

const makeMargins = (ctx) => {
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
  let time0to1 = (baseLog(window.timeBase, window.timeCoefficient) + 1) / 2;

  // let gradient = ctx.createLinearGradient(timebarX, timebarY, timebarX + timebarWidth, timebarY + timebarHeight);
  // gradient.addColorStop(0, "rgb(0,0,0)");
  // gradient.addColorStop(time0to1, "rgb(255,255,255)");
  // gradient.addColorStop(time0to1, "rgb(255,255,255)");
  // gradient.addColorStop(1, "rgb(0,0,0)");
  // let color = (baseLog(window.timeBase, window.timeCoefficient) + 1) / 2 * 255;
  // debugger
  // ctx.fillStyle = gradient;
  // ctx.fillStyle = `rgb(${255 - color},0,${color})`;
  ctx.fillStyle = `black`;
  ctx.fillRect(timebarX - 10, timebarY, timebarWidth + 20, timebarHeight);
  ctx.fillStyle = `white`;
  ctx.fillRect(timebarX + (timebarWidth * time0to1) - 10, timebarY, 20, timebarHeight);
  ctx.globalAlpha = 1;
};
