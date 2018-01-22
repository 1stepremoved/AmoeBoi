import {boundNum, baseLog} from './util';

export const makePause = (ctx) => {

};

export const makeClock = (ctx) => {
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

export const makeGrid = (ctx) => {
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

export const makeMassDisplay = (ctx) => {
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = 'black';
  ctx.fillRect(window.innerWidth - 300, 65, 130 + (15 * boundNum(Math.floor(Math.log10(window.amoeboi.mass / 100),1, 10000))), 50);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'white';
  ctx.font = '30px Impact';
  ctx.fillText(`Mass: ${Math.floor(window.amoeboi.mass / 100) }`, window.innerWidth - 280, 100);
};

export const makeMargins = (ctx) => {
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

export const moveAmoebas = (ctx) => {
  window.amoebas = window.amoebas.filter(amoeba => {
    return amoeba.radius > 0;
  });
  window.amoebas.forEach(amoeba => {
    window.amoeboi ? window.amoeboi.aabbCheck(amoeba) : null;
    window.amoeboi ? amoeba.aabbCheck(window.amoeboi) : null;
    window.amoebas.forEach(amoeba2 =>{
      if (amoeba2 !== amoeba){
        amoeba.aabbCheck(amoeba2);
      }
    });
    amoeba.wallCollision();
  });
  window.amoeboi ? window.amoeboi.wallCollision() : null;
  ctx.globalAlpha = 0.8;
  window.amoebas.forEach(amoeba => {
    amoeba.move();
    amoeba.draw();
  });
  window.amoeboi ? window.amoeboi.move() : null;
  window.amoeboi ? window.amoeboi.draw() : null;
  ctx.globalAlpha = 1;
};

export const makeHomepage = (ctx) => {
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  let mouseOffsetX = window.mousePos['x'] / window.innerWidth * 50;
  let mouseOffsetY = window.mousePos['y'] / window.innerHeight * 50;

  ctx.globalAlpha = 1;
  ctx.fillStyle = 'white';
  ctx.font = '120px Impact';
  let titlePosX = (window.innerWidth / 2) - 180 - mouseOffsetX;
  let titlePosY = (window.innerHeight / 2) - 40 - mouseOffsetY;
  ctx.fillText(`AmoeBoi`, titlePosX, titlePosY);

  // Object.keys(window.iconImages).forEach(key => {
  //   let image = window.iconImages[key];
  //   image.width = "100";
  //   image.height = "100";
  // });

  // window.iconImages.githubLogo.style = 'border-radius: 50%';

  ctx.drawImage(window.iconImages.githubLogo, titlePosX - 50, titlePosY + 150, 80, 80);
  ctx.drawImage(window.iconImages.linkedInLogo, titlePosX + 170, titlePosY + 150, 72, 72);
  ctx.drawImage(window.iconImages.folderIcon, titlePosX + 380, titlePosY + 150, 88, 88);
};
