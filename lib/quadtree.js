import Amoeba from './amoeba';
import AmoeBoi from './amoeboi';
import { boundNum } from './util';

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

  insert2(amoeba) {
    let moveX = 0;
    let moveY = 0;
    let collided = true;
    let otherAmoeba, diffX, diffY, angle;
    while (collided && amoeba.adjustments < 1000) {
      collided = false;
      for (let i = 0, amoebaLen = this.amoebas.length; i < amoebaLen; i++) {
        otherAmoeba = this.amoebas[i];
        if (amoeba.collidesWith(this.amoebas[i])) {
          diffX = amoeba.xpos - otherAmoeba.xpos;
          diffY = amoeba.ypos - otherAmoeba.ypos;
          angle = Math.atan2(diffY, diffX);
          moveX += (amoeba.radius - Math.abs(amoeba.xpos - otherAmoeba.xpos) + otherAmoeba.radius)
                   * (otherAmoeba.xpos < amoeba.xpos ? 1 : -1);
          moveY += (amoeba.radius - Math.abs(amoeba.ypos - otherAmoeba.ypos) + otherAmoeba.radius)
                   * (otherAmoeba.ypos < amoeba.ypos ? 1 : -1);
          collided = true;
        }
      }
      amoeba.xpos = boundNum(amoeba.xpos + moveX, 0 + amoeba.radius, this.realBoardWidth - amoeba.radius);
      amoeba.ypos = boundNum(amoeba.ypos + moveY, 0 + amoeba.radius, this.realBoardHeight - amoeba.radius);
      moveX = 0;
      moveY = 0;
      amoeba.adjustments += 1;
    }

    let index = this.getIndex(amoeba);
    if (this.children.length > 0 && index !== -1) {
      return this.children[index].insert2(amoeba);
    }

    this.amoebas.push(amoeba);

    if (this.children.length === 0 && this.amoebas.length > this.maxAmoebas) {
      this.split();
      let newAmoebas = [];
      for (let i = 0; i < this.amoebas.length; i++) {
        index = this.getIndex(this.amoebas[i]);
        if (index !== -1) {
          this.children[index].insert2(this.amoebas[i]);
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
    for (let i = 0, amoebaeLen = this.amoebas.length; i < amoebaeLen; i++) {
      for (let j = i + 1; j < amoebaeLen; j++) {
        this.amoebas[i].aabbCheck(this.amoebas[j]);
      }
      for (let j = 0, childrenLen = this.children.length; j < childrenLen; j++) {
        this.children[j].checkCollision(this.amoebas[i]);
      }
    }

    for (let i = 0, childrenLen = this.children.length; i <childrenLen; i++) {
      this.children[i].checkAllCollisions();
    }
  }

  checkCollision(amoeba) {
    for (let i = 0, amoebaeLen = this.amoebas.length; i < amoebaeLen; i++) {
      amoeba.aabbCheck(this.amoebas[i]);
    }

    for (let i = 0,  childrenLen = this.children.length; i < childrenLen; i++) {
      this.children[i].checkCollision(amoeba);
    }

  }

}

QuadTree.prototype.maxAmoebas = 10;

export default QuadTree;
