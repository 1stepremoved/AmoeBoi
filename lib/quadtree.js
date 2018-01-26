import Amoeba from './amoeba';
import AmoeBoi from './amoeboi';

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
      for (let j = i + 1; j < this.amoebas.length; j++) {
        if (i === j) {
          continue;
        }
        this.amoebas[i].aabbCheck(this.amoebas[j]);
      }
      for (let j = 0; j < this.children.length; j++) {
        this.children[j].checkCollision(this.amoebas[i]);
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

export default QuadTree;
