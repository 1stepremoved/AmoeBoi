import Game, {
  SET_UP_STATUS,
  RESET_STATUS,
  NEXT_LEVEL_STATUS,
  HOMEPAGE_STATUS,
  MOVING_TO_INSTRUCTIONS_STATUS,
  INSTRUCTIONS_STATUS,
  MOVING_TO_HOMEPAGE_STATUS,
  LOSE_SCREEN_STATUS,
  LOSE_SCREEN_TO_HOMEPAGE_STATUS,
  WIN_SCREEN_STATUS,
  PLAYING_STATUS,
  PAUSED_STATUS,
} from './game';
import Canvas from './canvas/canvas';
import { boundNum, baseLog } from './util';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = new Canvas('background');
  canvas.element.width = window.innerWidth;
  canvas.element.height = window.innerHeight;


  let audio = document.getElementById('audio');
  let game = new Game(30000, 30000, audio);

  audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10,game.timeVars.timeCoefficient)))) * 3.5);
  audio.volume = 0.5;


  window.onresize = ()=>{
    canvas.element.width = window.innerWidth;
    canvas.element.height = window.innerHeight;
  };

  window.addEventListener('click', (e) => {
    if (game.currentStatus === HOMEPAGE_STATUS) {
      let mouseOffsetX = game.mouseVars.mousePos.x / window.innerWidth * 50;
      let mouseOffsetY = game.mouseVars.mousePos.y / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + canvas.homepageYOffset;
      if (e.pageX > titlePosX - 40 && e.pageX < titlePosX + 40
       && e.pageY > titlePosY + 170 && e.pageY < titlePosY + 250) {
        window.location = 'https://github.com/1stepremoved';
      } else if (e.pageX > titlePosX + 180 && e.pageX < titlePosX + 252
        && e.pageY > titlePosY + 170 && e.pageY < titlePosY + 242) {
        window.location = 'https://linkedin.com/in/hamilton-sands';
      } else if (e.pageX > titlePosX + 380 && e.pageX < titlePosX + 468
        && e.pageY > titlePosY + 170 && e.pageY < titlePosY + 258) {
        window.location = 'https://1stepremoved.github.io/portfolio/';
      } else if (e.pageX > titlePosX + 75 && e.pageX < titlePosX + 365
        && e.pageY > titlePosY + 315 && e.pageY < titlePosY + 360) {
        game.currentStatus = MOVING_TO_INSTRUCTIONS_STATUS;
        document.body.style.cursor = 'default';
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
    } else if (game.currentStatus === INSTRUCTIONS_STATUS) {
      let mouseOffsetX = game.mouseVars.mousePos.x / window.innerWidth * 50;
      let mouseOffsetY = game.mouseVars.mousePos.y / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + canvas.homepageYOffset;
      if (e.pageX > titlePosX + 110 && e.pageX < titlePosX + 335
       && e.pageY > titlePosY + 805 && e.pageY < titlePosY + 850) {
        game.currentStatus = MOVING_TO_HOMEPAGE_STATUS;
        document.body.style.cursor = 'default';
      }
    }
  });

  window.addEventListener('touchstart', (e) => {
    if (game.currentStatus === PLAYING_STATUS) {
      clearInterval(game.mouseVars.mouseDownInterval);
      if (game.isPaused() || e.button === 2 || game.currentStatus !== PLAYING_STATUS) {
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

  window.addEventListener('touchmove', (e) => {
    if (game.currentStatus === PLAYING_STATUS) {
      game.mouseVars.mousePos.x = e.touches[0].pageX;
      game.mouseVars.mousePos.y = e.touches[0].pageY;
    }
  });

  window.addEventListener('touchend', (e) => {
    if (e.touches.length > 1) {
      return;
    }
    if (game.currentStatus === HOMEPAGE_STATUS) {
      game.currentStatus = SET_UP_STATUS;
      canvas.homepageYOffset = 0;
    } else if (game.currentStatus === LOSE_SCREEN_STATUS) {
      document.body.style.cursor = 'default';
      game.currentStatus = LOSE_SCREEN_TO_HOMEPAGE_STATUS;
    } else if (game.currentStatus === WIN_SCREEN_STATUS) {
      game.currentStatus = NEXT_LEVEL_STATUS;
    } else if (game.currentStatus === PLAYING_STATUS) {
      game.mouseVars.mouseDownTime = null;
      clearInterval(game.mouseVars.mouseDownInterval);
    }
  });

  window.addEventListener('mousedown', (e) => {
    clearInterval(game.mouseVars.mouseDownInterval);
    if (game.isPaused() || e.button === 2 || game.currentStatus !== PLAYING_STATUS) {
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

  window.addEventListener('mousemove', (e) => {
    if (game.currentStatus === HOMEPAGE_STATUS) {
      let mouseOffsetX = game.mouseVars.mousePos.x / window.innerWidth * 50;
      let mouseOffsetY = game.mouseVars.mousePos.y / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + canvas.homepageYOffset;
      if (e.pageX > titlePosX - 40 && e.pageX < titlePosX + 40
       && e.pageY > titlePosY + 170 && e.pageY < titlePosY + 250) {
        document.body.style.cursor = 'pointer';
      } else if (e.pageX > titlePosX + 180 && e.pageX < titlePosX + 252
        && e.pageY > titlePosY + 170 && e.pageY < titlePosY + 242) {
        document.body.style.cursor = 'pointer';
      } else if (e.pageX > titlePosX + 380 && e.pageX < titlePosX + 468
        && e.pageY > titlePosY + 170 && e.pageY < titlePosY + 258) {
        document.body.style.cursor = 'pointer';
      } else if (e.pageX > titlePosX + 75 && e.pageX < titlePosX + 365
        && e.pageY > titlePosY + 315 && e.pageY < titlePosY + 360) {
        document.body.style.cursor = 'pointer';
      }else if (e.pageX > titlePosX -5 && e.pageX < titlePosX + 45
        && e.pageY > titlePosY + 60 && e.pageY < titlePosY + 110) {
        document.body.style.cursor = 'pointer';
      } else if (e.pageX > titlePosX + 400 && e.pageX < titlePosX + 450
        && e.pageY > titlePosY + 60 && e.pageY < titlePosY + 110) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
      if (window.innerHeight - e.pageY < 30) {
        game.currentStatus = MOVING_TO_INSTRUCTIONS_STATUS;
      }
    } else if (game.currentStatus === INSTRUCTIONS_STATUS) {
      let mouseOffsetX = game.mouseVars.mousePos.x / window.innerWidth * 50;
      let mouseOffsetY = game.mouseVars.mousePos.y / window.innerHeight * 50;
      let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
      let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + canvas.homepageYOffset;

      if (e.pageX > titlePosX + 110 && e.pageX < titlePosX + 335
          && e.pageY > titlePosY + 805 && e.pageY < titlePosY + 850) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
      if (e.pageY < 30) {
        game.currentStatus = MOVING_TO_HOMEPAGE_STATUS;
      }
    } else if (game.currentStatus === PLAYING_STATUS && game.shiftDown) {
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

  window.addEventListener('mouseup', (e) => {
    game.mouseVars.mouseDownTime = null;
    clearInterval(game.mouseVars.mouseDownInterval);
  });

  window.addEventListener('keydown', (e) => {
    let rate;
    switch (e.keyCode) {
    case 39:
      if (game.isPaused() || game.currentStatus !== PLAYING_STATUS || game.autoscaleTime) { return; }
      game.timeVars.timeCoefficient = Math.min(game.timeVars.timeCoefficient * 1.1, game.timeVars.timeBase);
      audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10,game.timeVars.timeCoefficient)))) * 3.5);
      return;
    case 37:
      if (game.isPaused() || game.currentStatus !== PLAYING_STATUS || game.autoscaleTime) { return; }
      game.timeVars.timeCoefficient = Math.max(game.timeVars.timeCoefficient * 0.9, Math.pow(game.timeVars.timeBase, - 1));
      audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10,game.timeVars.timeCoefficient)))) * 3.5);
      return;
    case 65:
      if (game.isPaused() || game.currentStatus !== PLAYING_STATUS) { return; }
      game.autoscaleTime = !game.autoscaleTime;
      return;
    case 32:
      if (![PAUSED_STATUS, PLAYING_STATUS].includes(game.currentStatus)) {
        return;
      }
      game.currentStatus = game.isPaused() ? PLAYING_STATUS : PAUSED_STATUS;
      game.mouseVars.mouseDownTime = null;
      return;
    case 72:
      if (game.currentStatus === INSTRUCTIONS_STATUS) {
        document.body.style.cursor = 'default';
        game.currentStatus = MOVING_TO_HOMEPAGE_STATUS;
        return;
      } else if (game.currentStatus === LOSE_SCREEN_STATUS){
        document.body.style.cursor = 'default';
        game.currentStatus = LOSE_SCREEN_TO_HOMEPAGE_STATUS;
        return;
      }
      game.currentStatus = RESET_STATUS;
      return;
    case 73:
      canvas.showInstructions = !canvas.showInstructions;
      return;
    case 82:
      if (game.currentStatus === PLAYING_STATUS || game.currentStatus === LOSE_SCREEN_STATUS || game.currentStatus === WIN_SCREEN_STATUS)
        game.currentStatus = SET_UP_STATUS;
      return;
    case 13:
      if (game.currentStatus !== HOMEPAGE_STATUS && game.currentStatus !== INSTRUCTIONS_STATUS ) { return; }
      game.currentStatus = SET_UP_STATUS;
      canvas.homepageYOffset = 0;
      return;
    case 16:
      game.shiftDown = true;
      return;
    case 67:
      if (game.currentStatus === WIN_SCREEN_STATUS) {
        game.currentStatus = NEXT_LEVEL_STATUS;
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

  window.addEventListener('keyup', (e) => {
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

  let mousewheelevent = (/Firefox/i.test(navigator.userAgent)) ? 'wheel' : 'mousewheel';

  document.addEventListener(mousewheelevent, (e)=> {
    e.preventDefault();
    if (game.paused  || game.currentStatus !== PLAYING_STATUS) { return; }
    let zoomDelta = (e.deltaY / -1000);
    game.boardVars.currentZoom = boundNum(game.boardVars.currentZoom + zoomDelta, game.boardVars.minZoom, game.boardVars.maxZoom);
  });

  game.animate(canvas);
});
