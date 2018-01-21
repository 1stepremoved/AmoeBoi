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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__amoeba_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__amoeboi_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__game__ = __webpack_require__(4);






window.maxZoom = 4;
window.minZoom = 0.7;
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
    e.preventDefault();
    if (window.paused) {
      return;
    }
    let zoomDelta = (e.deltaY / -1000);
    window.currentZoom = Object(__WEBPACK_IMPORTED_MODULE_2__util__["b" /* boundNum */])(window.currentZoom + zoomDelta, window.minZoom, window.maxZoom);
    window.boardHeight = window.realBoardHeight / window.currentZoom;
    window.boardWidth = window.realBoardWidth / window.currentZoom;
  });

  const canvas = document.getElementById("background");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.amoebas = [];
  window.amoeboi = new __WEBPACK_IMPORTED_MODULE_1__amoeboi_js__["a" /* default */](ctx, window.realBoardWidth / 2, window.realBoardHeight / 2, 100000, {x: 100000, y: 0});
  for (let i = 0; i < 400; i++) {
    window.amoebas.push(new __WEBPACK_IMPORTED_MODULE_0__amoeba_js__["a" /* default */](ctx));
  }
  // amoebas.push(new Amoeba(ctx, 4500, 5000, 100000, {x: 100000, y: 0}));
  // amoebas.push(new Amoeba(ctx, 5500, 5000, 300000, {x: -100000, y: 0}));
  // amoebas.push(new Amoeba(ctx, 5300, 5000, 100000, {x: -100000, y: 0}));
  let animate = () => {
    ctx.clearRect(0,0, innerWidth, innerHeight);
    Object(__WEBPACK_IMPORTED_MODULE_3__game__["a" /* makeGrid */])(ctx);

    if (window.paused) {
      window.amoebas.forEach(amoeba => {
        amoeba.draw();
      });
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "black";
      ctx.fillRect(0,0, innerWidth, innerHeight);
      window.amoeboi.draw();
      Object(__WEBPACK_IMPORTED_MODULE_3__game__["b" /* makeMargins */])(ctx);
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

    Object(__WEBPACK_IMPORTED_MODULE_3__game__["b" /* makeMargins */])(ctx);
    Object(__WEBPACK_IMPORTED_MODULE_3__game__["c" /* makeMassDisplay */])(ctx);
    // makeClock(ctx);
    if (window.amoeboi.mass > 0) {
      window.boardFocus = {x: window.amoeboi.xpos, y: window.amoeboi.ypos};
      window.baseMass = window.amoeboi.mass;
      if (window.amoeboi.radius / window.realBoardWidth * 1000 * window.currentZoom > 75) {
        window.maxZoom = Object(__WEBPACK_IMPORTED_MODULE_2__util__["b" /* boundNum */])(75 / (window.amoeboi.radius / window.realBoardWidth * 1000), 1, 4);
        window.currentZoom = Object(__WEBPACK_IMPORTED_MODULE_2__util__["b" /* boundNum */])(window.currentZoom * 0.999, window.minZoom, window.maxZoom);
        window.boardHeight = window.realBoardHeight / window.currentZoom;
        window.boardWidth = window.realBoardWidth / window.currentZoom;
      }
      if (window.amoeboi.radius / window.realBoardWidth * 1000 * window.maxZoom < 75) {
        window.maxZoom = Object(__WEBPACK_IMPORTED_MODULE_2__util__["b" /* boundNum */])(75 / (window.amoeboi.radius / window.realBoardWidth * 1000), 1, 4);
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


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(2);


class Amoeba {
  constructor(ctx, x, y, mass, momentum) {
    this.ctx = ctx;
    this.mass = mass || Math.floor((Math.random() * 100000) + 10000);
    this.radius = Math.sqrt(this.mass / (Math.PI));
    this.xpos = x || Math.floor(Math.random() * (window.realBoardWidth - this.radius)) + this.radius;
    this.ypos = y || Math.floor(Math.random() * (window.realBoardHeight - this.radius)) + this.radius;
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
    this.xpos += xDelta * window.timeCoefficient;
    this.ypos += yDelta * window.timeCoefficient;
    // this.xpos += boundNum(xDelta * window.timeCoefficient, -10, 10);
    // this.ypos += boundNum(yDelta * window.timeCoefficient, -10, 10);
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
        * amoeba.mass * (currentDistance / distance) * window.timeCoefficient, -50, 50);
      amoeba.nextMomentum['x'] = amoeba.nextMomentum['x']
        * Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(amoeba.mass / this.mass, .99, 1);
      this.nextMomentum['y'] += Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(amoeba.momentum['y']
        * amoeba.mass * (currentDistance / distance) * window.timeCoefficient, -50, 50);
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
            * window.timeCoefficient;

        this.mass -= bubble;
        amoeba.mass += bubble;
      }
    }
  }



  wallCollision() {
    if (this.xpos + this.radius >= window.realBoardWidth) {
      this.nextMomentum['x'] = -1 * this.momentum['x'];
      this.xpos = window.realBoardWidth - this.radius - 1;
    } else if (this.xpos - this.radius <= 0) {
      this.nextMomentum['x'] = -1 * this.momentum['x'];
      this.xpos = 0 + this.radius + 1;
    }
    if (this.ypos + this.radius >= window.realBoardHeight) {
      this.nextMomentum['y'] = -1 * this.momentum['y'];
      this.ypos = window.realBoardHeight - this.radius - 1;
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
    if (this.mass < window.baseMass) {
      gradient.addColorStop(0, `rgb(${20}, ${20}, ${255})`);
      gradient.addColorStop(Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(1 - (this.mass / window.baseMass),0, 1) , `rgb(${50}, ${20}, ${200})`);
      gradient.addColorStop(1 , `rgb(${255}, ${20}, ${20})`);
    } else {
      gradient.addColorStop(0, `rgb(${255}, ${20}, ${20})`);
      gradient.addColorStop(Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(1 -(window.baseMass / this.mass), 0, 1) , `rgb(${200}, ${20}, ${50})` );
      gradient.addColorStop(1 , `rgb(${20}, ${20}, ${255})`);
    }
    return gradient;
  }

  relativePos() {
    let relativeX = (((this.xpos - window.boardFocus['x']) / (window.boardWidth / 2)) * 500) + (window.innerWidth / 2);
    let relativeY = (((this.ypos - window.boardFocus['y']) / (window.boardHeight/ 2)) * 500) + (window.innerHeight / 2);
    return {x: relativeX, y: relativeY};
  }

  draw() {
    if (this.mass <= 0) {
      return;
    }
    this.adjustRadius();

    let relativeCoors = this.relativePos();

    let relativeRadius = this.radius / window.realBoardWidth * 1000 * window.currentZoom;
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
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__amoeba__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(2);



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

    let mass = this.mass * Object(__WEBPACK_IMPORTED_MODULE_1__util__["b" /* boundNum */])(((Date.now() - window.mouseDownTime) / 30000), .01, .1);
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(2);


const makePause = (ctx) => {

};
/* unused harmony export makePause */


const makeClock = (ctx) => {
  ctx.globalAlpha = 0.5;

  ctx.beginPath();
  ctx.arc(120, 120, 65, 0, ((Object(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* baseLog */])(window.timeBase, window.timeCoefficient) + 1) / 2 * Math.PI * 2));
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
/* unused harmony export makeClock */


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
/* harmony export (immutable) */ __webpack_exports__["a"] = makeGrid;


const makeMassDisplay = (ctx) => {
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = 'black';
  ctx.fillRect(window.innerWidth - 300, 65, 130 + (20 * Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* boundNum */])(Math.floor(Math.log10(window.amoeboi.mass / 100),1, 10000))), 50);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'white';
  ctx.font = '30px Georgia';
  ctx.fillText(`Mass: ${Math.floor(window.amoeboi.mass / 100) }`, window.innerWidth - 280, 100);
};
/* harmony export (immutable) */ __webpack_exports__["c"] = makeMassDisplay;


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
  let time0to1 = (Object(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* baseLog */])(window.timeBase, window.timeCoefficient) + 1) / 2;

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
/* harmony export (immutable) */ __webpack_exports__["b"] = makeMargins;



/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map