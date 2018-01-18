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
/***/ (function(module, exports) {


window.momentumDelta = 1;
window.radiusDelta = 10;
window.momentumMax = 10;

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const canvas = document.getElementById("background");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let amoebas = [];
  for (let i = 0; i < 4; i++) {
    amoebas.push(new Amoeba(ctx));
  }
  let animate = () => {
    ctx.clearRect(0,0, innerWidth, innerHeight);
    amoebas = amoebas.filter(amoeba => {
      return amoeba.radius > 0;
    });
    amoebas.forEach(amoeba => {
      amoeba.move();
    });
    amoebas.forEach(amoeba => {
      amoebas.forEach(amoeba2 =>{
        if (amoeba2 !== amoeba){
          amoeba.collision(amoeba2);
        }
      });
      amoeba.wallCollision();

      amoeba.draw();
    });
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
});

class Amoeba {
  constructor(ctx, x, y, mass) {
    this.ctx = ctx;
    this.radius = mass || Math.floor(Math.random() * 100);
    this.xpos = x || Math.floor(Math.random() * (window.innerWidth - this.radius)) + this.radius;
    this.ypos = y || Math.floor(Math.random() * (window.innerHeight - this.radius)) + this.radius;
    this.momentum = {x: Math.floor(Math.random() * 50) - 5, y: Math.floor(Math.random() * 50) - 5};
    
    this.draw = this.draw.bind(this);
    this.collision = this.collision.bind(this);
    this.color = "blue";
  }

  move() {
    let xDelta = this.momentum['x'] / this.radius;
    let yDelta = this.momentum['x'] / this.radius;
    xDelta = (xDelta > window.momentumMax) ? Math.abs(xDelta) / xDelta * window.momentumMax : xDelta;
    yDelta = (yDelta > window.momentumMax) ? Math.abs(yDelta) / yDelta * window.momentumMax : yDelta;
    this.xpos += xDelta;
    this.ypos += yDelta;
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
      // this.momentum['x'] =
      //   ((this.momentum['x'] * (this.radius - amoeba.radius))
      //   + (2 * amoeba.radius * amoeba.momentum['x']))
      //   / (this.radius + amoeba.radius);
      // debugger
      window.momentumDelta
      this.momentum['x'] += amoeba.momentum['x'] / amoeba.radius * (currentDistance / distance);
      amoeba.momentum['x'] = amoeba.momentum['x'] * ((currentDistance - this.radius) / amoeba.radius) ;
      this.momentum['y'] += amoeba.momentum['y'] / amoeba.radius * (currentDistance / distance);
      // amoeba.momentum['y'] = amoeba.momentum['y'] * ((distance - amoeba.radius) / distance);
      amoeba.momentum['y'] = amoeba.momentum['y'] * ((currentDistance - this.radius) / amoeba.radius);

      if (this.radius <= amoeba.radius) {
        // if ((currentDistance - amoeba.radius) / this.radius < 0) {
        //   amoeba.radius += this.radius;
        //   this.radius = 0;
        //   return;
        // }
        let bubble = this.radius * ((currentDistance - amoeba.radius) / this.radius);
        this.radius -= bubble;
        amoeba.radius += bubble;
      }
      // this.momentum['y'] =
      //   ((this.momentum['y'] * (this.radius - amoeba.radius))
      //   + (2 * amoeba.radius * amoeba.momentum['y']))
      //   / (this.radius + amoeba.radius);
    }
  }

  wallCollision() {
    if (this.xpos + this.radius > window.innerWidth || this.xpos - this.radius <= 0) {
      this.momentum['x'] = -1 * this.momentum['x'];
      this.xpos += (this.xpos + this.radius > window.innerWidth) ? -1 : 1;
    }
    if (this.ypos + this.radius > window.innerHeight || this.ypos - this.radius <= 0) {
      this.momentum['y'] = -1 * this.momentum['y'];
      this.ypos += (this.ypos + this.radius > window.innerHeight) ? -1 : 1;
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle="blue";
    this.ctx.fill();
  }
}


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map