/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const boundNum = (num, min, max) => {
  if (num > max) {
    return max;
  } else if (num < min) {
    return min;
  } else {
    return num;
  }
};
/* harmony export (immutable) */ __webpack_exports__["b"] = boundNum;


const baseLog = (x, y) => {
  return Math.log(y) / Math.log(x);
};
/* harmony export (immutable) */ __webpack_exports__["a"] = baseLog;


const transitionVar = (variable, start, stop, rate = .01) => {
  const isGoingUp = (start < stop);
  const transitionRate = (isGoingUp) ? 1 + rate : 1 - rate;
  if ((isGoingUp && start > stop * .99) || (!isGoingUp && start < stop * 1.01)) {
    return variable;
  } else {
    return variable * transitionRate;
  }
};
/* unused harmony export transitionVar */



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);


class Amoeba {
  constructor(ctx, x, y, mass, momentum) {
    this.ctx = ctx;
    this.mass = mass || Math.floor((Math.random() * 100000) + 10000);
    this.radius = Math.sqrt(this.mass / (Math.PI));
    this.xpos = x || Math.floor(Math.random() * (this.boardVars.realBoardWidth - this.radius)) + this.radius;
    this.ypos = y || Math.floor(Math.random() * (this.boardVars.realBoardHeight - this.radius)) + this.radius;
    this.momentum = momentum || {x: Math.floor(Math.random() * 1000000) - 500000, y: Math.floor(Math.random() * 1000000) - 500000};
    this.nextMomentum = Object.assign({}, this.momentum);
    this.draw = this.draw.bind(this);
    this.collision = this.collision.bind(this);
    this.adjustRadius = this.adjustRadius.bind(this);
    this.colorize = this.colorize.bind(this);
    this.relativePos = this.relativePos.bind(this);
    this.color = "blue";
  }

  move() {
    this.momentum = Object.assign({}, this.nextMomentum);
    let xDelta = this.momentum['x'] / this.mass;
    let yDelta = this.momentum['y'] / this.mass;
    // xDelta = (xDelta > this.momentumMax) ? Math.abs(xDelta) / xDelta * this.momentumMax : xDelta;
    // yDelta = (yDelta > this.momentumMax) ? Math.abs(yDelta) / yDelta * this.momentumMax : yDelta;
    this.xpos += xDelta * this.timeVars.timeCoefficient;
    this.ypos += yDelta * this.timeVars.timeCoefficient;
    // this.xpos += boundNum(xDelta * this.timeVars.timeCoefficient, -10, 10);
    // this.ypos += boundNum(yDelta * this.timeVars.timeCoefficient, -10, 10);
  }

  adjustRadius() {
    this.radius = Math.sqrt(this.mass / (Math.PI));
  }

  aabbCheck(amoeba) {
    if (amoeba.xpos + amoeba.radius + this.radius > this.xpos
     && amoeba.xpos < this.xpos + this.radius + amoeba.radius
     && amoeba.ypos + amoeba.radius + this.radius > this.ypos
     && amoeba.ypos < this.ypos + this.radius + amoeba.radius) {
      this.collision(amoeba);
     }
}

  collision(amoeba) {
    let distance = this.radius + amoeba.radius;
    let currentDistance = Math.sqrt(
      Math.pow(this.xpos - amoeba.xpos ,2)  + Math.pow(this.ypos - amoeba.ypos ,2)
    );
    if (distance > currentDistance){

      this.nextMomentum['x'] += Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(amoeba.momentum['x']
        * amoeba.mass * (currentDistance / distance) * this.timeVars.timeCoefficient, -50, 50);
      amoeba.nextMomentum['x'] = amoeba.nextMomentum['x']
        * Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(amoeba.mass / this.mass, .99, 1);
      this.nextMomentum['y'] += Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(amoeba.momentum['y']
        * amoeba.mass * (currentDistance / distance) * this.timeVars.timeCoefficient, -50, 50);
      amoeba.nextMomentum['y'] = amoeba.nextMomentum['y']
        * Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(amoeba.mass / this.mass, .99, 1);

      if (this.mass <= amoeba.mass) {
        if ((currentDistance - amoeba.radius) / this.radius < 0 || this.mass < 100) {
          amoeba.mass += this.mass;
          this.mass = 0;
          amoeba.nextMomentum['x'] += this.nextMomentum['x'];
          amoeba.nextMomentum['y'] += this.nextMomentum['y'];
          return;
        }

        let bubble = this.massDelta * this.mass
            * Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])( (this.radius - (currentDistance - amoeba.radius)) / this.radius, .1, 1)
            * this.timeVars.timeCoefficient;

        this.mass -= bubble;
        amoeba.mass += bubble;
      }
    }
  }



  wallCollision() {
    if (this.xpos + this.radius >= this.boardVars.realBoardWidth) {
      this.nextMomentum['x'] = -1 * this.momentum['x'];
      this.xpos = this.boardVars.realBoardWidth - this.radius - 1;
    } else if (this.xpos - this.radius <= 0) {
      this.nextMomentum['x'] = -1 * this.momentum['x'];
      this.xpos = 0 + this.radius + 1;
    }
    if (this.ypos + this.radius >= this.boardVars.realBoardHeight) {
      this.nextMomentum['y'] = -1 * this.momentum['y'];
      this.ypos = this.boardVars.realBoardHeight - this.radius - 1;
    } else if (this.ypos - this.radius <= 0) {
      this.nextMomentum['y'] = -1 * this.momentum['y'];
      this.ypos = 0 + this.radius + 1;
    }
  }

  colorize(relativeX, relativeY, relativeRadius) {
    if (this.mass <= 0) {
      return;
    }
    let gradient = this.ctx.createRadialGradient(relativeX, relativeY,relativeRadius, relativeX, relativeY, 0);
    if (this.mass < this.boardVars.baseMass) {
      gradient.addColorStop(0, `rgb(${20}, ${20}, ${255})`);
      gradient.addColorStop(Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(1 - (this.mass / this.boardVars.baseMass),0, 1) , `rgb(${50}, ${20}, ${200})`);
      gradient.addColorStop(1 , `rgb(${255}, ${20}, ${20})`);
    } else {
      gradient.addColorStop(0, `rgb(${255}, ${20}, ${20})`);
      gradient.addColorStop(Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(1 -(this.boardVars.baseMass / this.mass), 0, 1) , `rgb(${200}, ${20}, ${50})` );
      gradient.addColorStop(1 , `rgb(${20}, ${20}, ${255})`);
    }
    return gradient;
  }

  relativePos() {
    let relativeX = (((this.xpos - this.boardVars.boardFocus['x']) / (this.boardVars.boardWidth / 2)) * 500)
                       + (window.innerWidth / 2) + this.mouseVars.mouseOffset['x'];
    let relativeY = (((this.ypos - this.boardVars.boardFocus['y']) / (this.boardVars.boardHeight/ 2)) * 500)
                       + (window.innerHeight / 2) + this.mouseVars.mouseOffset['y'];
    return {x: relativeX, y: relativeY};
  }

  draw() {
    if (this.mass <= 0) {
      return;
    }
    this.adjustRadius();

    let relativeCoors = this.relativePos();

    let relativeRadius = this.radius / this.boardVars.realBoardWidth * 1000 * this.boardVars.currentZoom;
    //radius cannot be kept proportional to window.innerWidth, it will throw of there size on screen

    let gradient = this.colorize(relativeCoors['x'], relativeCoors['y'],relativeRadius);

    this.ctx.beginPath();
    this.ctx.arc(relativeCoors['x'], relativeCoors['y'], relativeRadius, 0, Math.PI * 2);
    this.ctx.fillStyle=gradient;
    this.ctx.fill();
  }
}

Amoeba.prototype.momentumDelta = 1;
Amoeba.prototype.massDelta =  1 / 2;
Amoeba.prototype.momentumMax = 10;

/* harmony default export */ __webpack_exports__["a"] = (Amoeba);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__amoeba__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(0);



class Amoeboi extends __WEBPACK_IMPORTED_MODULE_0__amoeba__["a" /* default */] {
  constructor(ctx, x, y, mass, momentum) {
    super(ctx, x, y, mass, momentum);
    this.mousePosX = null;
    this.mousePosY = null;
  }

  colorize(relativeX, relativeY, relativeRadius) {
    if (this.mass <= 0) {
      return;
    }
    let gradient = this.ctx.createRadialGradient(relativeX, relativeY,relativeRadius, relativeX, relativeY, 0);
    gradient.addColorStop(0, `rgb(${0}, ${255}, ${0})`);
    gradient.addColorStop(1, `rgb(${0}, ${150}, ${0})`);
    return gradient;
  }

  propel(e, amoebas) {
    if (this.mass <= 0) {
      return;
    }
    let diffX = this.mousePosX - (window.innerWidth / 2);
    let diffY = this.mousePosY - (window.innerHeight / 2);
    let angle = Math.atan2(diffY, diffX);
    let dirX = Math.cos(angle);
    let dirY = Math.sin(angle);

    let mass = this.mass * Object(__WEBPACK_IMPORTED_MODULE_1__util__["b" /* boundNum */])(((Date.now() - this.mouseVars.mouseDownTime) / 30000), .01, .1);
    this.mass -= mass;
    let radius = Math.sqrt(mass / (Math.PI));
    let xpos = this.xpos + (dirX * this.radius) + ((dirX > 0 ) ? radius : -1 * radius);
    let ypos = this.ypos + (dirY * this.radius) + ((dirY > 0 ) ? radius : -1 * radius);
    let momentum = {x: mass * 50 * dirX * 2, y: mass * 50 * dirY * 2};
    amoebas.push(new __WEBPACK_IMPORTED_MODULE_0__amoeba__["a" /* default */](this.ctx, xpos, ypos, mass, momentum));
    this.nextMomentum['x'] += momentum['x'] * -1 * 3;
    this.nextMomentum['y'] += momentum['y'] * -1 * 3;
    // debugger
    let distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2) );
    // debugger
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Amoeboi);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__amoeba_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__amoeboi_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(0);





// import {moveAmoebas, makePause, makeGrid, makeClock,
//         makeMargins, makeMassDisplay, makeHomepage} from './game';


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("background");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let game = new __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */](ctx, 30000, 30000);

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
    game.boardVars.currentZoom = Object(__WEBPACK_IMPORTED_MODULE_3__util__["b" /* boundNum */])(game.boardVars.currentZoom + zoomDelta, game.boardVars.minZoom, game.boardVars.maxZoom);
    game.boardVars.boardHeight = game.boardVars.realBoardHeight / game.boardVars.currentZoom;
    game.boardVars.boardWidth = game.boardVars.realBoardWidth / game.boardVars.currentZoom;
  });

  // amoebas.push(new Amoeba(ctx, 4500, 5000, 100000, {x: 100000, y: 0}));
  // amoebas.push(new Amoeba(ctx, 5500, 5000, 300000, {x: -100000, y: 0}));
  // amoebas.push(new Amoeba(ctx, 5300, 5000, 100000, {x: -100000, y: 0}));

  game.animate();
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__amoeba_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__amoeboi_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__quadtree_js__ = __webpack_require__(5);





class Game {
  constructor(ctx, realBoardWidth=20000, realBoardHeight=20000) {
    this.ctx = ctx;

    this.setupImages();
    this.setupProportions(realBoardWidth, realBoardHeight);
    this.setupTime();
    this.setupMouse();

    this.homepageClock = null;
    this.clockAngle = 0;
    this.mouseDownTime = null;
    this.mouseDownInterval = null;
    this.paused = false;
    this.currentStatus = "reset";
    this.homepageYOffset = 0;
    this.homepageTime = null;
    this.mousePos = {x: 0, y: 0};
    this.shiftDown = false;

    this.animate = this.animate.bind(this);
    this.moveAmoebas = this.moveAmoebas.bind(this);
    this.makePause = this.makePause.bind(this);
    this.makeClock = this.makeClock.bind(this);
    this.makeGrid = this.makeGrid.bind(this);
    this.makeMassDisplay = this.makeMassDisplay.bind(this);
    this.makeMargins = this.makeMargins.bind(this);
    this.makeHomepage = this.makeHomepage.bind(this);
  }

  setupMouse() {
    this.mouseVars = {};
    this.mouseVars.mouseDownTime = null;
    this.mouseVars.mouseOffset = {x: 0, y: 0};

    __WEBPACK_IMPORTED_MODULE_1__amoeba_js__["a" /* default */].prototype.mouseVars = this.mouseVars;
  }

  setupTime() {
    this.timeVars = {};
    this.timeVars.timeBase = 10;
    this.timeVars.timeCoefficient = .2;

    __WEBPACK_IMPORTED_MODULE_1__amoeba_js__["a" /* default */].prototype.timeVars = this.timeVars;
  }

  setupProportions(realBoardWidth, realBoardHeight) {
    this.boardVars = {};
    this.boardVars.realBoardWidth = realBoardWidth;
    this.boardVars.realBoardHeight = realBoardHeight;
    this.boardVars.baseMass = 50000;
    this.boardVars.maxZoom = 8;
    this.boardVars.absoluteMaxZoom = 8;
    this.boardVars.minZoom = 0.7;
    this.boardVars.currentZoom = this.boardVars.maxZoom;
    this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
    this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
    this.boardVars.boardFocus = {x: this.boardVars.realBoardWidth / 2, y: this.boardVars.realBoardHeight / 2};

    __WEBPACK_IMPORTED_MODULE_1__amoeba_js__["a" /* default */].prototype.boardVars = this.boardVars;
  }

  setupImages() {
    this.iconImages = {};
    this.iconImages.githubLogo = new Image();
    this.iconImages.githubLogo.src = './assets/images/githubLogo.png';
    this.iconImages.linkedInLogo = new Image();
    this.iconImages.linkedInLogo.src = './assets/images/linkedInLogo.png';
    this.iconImages.folderIcon = new Image();
    this.iconImages.folderIcon.src = './assets/images/folderIcon.png';
  }

  setupAmoebas(amoeboi) {
    this.amoebas = [];
    this.amoeboi = !amoeboi ? null : new __WEBPACK_IMPORTED_MODULE_2__amoeboi_js__["a" /* default */](this.ctx, this.boardVars.realBoardWidth / 2,
                                                 this.boardVars.realBoardHeight / 2,
                                                 100000, {x: 0, y: 0});
    this.quadTree = new __WEBPACK_IMPORTED_MODULE_3__quadtree_js__["a" /* default */](0,0, this.boardVars.realBoardWidth, this.boardVars.realBoardHeight);
    let mass, radius, xpos, ypos, momentum;
    for (let i = 0; i < 2; i++) {
      mass = Math.floor((Math.random() * 40000000) + 10000000);
      radius = Math.sqrt(mass / (Math.PI));
      xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
      ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      momentum = {x: Math.floor(Math.random() * 1000000) - 500000, y: Math.floor(Math.random() * 1000000) - 500000};
      this.amoebas.push(new __WEBPACK_IMPORTED_MODULE_1__amoeba_js__["a" /* default */](this.ctx, xpos, ypos, mass));
    }
    for (let i = 0; i < 20; i++) {
      mass = Math.floor((Math.random() * 4000000) + 1000000);
      radius = Math.sqrt(mass / (Math.PI));
      xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
      ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      momentum = {x: Math.floor(Math.random() * 1000000) - 500000, y: Math.floor(Math.random() * 1000000) - 500000};
      this.amoebas.push(new __WEBPACK_IMPORTED_MODULE_1__amoeba_js__["a" /* default */](this.ctx, xpos, ypos, mass));
    }
    for (let i = 0; i < 180; i++) {
      mass = Math.floor((Math.random() * 400000) + 100000);
      radius = Math.sqrt(mass / (Math.PI));
      xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
      ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      momentum = {x: Math.floor(Math.random() * 1000000) - 500000, y: Math.floor(Math.random() * 1000000) - 500000};
      this.amoebas.push(new __WEBPACK_IMPORTED_MODULE_1__amoeba_js__["a" /* default */](this.ctx, xpos, ypos, mass));
    }
    for (let i = 0; i < 300; i++) {
      mass = Math.floor((Math.random() * 400000) + 10000);
      radius = Math.sqrt(mass / (Math.PI));
      xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
      ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      momentum = {x: Math.floor(Math.random() * 1000000) - 500000, y: Math.floor(Math.random() * 1000000) - 500000};
      this.amoebas.push(new __WEBPACK_IMPORTED_MODULE_1__amoeba_js__["a" /* default */](this.ctx, xpos, ypos, mass));
    }
    for (let i = 0; i < 600; i++) {
      mass = Math.floor((Math.random() * 10000) + 10000);
      radius = Math.sqrt(mass / (Math.PI));
      xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
      ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
      momentum = {x: Math.floor(Math.random() * 500000) - 250000, y: Math.floor(Math.random() * 500000) - 250000};
      this.amoebas.push(new __WEBPACK_IMPORTED_MODULE_1__amoeba_js__["a" /* default */](this.ctx, xpos, ypos, mass));
    }

    // for (let i = 0; i < 20; i++) {
    //   mass = Math.floor((Math.random() * 10000) + 10000);
    //   radius = Math.sqrt(mass / (Math.PI));
    //   xpos = Math.floor(Math.random() * (this.boardVars.realBoardWidth - radius)) + radius;
    //   ypos = Math.floor(Math.random() * (this.boardVars.realBoardHeight - radius)) + radius;
    //   momentum = {x: Math.floor(Math.random() * 500000) - 250000, y: Math.floor(Math.random() * 500000) - 250000};
    //   this.amoebas.push(new Amoeba(this.ctx, xpos, ypos, mass));
    // }
    for (let i = 0; i < this.amoebas.length; i++) {
      this.quadTree.insert1(this.amoebas[i]);
    }
    debugger
  }

  animate() {
    this.ctx.clearRect(0,0, innerWidth, innerHeight);
    this.makeGrid(this.ctx);

    if (this.currentStatus === "reset") {
      this.boardVars.maxZoom = 4;
      this.boardVars.currentZoom = 2;
      this.timeVars.timeCoefficient = 0.2;
      this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
      this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
      this.boardVars.baseMass = 50000;

      this.setupAmoebas(false);

      this.boardVars.boardFocus = {x: this.boardVars.realBoardWidth / 2, y: this.boardVars.realBoardHeight / 2};
      this.currentStatus = "homepage";
      return requestAnimationFrame(this.animate);
    }

    if (this.currentStatus === "setup") {
      this.setupAmoebas(true);

      this.boardVars.currentZoom = 4;
      this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
      this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
      this.boardVars.baseMass = this.amoeboi.mass;
      this.boardVars.boardFocus = {x: this.amoeboi.xpos, y: this.amoeboi.ypos};
      this.currentStatus = "playing";
      return requestAnimationFrame(this.animate);
    }

    if (this.currentStatus === "homepage") {
      this.moveAmoebas(this.ctx);
      this.makeHomepage(this.ctx);
      return requestAnimationFrame(this.animate);
    }

    if (this.currentStatus === "movingToInstructions") {
      if (this.homepageYOffset > -1000) {
        this.homepageYOffset -= 20;
      } else {
        this.currentStatus = "instructions";
      }
      this.moveAmoebas(this.ctx);
      this.makeHomepage(this.ctx);
      return requestAnimationFrame(this.animate);
    }

    if (this.currentStatus === "instructions") {
      this.moveAmoebas(this.ctx);
      this.makeHomepage(this.ctx);
      return requestAnimationFrame(this.animate);
    }

    if (this.currentStatus === "movingToHomePage") {
      if (this.homepageYOffset < 0) {
        this.homepageYOffset += 20;
      } else {
        this.currentStatus = "homepage";
      }
      this.moveAmoebas(this.ctx);
      this.makeHomepage(this.ctx);
      return requestAnimationFrame(this.animate);
    }

    if (this.paused) {
      this.amoebas.forEach(amoeba => {
        amoeba.draw();
      });
      this.amoeboi.draw();

      this.makePause(this.ctx);
      // makeMargins(this.ctx);
      return requestAnimationFrame(this.animate);
    }

    this.moveAmoebas(this.ctx);

    this.makeMargins(this.ctx);
    this.makeMassDisplay(this.ctx);
    this.makeInstructions(this.ctx);
    // this.makeClock(this.ctx);
    if (this.amoeboi.mass > 0) {
      this.boardVars.boardFocus = {x: this.amoeboi.xpos, y: this.amoeboi.ypos};
      this.boardVars.baseMass = this.amoeboi.mass;
      if (this.amoeboi.radius / this.boardVars.realBoardWidth * 1000 * this.boardVars.currentZoom > 75) {
        this.boardVars.maxZoom = Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(75 / (this.amoeboi.radius / this.boardVars.realBoardWidth * 1000), 1, this.boardVars.absoluteMaxZoom);
        this.boardVars.currentZoom = Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(this.boardVars.currentZoom * 0.999, this.boardVars.minZoom, this.boardVars.maxZoom);
        this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
        this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
      }
      if (this.amoeboi.radius / this.boardVars.realBoardWidth * 1000 * this.boardVars.maxZoom < 75) {
        this.boardVars.maxZoom = Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(75 / (this.amoeboi.radius / this.boardVars.realBoardWidth * 1000), 1, this.boardVars.absoluteMaxZoom);
      }
    } else {
      this.boardVars.boardFocus['x'] += (this.boardVars.boardFocus['x'] < this.boardVars.realBoardWidth / 2) ? 10 : -10;
      this.boardVars.boardFocus['y'] += (this.boardVars.boardFocus['y'] < this.boardVars.realBoardHeight / 2) ? 10 : -10;
      this.boardVars.currentZoom = this.boardVars.currentZoom > 1 ? this.boardVars.currentZoom * 0.9 : this.boardVars.currentZoom;
      this.boardVars.boardHeight = this.boardVars.realBoardHeight / this.boardVars.currentZoom;
      this.boardVars.boardWidth = this.boardVars.realBoardWidth / this.boardVars.currentZoom;
      this.boardVars.baseMass = 0;
    }
    requestAnimationFrame(this.animate);
  }

  makePause(ctx) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    let mouseOffsetX = this.mousePos['x'] / window.innerWidth * 50;
    let mouseOffsetY = this.mousePos['y'] / window.innerHeight * 50;

    let homepageWave = Math.sin(((Date.now() - this.homepageTime) % 1500) / 1500 * Math.PI);

    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = '70px Impact';
    let titlePosX = (window.innerWidth / 2) - 75 - mouseOffsetX;
    let titlePosY = (window.innerHeight / 2) + 50 - mouseOffsetY + this.homepageYOffset;
    ctx.fillText(`PAUSED`, titlePosX, titlePosY);
  }

  makeClock(ctx) {
    ctx.globalAlpha = 0.5;

    ctx.beginPath();
    ctx.arc(120, 120, 65, 0, ((Object(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* baseLog */])(this.timeVars.timeBase, this.timeVars.timeCoefficient) + 1) / 2 * Math.PI * 2));
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
    ctx.lineTo(120 + (60*Math.cos(this.clockAngle * Math.PI / 180)), 120 + (60*Math.sin(this.clockAngle * Math.PI / 180)));
    ctx.fillStyle = 'black';
    ctx.stroke();
    this.clockAngle = (this.clockAngle + (this.timeVars.timeCoefficient)) % 360;
    ctx.globalAlpha = 1;
  }

  makeGrid(ctx) {
    // let currentLineX = this.boardFocus['x'] - (this.boardWidth / 2);
    ctx.globalAlpha = 0.4;

    let interval = 500;
    let realX = 0;
    let topBorderY =  (((0 - this.boardVars.boardFocus['y'])  / (this.boardVars.boardHeight / 2)) * 500) + (window.innerHeight / 2) + this.mouseVars.mouseOffset['y'];
    let bottomBorderY =  (((this.boardVars.realBoardHeight - this.boardVars.boardFocus['y']) / (this.boardVars.boardHeight / 2)) * 500) + (window.innerHeight / 2)  + this.mouseVars.mouseOffset['y'];
    while (realX <= this.boardVars.realBoardWidth) {
      ctx.fillStyle = (realX ===this.boardVars.realBoardWidth || realX === 0) ? "red" :"black";
      let lineX = (((realX - this.boardVars.boardFocus['x']) / (this.boardVars.boardWidth / 2)) * 500) + (window.innerWidth / 2);
      ctx.fillRect(lineX + this.mouseVars.mouseOffset['x'],topBorderY, 2, bottomBorderY - topBorderY);
      realX += interval;
    }

    let realY = 0;
    let leftBorderX = (((0 - this.boardVars.boardFocus['x']) / (this.boardVars.boardWidth / 2)) * 500) + (window.innerWidth / 2) + this.mouseVars.mouseOffset['x'];
    let rightBorderX = (((this.boardVars.realBoardWidth - this.boardVars.boardFocus['x']) / (this.boardVars.boardWidth / 2)) * 500) + (window.innerWidth / 2) + this.mouseVars.mouseOffset['x'];
    while (realY <= this.boardVars.realBoardHeight) {
      ctx.fillStyle = (realY ===this.boardVars.realBoardHeight || realY === 0) ? "red" :"black";
      let lineY = (((realY - this.boardVars.boardFocus['y']) / (this.boardVars.boardHeight / 2)) * 500) + (window.innerHeight / 2);
      ctx.fillRect(leftBorderX,lineY + this.mouseVars.mouseOffset['y'], rightBorderX - leftBorderX, 2);
      realY += interval;
    }

    ctx.globalAlpha = 1;
  }

  makeMassDisplay(ctx) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'black';
    let displayWidth;
    if (this.amoeboi.mass > 0) {
      displayWidth = 130 + (15 * Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(Math.floor(Math.log10(this.amoeboi.mass / 100),1, 10000)));
    } else {
      displayWidth = 145;
    }
    ctx.fillRect(window.innerWidth - 220, 65, displayWidth, 50);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = '30px Impact';
    ctx.fillText(`Mass: ${Math.floor(this.amoeboi.mass / 100) }`, window.innerWidth - 200, 100);
  }

  makeInstructions(ctx) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'black';
    ctx.fillRect(50, 60, 150, 80);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = '20px Georgia';
    ctx.fillText(`Space: Pause`, 60, 90);
    ctx.fillText(`H: Main Menu`, 60, 130);
  }

  makeMargins(ctx) {
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
    let time0to1 = (Object(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* baseLog */])(this.timeVars.timeBase, this.timeVars.timeCoefficient) + 1) / 2;

    // let gradient = ctx.createLinearGradient(timebarX, timebarY, timebarX + timebarWidth, timebarY + timebarHeight);
    // gradient.addColorStop(0, "rgb(0,0,0)");
    // gradient.addColorStop(time0to1, "rgb(255,255,255)");
    // gradient.addColorStop(time0to1, "rgb(255,255,255)");
    // gradient.addColorStop(1, "rgb(0,0,0)");
    // let color = (baseLog(this.timeVars.timeBase, this.timeVars.timeCoefficient) + 1) / 2 * 255;
    // debugger
    // ctx.fillStyle = gradient;
    // ctx.fillStyle = `rgb(${255 - color},0,${color})`;
    ctx.fillStyle = `black`;
    ctx.fillRect(timebarX - 10, timebarY, timebarWidth + 20, timebarHeight);
    ctx.fillStyle = `white`;
    ctx.fillRect(timebarX + (timebarWidth * time0to1) - 10, timebarY, 20, timebarHeight);
    ctx.globalAlpha = 1;
  }

  moveAmoebas(ctx) {
    this.amoebas = this.amoebas.filter(amoeba => {
      return amoeba.radius > 0;
    });
    this.amoebas.forEach(amoeba => {
      this.amoeboi ? this.amoeboi.aabbCheck(amoeba) : null;
      this.amoeboi ? amoeba.aabbCheck(this.amoeboi) : null;
      this.amoebas.forEach(amoeba2 =>{
        if (amoeba2 !== amoeba){
          amoeba.aabbCheck(amoeba2);
        }
      });
      amoeba.wallCollision();
    });
    this.amoeboi ? this.amoeboi.wallCollision() : null;
    ctx.globalAlpha = 0.8;
    this.amoebas.forEach(amoeba => {
      amoeba.move();
      amoeba.draw();
    });
    this.amoeboi ? this.amoeboi.move() : null;
    this.amoeboi ? this.amoeboi.draw() : null;
    ctx.globalAlpha = 1;
  }

  makeHomepage(ctx) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    let mouseOffsetX = this.mousePos['x'] / window.innerWidth * 50;
    let mouseOffsetY = this.mousePos['y'] / window.innerHeight * 50;

    let homepageWave = Math.sin(((Date.now() - this.homepageTime) % 1500) / 1500 * Math.PI);

    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = '120px Impact';
    let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
    let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + this.homepageYOffset;
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

    ctx.drawImage(this.iconImages.githubLogo, titlePosX - 50, titlePosY + 170, 80, 80);
    ctx.drawImage(this.iconImages.linkedInLogo, titlePosX + 180, titlePosY + 170, 72, 72);
    ctx.drawImage(this.iconImages.folderIcon, titlePosX + 380, titlePosY + 170, 88, 88);
  }

}


/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__amoeba__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__amoeboi__ = __webpack_require__(2);



class QuadTree {
  constructor(x, y, width,height,level = 0) {
    this.children = [];
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.endX = this.x + this.width;
    this.endY = this.y + this.height;
    this.halfX = this.x +  Math.floor(this.width / 2);
    this.halfY = this.y +  Math.floor(this.height / 2);
    this.level = level;

    this.amoebas = [];
  }

  split() {
    let halfWidth = Math.floor(this.width / 2);
    let halfHeight = Math.floor(this.height / 2);
    this.children.push(new QuadTree(this.x, this.y, halfWidth , halfHeight, this.level + 1));
    this.children.push(new QuadTree(this.x + halfWidth, this.y, halfWidth , halfHeight, this.level + 1));
    this.children.push(new QuadTree(this.x, this.y + halfHeight, halfWidth , halfHeight, this.level + 1));
    this.children.push(new QuadTree(this.x + halfWidth, this.y + halfHeight, halfWidth , halfHeight, this.level + 1));
  }

  clear() {
    this.amoebas = [];
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].clear();
      this.children[i] = null;
    }
    if (this.level === 0) {
      this.children = [];
    }
  }

  insert1(amoeba) {
    let index = this.getIndex(amoeba);
    if (this.children.length > 0 && index !== -1) {
      return this.children[index].insert1(amoeba);
    }

    this.amoebas.push(amoeba);

    if (this.children.length === 0 && this.amoebas.length > this.maxAmoebas) {
      this.split();
      let newAmoebas = [];
      for (let i = 0; i < this.amoebas.length; i++) {
        // debugger
        index = this.getIndex(this.amoebas[i]);
        if (index !== -1) {
          this.children[index].insert1(this.amoebas[i]);
        } else {
          newAmoebas.push(this.amoebas[i]);
        }
      }
      this.amoebas = newAmoebas;
    }

  }

  getIndex(amoeba) {
    if ((amoeba.xpos - amoeba.radius) > this.x && (amoeba.xpos + amoeba.radius) < this.halfX
     && (amoeba.ypos - amoeba.radius) > this.y && (amoeba.ypos + amoeba.radius) < this.halfY) {
       return 0;
    } else if ((amoeba.xpos - amoeba.radius) > this.halfX && (amoeba.xpos + amoeba.radius) < this.endX
     && (amoeba.ypos - amoeba.radius) > this.y && (amoeba.ypos + amoeba.radius) < this.halfY) {
       return 1;
    } else if ((amoeba.xpos - amoeba.radius) > this.x && (amoeba.xpos + amoeba.radius) < this.halfX
     && (amoeba.ypos - amoeba.radius) > this.halfY && (amoeba.ypos + amoeba.radius) < this.endY) {
       return 2;
    } else if ((amoeba.xpos - amoeba.radius) > this.halfX && (amoeba.xpos + amoeba.radius) < this.endX
     && (amoeba.ypos - amoeba.radius) > this.halfY && (amoeba.ypos + amoeba.radius) < this.endY) {
       return 3;
    } else {
      return -1;
    }
  }

  checkAllCollisions() {
    for (let i = 0; i < this.amoebas.length; i++) {
      for (let j = 0; j < this.amoebas.length; j++) {
        if (i === j) {
          continue;
        }
        this.amoebas[i].aabbCheck(this.amoebas[j]);
      }
      for (let j = 0; j < this.children.length; j++) {
        this.children[i].checkCollision(this.amoebas[i]);
      }
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].checkAllCollisions();
    }
  }

  checkCollision(amoeba) {
    for (let i = 0; i < this.amoebas.length; i++) {
      amoeba.aabbCheck(this.amoebas[i]);
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].checkCollision(amoeba);
    }

  }

}

QuadTree.prototype.maxAmoebas = 10;

/* harmony default export */ __webpack_exports__["a"] = (QuadTree);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map