import Game from './game';
import Canvas from './canvas';
import { boundNum, baseLog } from './util';

document.addEventListener("DOMContentLoaded", () => {
  const canvas = new Canvas('background');
  canvas.element.width = window.innerWidth;
  canvas.element.height = window.innerHeight;


  let audio = document.getElementById("audio");
  let game = new Game(30000, 30000, audio);

  audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10,game.timeVars.timeCoefficient)))) * 3.5);
  audio.volume = 0.5;


  window.onresize = ()=>{
    canvas.element.width = window.innerWidth;
    canvas.element.height = window.innerHeight;
  };

  window.addEventListener("click", (e) => {
    if (game.currentStatus === "homepage") {
      let mouseOffsetX = game.mouseVars.mousePos.x / window.innerWidth * 50;
      let mouseOffsetY = game.mouseVars.mousePos.y / window.innerHeight * 50;
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
      } else if (e.pageX > titlePosX -5 && e.pageX < titlePosX + 45
        && e.pageY > titlePosY + 60 && e.pageY < titlePosY + 110) {
          if (audio.volume === 0) {
            audio.volume = 0.5;
            game.muted = false;
          } else {
            audio.volume = 0;
            game.muted = true;
          }
      } else if (e.pageX > titlePosX + 400 && e.pageX < titlePosX + 450
        && e.pageY > titlePosY + 60 && e.pageY < titlePosY + 110) {
          if (audio.volume === 0) {
            audio.volume = 0.5;
            game.muted = false;
          } else {
            audio.volume = 0;
            game.muted = true;
          }
        }
    } else if (game.currentStatus === "instructions") {
      let mouseOffsetX = game.mouseVars.mousePos.x / window.innerWidth * 50;
      let mouseOffsetY = game.mouseVars.mousePos.y / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + game.homepageYOffset;
      if (e.pageX > titlePosX + 110 && e.pageX < titlePosX + 335
       && e.pageY > titlePosY + 805 && e.pageY < titlePosY + 850) {
         game.currentStatus = "movingToHomePage";
         document.body.style.cursor = "default";
      }
    }
  });

  window.addEventListener("touchstart", (e) => {
    if (game.currentStatus === "playing") {
      clearInterval(game.mouseVars.mouseDownInterval);
      if (game.paused || e.button === 2 || game.currentStatus !== "playing") {
        return;
      }
      game.mouseVars.mouseDownTime = Date.now();
      game.mouseVars.mousePos.x = e.touches[0].pageX;
      game.mouseVars.mousePos.y = e.touches[0].pageY;
      game.amoeboi.propel(e, game.amoebas, game.boardVars, game.mouseVars);
      game.mouseVars.mouseDownInterval = setInterval(() => {
        game.amoeboi.propel(e, game.amoebas, game.boardVars, game.mouseVars);
      }, 200);
    }
  });

  window.addEventListener("touchmove", (e) => {
    if (game.currentStatus === "playing") {
      game.mouseVars.mousePos.x = e.touches[0].pageX;
      game.mouseVars.mousePos.y = e.touches[0].pageY;
    }
  });

  window.addEventListener("touchend", (e) => {
    if (e.touches.length > 1) {
      return;
    }
    if (game.currentStatus === "homepage") {
      game.currentStatus = "setup";
      game.homepageYOffset = 0;
    } else if (game.currentStatus === "losescreen") {
      document.body.style.cursor = "default";
      game.currentStatus = "losescreenToHomePage";
    } else if (game.currentStatus === "winScreen") {
      game.currentStatus = "nextLevel";
    } else if (game.currentStatus === "playing") {
      game.mouseVars.mouseDownTime = null;
      clearInterval(game.mouseVars.mouseDownInterval);
    }
  });

  window.addEventListener("mousedown", (e) => {
    clearInterval(game.mouseVars.mouseDownInterval);
    if (game.paused || e.button === 2 || game.currentStatus !== "playing") {
      return;
    }
    game.mouseVars.mouseDownTime = Date.now();
    game.mouseVars.mousePos.x = e.pageX;
    game.mouseVars.mousePos.y = e.pageY;
    game.amoeboi.propel(e, game.amoebas, game.boardVars, game.mouseVars);
    game.mouseVars.mouseDownInterval = setInterval(() => {
      game.amoeboi.propel(e, game.amoebas, game.boardVars, game.mouseVars);
    }, 200);
  });

  window.addEventListener("mousemove", (e) => {
    if (game.currentStatus === "homepage") {
      let mouseOffsetX = game.mouseVars.mousePos.x / window.innerWidth * 50;
      let mouseOffsetY = game.mouseVars.mousePos.y / window.innerHeight * 50;
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
      }else if (e.pageX > titlePosX -5 && e.pageX < titlePosX + 45
        && e.pageY > titlePosY + 60 && e.pageY < titlePosY + 110) {
          document.body.style.cursor = "pointer";
      } else if (e.pageX > titlePosX + 400 && e.pageX < titlePosX + 450
        && e.pageY > titlePosY + 60 && e.pageY < titlePosY + 110) {
          document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
      if (window.innerHeight - e.pageY < 30) {
        game.currentStatus = "movingToInstructions";
      }
    } else if (game.currentStatus === "instructions") {
      let mouseOffsetX = game.mouseVars.mousePos.x / window.innerWidth * 50;
      let mouseOffsetY = game.mouseVars.mousePos.y / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + game.homepageYOffset;

      if (e.pageX > titlePosX + 110 && e.pageX < titlePosX + 335
          && e.pageY > titlePosY + 805 && e.pageY < titlePosY + 850) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
      if (e.pageY < 30) {
        game.currentStatus = "movingToHomePage";
      }
    } else if (game.currentStatus === "playing" && game.shiftDown) {
      game.mouseVars.mouseOffset.x = ((window.innerWidth / 2) - e.pageX) / 2;
      game.mouseVars.mouseOffset.y = ((window.innerHeight / 2) - e.pageY) / 2;
    }

    game.mouseVars.mousePos.x = e.pageX;
    game.mouseVars.mousePos.y = e.pageY;
    if (game.mouseVars.mouseDownTime) {
      game.mouseVars.mousePos.x = e.pageX;
      game.mouseVars.mousePos.y = e.pageY;
    }
  });

  window.addEventListener("mouseup", (e) => {
    game.mouseVars.mouseDownTime = null;
    clearInterval(game.mouseVars.mouseDownInterval);
  });

  window.addEventListener("keydown", (e) => {
    let rate;
    switch (e.keyCode) {
      case 39:
        if (game.paused || game.currentStatus !== "playing" || game.autoscaleTime) { return; }
        game.timeVars.timeCoefficient = Math.min(game.timeVars.timeCoefficient * 1.1, game.timeVars.timeBase);
        audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10,game.timeVars.timeCoefficient)))) * 3.5);
        return;
      case 37:
        if (game.paused || game.currentStatus !== "playing" || game.autoscaleTime) { return; }
        game.timeVars.timeCoefficient = Math.max(game.timeVars.timeCoefficient * 0.9, Math.pow(game.timeVars.timeBase, - 1));
        audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10,game.timeVars.timeCoefficient)))) * 3.5);
        return;
      case 65:
        if (game.paused || game.currentStatus !== "playing") { return; }
        game.autoscaleTime = !game.autoscaleTime;
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
        } else if (game.currentStatus === "losescreen"){
          document.body.style.cursor = "default";
          game.currentStatus = "losescreenToHomePage";
          return;
        }
        game.currentStatus = "reset";
        game.paused = false;
        return;
      case 73:
        game.showInstructions = !game.showInstructions;
        return;
      case 82:
        if (game.currentStatus === "playing" || game.currentStatus === "losescreen" || game.currentStatus === "winScreen")
        game.currentStatus = "setup";
        return;
      case 13:
        if (game.currentStatus !== "homepage" && game.currentStatus !== "instructions" ) { return; }
        game.currentStatus = "setup";
        game.homepageYOffset = 0;
        return;
      case 16:
        game.shiftDown = true;
        return;
      case 67:
        if (game.currentStatus === "winScreen") {
          game.currentStatus = "nextLevel";
        }
        return;
      case 77:
        if (audio.volume === 0) {
          audio.volume = 0.5;
          game.muted = false;
        } else {
          audio.volume = 0;
          game.muted = true;
        }
      default:
        return;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.keyCode) {
      case 16:
        game.mouseVars.mouseOffset.x = 0;
        game.mouseVars.mouseOffset.y = 0;
        game.shiftDown = false;
        return;
      default:
        return;
    }
  });

  let mousewheelevent = (/Firefox/i.test(navigator.userAgent)) ? "wheel" : "mousewheel";

  document.addEventListener(mousewheelevent, (e)=> {
    e.preventDefault();
    if (game.paused  || game.currentStatus !== "playing") { return; }
    let zoomDelta = (e.deltaY / -1000);
    game.boardVars.currentZoom = boundNum(game.boardVars.currentZoom + zoomDelta, game.boardVars.minZoom, game.boardVars.maxZoom);
    game.boardVars.boardHeight = game.boardVars.realBoardHeight / game.boardVars.currentZoom;
    game.boardVars.boardWidth = game.boardVars.realBoardWidth / game.boardVars.currentZoom;
  });

  game.animate(canvas);
});
