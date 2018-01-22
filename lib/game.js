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

  let homepageWave = Math.sin(((Date.now() - window.homepageTime) % 1500) / 1500 * Math.PI);

  ctx.globalAlpha = 1;
  ctx.fillStyle = 'white';
  ctx.font = '120px Impact';
  let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
  let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + window.homepageYOffset;
  ctx.fillText(`AmoeBoi`, titlePosX, titlePosY);

  ctx.globalAlpha = 0.7;
  ctx.fillStyle = "rgb(0,0,50)";
  ctx.fillRect(titlePosX - 300, titlePosY + 885, 1050, 530);
  ctx.globalAlpha = 1;


  ctx.fillStyle = "rgb(240,240,240)";
  ctx.font = `${30 + (2 * homepageWave) }px Impact`;
  ctx.fillText(`PRESS ENTER TO START`, titlePosX + 85 - (5 * homepageWave), titlePosY + 100 + (2*homepageWave));

  ctx.font = '50px Impact';
  ctx.fillText(`INSTRUCTIONS`, titlePosX + 75, titlePosY + 360);

  ctx.fillText(`MAIN MENU`, titlePosX + 110, titlePosY + 850);

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

  ctx.drawImage(window.iconImages.githubLogo, titlePosX - 50, titlePosY + 170, 80, 80);
  ctx.drawImage(window.iconImages.linkedInLogo, titlePosX + 180, titlePosY + 170, 72, 72);
  ctx.drawImage(window.iconImages.folderIcon, titlePosX + 380, titlePosY + 170, 88, 88);
};
