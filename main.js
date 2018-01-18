
window.momentumDelta = 1;
window.radiusDelta = 1;
window.momentumMax = 10;
window.maxZooom = 10;
window.minZoom = 1;
window.currentZoom = 10;

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  document.addEventListener("mousewheel", (e)=> {
    let zoomDelta = (e.deltaY / -1000);
    window.currentZoom = boundNum(window.currentZoom + zoomDelta, 1, 10);
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
      amoebas.forEach(amoeba2 =>{
        if (amoeba2 !== amoeba){
          amoeba.collision(amoeba2);
        }
      });
      amoeba.wallCollision();
    });
    amoebas.forEach(amoeba => {
      amoeba.move();
      amoeba.draw();
    });
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
  constructor(ctx, x, y, mass) {
    this.ctx = ctx;
    this.radius = mass || Math.floor(Math.random() * 100);
    this.xpos = x || Math.floor(Math.random() * (window.innerWidth - this.radius)) + this.radius;
    this.ypos = y || Math.floor(Math.random() * (window.innerHeight - this.radius)) + this.radius;
    this.momentum = {x: Math.floor(Math.random() * 50) - 5, y: Math.floor(Math.random() * 50) - 5};
    this.nextMomentum = Object.assign({}, this.momentum);
    this.draw = this.draw.bind(this);
    this.collision = this.collision.bind(this);
    this.color = "blue";
  }

  move() {
    this.momentum = Object.assign({}, this.nextMomentum);
    let xDelta = this.momentum['x'] / this.radius;
    let yDelta = this.momentum['y'] / this.radius;
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

      this.nextMomentum['x'] += boundNum(amoeba.momentum['x'] * amoeba.radius * (currentDistance / distance), -1, 1);
      amoeba.nextMomentum['x'] = amoeba.nextMomentum['x'] * boundNum(amoeba.radius / this.radius, .8, 1)
      this.nextMomentum['y'] += boundNum(amoeba.momentum['y'] * amoeba.radius * (currentDistance / distance), -1, 1);
      amoeba.nextMomentum['y'] = amoeba.nextMomentum['y'] * boundNum(amoeba.radius / this.radius, .8, 1)

      if (this.radius <= amoeba.radius) {
        if ((currentDistance - amoeba.radius) / this.radius < 0) {
          amoeba.radius += this.radius;
          this.radius = 0;
          return;
        }

        let bubble = window.radiusDelta  * boundNum( (currentDistance - amoeba.radius) / this.radius, 0, 1);
        this.radius -= bubble;
        amoeba.radius += bubble;
      }
    }
  }



  wallCollision() {
    if (this.xpos + this.radius >= window.innerWidth) {
      this.nextMomentum['x'] = -1 * this.momentum['x'];
      this.xpos = window.innerWidth - this.radius - 1;
    } else if (this.xpos - this.radius <= 0) {
      this.nextMomentum['x'] = -1 * this.momentum['x'];
      this.xpos = 0 + this.radius + 1;
    }
    if (this.ypos + this.radius >= window.innerHeight) {
      this.nextMomentum['y'] = -1 * this.momentum['y'];
      this.ypos = window.innerHeight - this.radius - 1;
    } else if (this.ypos - this.radius <= 0) {
      this.nextMomentum['y'] = -1 * this.momentum['y'];
      this.ypos = 0 + this.radius + 1;
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle="blue";
    this.ctx.fill();
  }
}
