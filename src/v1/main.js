import Game from './game';
import {
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
} from './constants';
import Canvas from './canvas/canvas';
import { boundNum, baseLog } from './util';


document.addEventListener('DOMContentLoaded', () => {
  const statusVars = {
    userInputStatus: undefined,
    status: undefined,
  };

  const canvas = new Canvas('background');
  canvas.element.width = window.innerWidth;
  canvas.element.height = window.innerHeight;


  let audio = document.getElementById('audio');
  let game = new Game(30000, 30000, audio);

  audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10,game.timeVars.timeCoefficient)))) * 3.5);
  audio.volume = 0.5;


  window.onresize = () => {
    canvas.element.width = window.innerWidth;
    canvas.element.height = window.innerHeight;
  };

  window.addEventListener('click', clickEventListener(game, canvas, statusVars, audio));

  window.addEventListener('touchstart', touchStartEventListener(game, statusVars));

  window.addEventListener('touchmove', touchMoveEventListener(game, statusVars));

  window.addEventListener('touchend', touchEndEventListener(game, canvas, statusVars));

  window.addEventListener('mousedown', mouseDownEventListener(game, statusVars));

  window.addEventListener('mousemove', mouseMoveEventListener(game, canvas, statusVars));

  window.addEventListener('mouseup', mouseUpEventListener(game));

  window.addEventListener('keydown', keyDownEventListener(game, canvas, statusVars, audio));

  window.addEventListener('keyup', keyUpEventListener(game));

  document.addEventListener('wheel', mouseWheelEventListener(game, statusVars)); //firefox

  document.addEventListener('mousewheel', mouseWheelEventListener(game, statusVars));

  const step = (prevStatus, canvas) => {
    game.animate(prevStatus, canvas);
    statusVars.status = statusVars.userInputStatus !== undefined ?
        statusVars.userInputStatus : game.determineNextStatus(prevStatus, canvas);
    if (statusVars.userInputStatus !== undefined) {
      statusVars.userInputStatus = undefined;
    }
    return requestAnimationFrame(() => step(statusVars.status, canvas));
  };

  requestAnimationFrame(() => step(RESET_STATUS, canvas));
});

const clickEventListener = (game, canvas, statusVars, audio) => (e) => {
  if (statusVars.status === HOMEPAGE_STATUS) {
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
      statusVars.userInputStatus = MOVING_TO_INSTRUCTIONS_STATUS;
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
  } else if (statusVars.status === INSTRUCTIONS_STATUS) {
    let mouseOffsetX = game.mouseVars.mousePos.x / window.innerWidth * 50;
    let mouseOffsetY = game.mouseVars.mousePos.y / window.innerHeight * 50;
    let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
    let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + canvas.homepageYOffset;
    if (e.pageX > titlePosX + 110 && e.pageX < titlePosX + 335
        && e.pageY > titlePosY + 805 && e.pageY < titlePosY + 850) {
      statusVars.userInputStatus = MOVING_TO_HOMEPAGE_STATUS;
      document.body.style.cursor = 'default';
    }
  }
};

const touchStartEventListener = (game, statusVars) => (e) => {
  if (statusVars.status === PLAYING_STATUS) {
    clearInterval(game.mouseVars.mouseDownInterval);
    if (statusVars.status === PAUSED_STATUS || e.button === 2 || statusVars.status !== PLAYING_STATUS) {
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
};

const touchMoveEventListener = (game, statusVars) => (e) => {
  if (statusVars.status === PLAYING_STATUS) {
    game.mouseVars.mousePos.x = e.touches[0].pageX;
    game.mouseVars.mousePos.y = e.touches[0].pageY;
  }
};

const touchEndEventListener = (game, canvas, statusVars) => (e) => {
  if (e.touches.length > 1) {
    return;
  }
  if (statusVars.status === HOMEPAGE_STATUS) {
    statusVars.statusVars.userInputStatus = SET_UP_STATUS;
    canvas.homepageYOffset = 0;
  } else if (statusVars.status === LOSE_SCREEN_STATUS) {
    document.body.style.cursor = 'default';
    statusVars.statusVars.userInputStatus = LOSE_SCREEN_TO_HOMEPAGE_STATUS;
  } else if (statusVars.status === WIN_SCREEN_STATUS) {
    statusVars.statusVars.userInputStatus = NEXT_LEVEL_STATUS;
  } else if (statusVars.status === PLAYING_STATUS) {
    game.mouseVars.mouseDownTime = null;
    clearInterval(game.mouseVars.mouseDownInterval);
  }
};

const mouseDownEventListener = (game, statusVars) => (e) => {
  clearInterval(game.mouseVars.mouseDownInterval);
  if (statusVars.status === PAUSED_STATUS || e.button === 2 || statusVars.status !== PLAYING_STATUS) {
    return;
  }
  game.mouseVars.mouseDownTime = Date.now();
  game.mouseVars.mousePos.x = e.pageX;
  game.mouseVars.mousePos.y = e.pageY;
  game.amoeboi.propel(e, game.amoebas, game.boardVars, game.mouseVars);
  game.mouseVars.mouseDownInterval = setInterval(() => {
    game.amoeboi.propel(e, game.amoebas, game.boardVars, game.mouseVars);
  }, 200);
};

const mouseMoveEventListener = (game, canvas, statusVars) => (e) => {
  if (statusVars.status === HOMEPAGE_STATUS) {
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
      statusVars.userInputStatus = MOVING_TO_INSTRUCTIONS_STATUS;
    }
  } else if (statusVars.status === INSTRUCTIONS_STATUS) {
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
      statusVars.userInputStatus = MOVING_TO_HOMEPAGE_STATUS;
    }
  } else if (statusVars.status === PLAYING_STATUS && game.shiftDown) {
    game.mouseVars.mouseOffset.x = ((window.innerWidth / 2) - e.pageX) / 2;
    game.mouseVars.mouseOffset.y = ((window.innerHeight / 2) - e.pageY) / 2;
  }

  game.mouseVars.mousePos.x = e.pageX;
  game.mouseVars.mousePos.y = e.pageY;
  if (game.mouseVars.mouseDownTime) {
    game.mouseVars.mousePos.x = e.pageX;
    game.mouseVars.mousePos.y = e.pageY;
  }
};

const mouseUpEventListener = (game) => () => {
  game.mouseVars.mouseDownTime = null;
  clearInterval(game.mouseVars.mouseDownInterval);
};

const keyDownEventListener = (game, canvas, statusVars, audio) => e => {
  switch (e.keyCode) {
    case 39: // right-arrow
      if (statusVars.status === PAUSED_STATUS || statusVars.status !== PLAYING_STATUS || game.autoscaleTime) { return; }
      game.timeVars.timeCoefficient = Math.min(game.timeVars.timeCoefficient * 1.1, game.timeVars.timeBase);
      audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10,game.timeVars.timeCoefficient)))) * 3.5);
      return;
    case 37: // left-arrow
      if (statusVars.status === PAUSED_STATUS || statusVars.status !== PLAYING_STATUS || game.autoscaleTime) { return; }
      game.timeVars.timeCoefficient = Math.max(game.timeVars.timeCoefficient * 0.9, Math.pow(game.timeVars.timeBase, - 1));
      audio.playbackRate = 0.5 + ((1 / (1 + Math.pow(Math.E, -10 * baseLog(10,game.timeVars.timeCoefficient)))) * 3.5);
      return;
    case 65: // a
      if (statusVars.status === PAUSED_STATUS || statusVars.status !== PLAYING_STATUS) { return; }
      game.autoscaleTime = !game.autoscaleTime;
      return;
    case 32: // space
      if (![PAUSED_STATUS, PLAYING_STATUS].includes(status)) {
        return;
      }
      statusVars.userInputStatus = statusVars.status === PAUSED_STATUS ? PLAYING_STATUS : PAUSED_STATUS;
      game.mouseVars.mouseDownTime = null;
      return;
    case 72: //h
      if (statusVars.status === INSTRUCTIONS_STATUS) {
        document.body.style.cursor = 'default';
        statusVars.userInputStatus = MOVING_TO_HOMEPAGE_STATUS;
        return;
      } else if (statusVars.status === LOSE_SCREEN_STATUS){
        document.body.style.cursor = 'default';
        statusVars.userInputStatus = LOSE_SCREEN_TO_HOMEPAGE_STATUS;
        return;
      }
      statusVars.userInputStatus = RESET_STATUS;
      return;
    case 73: // i
      canvas.showInstructions = !canvas.showInstructions;
      return;
    case 82: // r
      if (statusVars.status === PLAYING_STATUS || statusVars.status === LOSE_SCREEN_STATUS || statusVars.status === WIN_SCREEN_STATUS)
        statusVars.userInputStatus = SET_UP_STATUS;
      return;
    case 13: // enter
      if (statusVars.status !== HOMEPAGE_STATUS && statusVars.status !== INSTRUCTIONS_STATUS ) { return; }
      statusVars.userInputStatus = SET_UP_STATUS;
      canvas.homepageYOffset = 0;
      return;
    case 16: // shift
      game.shiftDown = true;
      return;
    case 67: // c
      if (statusVars.status === WIN_SCREEN_STATUS) {
        statusVars.userInputStatus = NEXT_LEVEL_STATUS;
      }
      return;
    case 77: // m
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
};

const keyUpEventListener = (game) => e => {
  switch (e.keyCode) {
    case 16:
      game.mouseVars.mouseOffset.x = 0;
      game.mouseVars.mouseOffset.y = 0;
      game.shiftDown = false;
      return;
    default:
      return;
  }
};

const mouseWheelEventListener = (game, statusVars) => (e) => {
  e.preventDefault();
  if (statusVars.status === PAUSED_STATUS || statusVars.userInputStatus !== PLAYING_STATUS) {
    return;
  }
  const zoomDelta = (e.deltaY / -1000);
  game.boardVars.currentZoom = boundNum(game.boardVars.currentZoom + zoomDelta, game.boardVars.minZoom, game.boardVars.maxZoom);
};