class QuadTree {
  constructor({ x, y, width, height,level = 0 }) {
    this.quadrants = [];
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.endX = this.x + this.width;
    this.endY = this.y + this.height;
    this.halfX = this.x +  Math.floor(this.width / 2);
    this.halfY = this.y +  Math.floor(this.height / 2);
    this.level = level;

    this.dataPoints = [];
  }

  split = () => {
    let halfWidth = Math.floor(this.width / 2);
    let halfHeight = Math.floor(this.height / 2);
    this.quadrants.push(new QuadTree({
      x: this.x,
      y: this.y,
      width: halfWidth,
      height: halfHeight,
      level: this.level + 1,
    }));
    this.quadrants.push(new QuadTree({
      x: this.x + halfWidth,
      y: this.y,
      width: halfWidth ,
      height: halfHeight,
      level: this.level + 1,
    }));
    this.quadrants.push(new QuadTree({
      x: this.x,
      y: this.y + halfHeight,
      width: halfWidth,
      height: halfHeight,
      level: this.level + 1,
    }));
    this.quadrants.push(new QuadTree({
      x: this.x + halfWidth,
      y: this.y + halfHeight,
      width: halfWidth,
      height: halfHeight,
      level: this.level + 1,
    }));
  };

  clear = () => {
    this.dataPoints = [];
    for (let i = 0; i < this.quadrants.length; i++) {
      this.quadrants[i].clear();
      this.quadrants[i] = null;
    }
    if (this.level === 0) {
      this.quadrants = [];
    }
  };

  insert1 = (dataPoint) => {
    let index = this.getIndex(dataPoint);
    if (this.quadrants.length > 0 && index !== -1) {
      return this.quadrants[index].insert1(dataPoint);
    }

    this.dataPoints.push(dataPoint);

    if (this.quadrants.length === 0 && this.dataPoints.length > this.maxAmoebas) {
      this.split();
      let newAmoebas = [];
      for (let i = 0; i < this.dataPoints.length; i++) {
        index = this.getIndex(this.dataPoints[i]);
        if (index !== -1) {
          this.quadrants[index].insert1(this.dataPoints[i]);
        } else {
          newAmoebas.push(this.dataPoints[i]);
        }
      }
      this.dataPoints = newAmoebas;
    }
  };

  getIndex = (dataPoint) => {
    if ((dataPoint.xpos - dataPoint.radius) > this.x && (dataPoint.xpos + dataPoint.radius) < this.halfX
     && (dataPoint.ypos - dataPoint.radius) > this.y && (dataPoint.ypos + dataPoint.radius) < this.halfY) {
       return 0;
    } else if ((dataPoint.xpos - dataPoint.radius) > this.halfX && (dataPoint.xpos + dataPoint.radius) < this.endX
     && (dataPoint.ypos - dataPoint.radius) > this.y && (dataPoint.ypos + dataPoint.radius) < this.halfY) {
       return 1;
    } else if ((dataPoint.xpos - dataPoint.radius) > this.x && (dataPoint.xpos + dataPoint.radius) < this.halfX
     && (dataPoint.ypos - dataPoint.radius) > this.halfY && (dataPoint.ypos + dataPoint.radius) < this.endY) {
       return 2;
    } else if ((dataPoint.xpos - dataPoint.radius) > this.halfX && (dataPoint.xpos + dataPoint.radius) < this.endX
     && (dataPoint.ypos - dataPoint.radius) > this.halfY && (dataPoint.ypos + dataPoint.radius) < this.endY) {
       return 3;
    } else {
      return -1;
    }
  };

  checkAllCollisions = (collisionCheck) => {
    for (let i = 0, len = this.dataPoints.length; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        collisionCheck(this.dataPoints[i], this.dataPoints[j]);
      }
      for (let j = 0, quadrantsLen = this.quadrants.length; j < quadrantsLen; j++) {
        this.quadrants[j].checkCollision(collisionCheck, this.dataPoints[i]);
      }
    }

    for (let i = 0, quadrantsLen = this.quadrants.length; i <quadrantsLen; i++) {
      this.quadrants[i].checkAllCollisions(collisionCheck);
    }
  };

  checkCollision = (collisionCheck, dataPoint) => {
    for (let i = 0, len = this.dataPoints.length; i < len; i++) {
      collisionCheck(dataPoint, this.dataPoints[i]);
    }

    for (let i = 0,  quadrantsLen = this.quadrants.length; i < quadrantsLen; i++) {
      this.quadrants[i].checkCollision(collisionCheck, dataPoint);
    }
  };

}

QuadTree.prototype.maxAmoebas = 10;

export default QuadTree;
