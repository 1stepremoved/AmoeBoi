
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

const boundNum = (num, min, max) => {
  if (num > max) {
    return max;
  } else if (num < min) {
    return min;
  } else {
    return num;
  }
};

class Amoeba {
  constructor(ctx, x, y, mass, momentum) {
    this.ctx = ctx;
    this.mass = mass || Math.floor((Math.random() * 100000) + 10000);
    this.radius = Math.sqrt(this.mass / (Math.PI));
    this.xpos = x || Math.floor(Math.random() * (window.realBoardWidth - this.radius)) + this.radius;
    this.ypos = y || Math.floor(Math.random() * (window.realBoardHeight - this.radius)) + this.radius;
    this.momentum = momentum || {x: Math.floor(Math.random() * 100000) - 50000, y: Math.floor(Math.random() * 100000) - 50000};
    this.nextMomentum = Object.assign({}, this.momentum);
    this.draw = this.draw.bind(this);
    this.collision = this.collision.bind(this);
    this.adjustRadius = this.adjustRadius.bind(this);
    this.color = "blue";
  }

  move() {
    this.momentum = Object.assign({}, this.nextMomentum);
    let xDelta = this.momentum['x'] / this.mass;
    let yDelta = this.momentum['y'] / this.mass;
    xDelta = (xDelta > window.momentumMax) ? Math.abs(xDelta) / xDelta * window.momentumMax : xDelta;
    yDelta = (yDelta > window.momentumMax) ? Math.abs(yDelta) / yDelta * window.momentumMax : yDelta;
    this.xpos += xDelta * window.timeCoefficient;
    this.ypos += yDelta * window.timeCoefficient;
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

      this.nextMomentum['x'] += boundNum(amoeba.momentum['x']
        * amoeba.mass * (currentDistance / distance) * window.timeCoefficient, -50, 50);
      amoeba.nextMomentum['x'] = amoeba.nextMomentum['x']
        * boundNum(amoeba.mass / this.mass, .99, 1);
      this.nextMomentum['y'] += boundNum(amoeba.momentum['y']
        * amoeba.mass * (currentDistance / distance) * window.timeCoefficient, -50, 50);
      amoeba.nextMomentum['y'] = amoeba.nextMomentum['y']
        * boundNum(amoeba.mass / this.mass, .99, 1);

      if (this.mass <= amoeba.mass) {
        if ((currentDistance - amoeba.radius) / this.radius < 0 || this.mass < 100) {
          amoeba.mass += this.mass;
          this.mass = 0;
          amoeba.nextMomentum['x'] += this.nextMomentum['x'];
          amoeba.nextMomentum['y'] += this.nextMomentum['y'];
          return;
        }

        let bubble = window.massDelta
            * boundNum( (this.radius - (currentDistance - amoeba.radius)) / this.radius, .1, 1)
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

  draw() {
    if (this.mass <= 0) {
      return;
    }
    this.adjustRadius();
    let boardHeight = window.realBoardHeight / window.currentZoom;
    let boardWidth = window.realBoardWidth / window.currentZoom;

    let relativeX = (((this.xpos - window.boardFocus['x']) / (boardWidth / 2)) * (innerWidth / 2)) + (innerWidth / 2);
    let relativeY = (this.ypos - window.boardFocus['y']) / (boardHeight/ 2) * (innerHeight / 2) + (innerHeight / 2);

    let relativeRadius = this.radius / window.realBoardWidth * window.innerWidth * window.currentZoom;

    let gradient = this.ctx.createRadialGradient(relativeX, relativeY,relativeRadius, relativeX, relativeY, 0);
    if (this.mass < window.baseMass) {
      gradient.addColorStop(0, `rgb(${20}, ${20}, ${255})`);
      // debugger
      gradient.addColorStop(1 - (this.mass / window.baseMass) , `rgb(${50}, ${20}, ${200})`);
      gradient.addColorStop(1 , `rgb(${255}, ${20}, ${20})`);
    } else {
      gradient.addColorStop(0, `rgb(${255}, ${20}, ${20})`);
      // debugger
      gradient.addColorStop(1 -(window.baseMass / this.mass) , `rgb(${200}, ${20}, ${50})` );
      gradient.addColorStop(1 , `rgb(${20}, ${20}, ${255})`);
    }
    // if (this.mass < window.baseMass) {
    //   let red = 50 + (50 * this.mass / window.baseMass);
    // }
    this.ctx.beginPath();
    this.ctx.arc(relativeX, relativeY, relativeRadius, 0, Math.PI * 2);
    this.ctx.fillStyle=gradient;
    this.ctx.fill();
  }
}
