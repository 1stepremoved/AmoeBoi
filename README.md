[Live](https://1stepremoved.github.io/Osmosis/)

Osmosis (or AmoeBoi) is a become-the-largest style game built entirely using JavaScript and canvas. The goal is to navigate the field and absorb smaller amoebae until your amoeba is the largest (or last remaining). You propel yourself through the field by shooting off a little of your own mass, pushing you in the opposite direction.

![alt Text](https://media.giphy.com/media/3o6nUPNvklX5yHynao/giphy.gif)

It uses a custom built physics engine to determine the acceleration and absorption rate of each amoeba. The arrow keys allow you to control how quickly time passes, allowing you to speed along your direction without waiting using more mass.

![alt Text](https://media.giphy.com/media/xT1R9BU6yng1H8RxAc/giphy.gif)

```
  collision(amoeba) {
    let distance = this.radius + amoeba.radius;
    let currentDistance = Math.sqrt(
      Math.pow(this.xpos - amoeba.xpos ,2)  + Math.pow(this.ypos - amoeba.ypos ,2)
    );
    if (distance > currentDistance){

      this.nextMomentum['x'] += boundNum(amoeba.momentum['x']
        * amoeba.mass * (currentDistance / distance) * this.timeVars.timeCoefficient, -50, 50);
      amoeba.nextMomentum['x'] = amoeba.nextMomentum['x']
        * boundNum(amoeba.mass / this.mass, .99, 1);

      amoeba.nextMomentum['x'] += boundNum(this.momentum['x']
        * this.mass * (currentDistance / distance) * this.timeVars.timeCoefficient, -50, 50);
      this.nextMomentum['x'] = this.nextMomentum['x']
        * boundNum(this.mass / amoeba.mass, .99, 1);

      this.nextMomentum['y'] += boundNum(amoeba.momentum['y']
        * amoeba.mass * (currentDistance / distance) * this.timeVars.timeCoefficient, -50, 50);
      amoeba.nextMomentum['y'] = amoeba.nextMomentum['y']
        * boundNum(amoeba.mass / this.mass, .99, 1);

      amoeba.nextMomentum['y'] += boundNum(this.momentum['y']
        * this.mass * (currentDistance / distance) * this.timeVars.timeCoefficient, -50, 50);
      this.nextMomentum['y'] = this.nextMomentum['y']
        * boundNum(this.mass / amoeba.mass, .99, 1);

      let amoebae;
      if (this.mass <= amoeba.mass) {
        amoebae = {big: amoeba, small: this};
      } else {
        amoebae = {big: this, small: amoeba};
      }
        if ((currentDistance - amoebae['big'].radius) < 0 || amoebae['small'].mass < 100) {
          amoebae['big'].mass += amoebae['small'].mass;
          amoebae['small'].mass = 0;
          amoebae['big'].nextMomentum['x'] += amoebae['small'].nextMomentum['x'];
          amoebae['big'].nextMomentum['y'] += amoebae['small'].nextMomentum['y'];
          return;
        }

        let bubble = amoebae['small'].massDelta * amoebae['small'].mass
                   * boundNum( (amoebae['small'].radius - (currentDistance - amoebae['big'].radius))
                   / amoebae['small'].radius, .01, .1);

        amoebae['small'].mass -= bubble;
        amoebae['big'].mass += bubble;
    }
  }
```

For increased efficiency amoebae are organized in a quadtree and collisions are calculated recursively down the branches, with no redundant calculations. This brings collision detection to O(n) efficiency under ideal circumstance, and o(nlogn) on average.

```
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
```
