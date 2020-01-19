export const boundNum = (num, min, max) => {
  if (num > max) {
    return max;
  } else if (num < min) {
    return min;
  } else {
    return num;
  }
};

export const baseLog = (x, y) => {
  return Math.log(y) / Math.log(x);
};

export const transitionVar = (variable, start, stop, rate = .01) => {
  const isGoingUp = (start < stop);
  const transitionRate = (isGoingUp) ? 1 + rate : 1 - rate;
  if ((isGoingUp && start > stop * .99) || (!isGoingUp && start < stop * 1.01)) {
    return variable;
  } else {
    return variable * transitionRate;
  }
};

export const aabbCheck = (timeCoefficient = 1) => (amoeba1, amoeba2) => {
  if (amoeba2.xpos + amoeba2.radius + amoeba1.radius > amoeba1.xpos
      && amoeba2.xpos < amoeba1.xpos + amoeba1.radius + amoeba2.radius
      && amoeba2.ypos + amoeba2.radius + amoeba1.radius > amoeba1.ypos
      && amoeba2.ypos < amoeba1.ypos + amoeba1.radius + amoeba2.radius
  ) {
    collision(amoeba1, amoeba2, timeCoefficient);
  }
};

const collision = (amoeba1, amoeba2, timeCoefficient) => {
  let distance = amoeba1.radius + amoeba2.radius;
  let currentDistance = Math.sqrt(
      Math.pow(amoeba1.xpos - amoeba2.xpos ,2)  + Math.pow(amoeba1.ypos - amoeba2.ypos ,2)
  );
  if (distance > currentDistance) {

    amoeba1.nextMomentum['x'] += boundNum(amoeba2.momentum['x']
        * amoeba2.mass * (currentDistance / distance) * timeCoefficient, -50, 50);
    amoeba2.nextMomentum['x'] = amoeba2.nextMomentum['x']
        * boundNum(amoeba2.mass / amoeba1.mass, .99, 1);

    amoeba2.nextMomentum['x'] += boundNum(amoeba1.momentum['x']
        * amoeba1.mass * (currentDistance / distance) * timeCoefficient, -50, 50);
    amoeba1.nextMomentum['x'] = amoeba1.nextMomentum['x']
        * boundNum(amoeba1.mass / amoeba2.mass, .99, 1);

    amoeba1.nextMomentum['y'] += boundNum(amoeba2.momentum['y']
        * amoeba2.mass * (currentDistance / distance) * timeCoefficient, -50, 50);
    amoeba2.nextMomentum['y'] = amoeba2.nextMomentum['y']
        * boundNum(amoeba2.mass / amoeba1.mass, .99, 1);

    amoeba2.nextMomentum['y'] += boundNum(amoeba1.momentum['y']
        * amoeba1.mass * (currentDistance / distance) * timeCoefficient, -50, 50);
    amoeba1.nextMomentum['y'] = amoeba1.nextMomentum['y']
        * boundNum(amoeba1.mass / amoeba2.mass, .99, 1);

    if (amoeba1.mass <= amoeba2.mass) {
      applyCollisionPhysics(amoeba2, amoeba1, currentDistance, timeCoefficient);
    } else {
      applyCollisionPhysics(amoeba1, amoeba2, currentDistance, timeCoefficient);
    }
  }
};

const applyCollisionPhysics = (bigAmoeba, smallAmoeba, currentDistance, timeCoefficient) => {
  if ((currentDistance - bigAmoeba.radius) < 0 || smallAmoeba.mass < 100) {
    bigAmoeba.mass += smallAmoeba.mass;
    smallAmoeba.mass = 0;
    bigAmoeba.nextMomentum['x'] += smallAmoeba.nextMomentum['x'];
    bigAmoeba.nextMomentum['y'] += smallAmoeba.nextMomentum['y'];
  }

  let bubble = smallAmoeba.massDelta * smallAmoeba.mass
      * boundNum( (smallAmoeba.radius - (currentDistance - bigAmoeba.radius)) / smallAmoeba.radius, .01, .1)
      * boundNum(timeCoefficient, 0.5, 2);

  smallAmoeba.mass -= bubble;
  bigAmoeba.mass += bubble;
};

export const collidesWith = (amoeba1, amoeba2) => {
  let distance = amoeba1.radius + amoeba2.radius;
  let currentDistance = Math.sqrt(
      Math.pow(amoeba1.xpos - amoeba2.xpos, 2) + Math.pow(amoeba1.ypos - amoeba2.ypos, 2)
  );
  if (distance > currentDistance) {
    return true;
  } else {
    return false;
  };
};

export const wallCollision = (amoeba, boardVars) => {
  if (amoeba.xpos + amoeba.radius >= boardVars.realBoardWidth) {
    amoeba.nextMomentum['x'] = -1 * amoeba.momentum['x'];
    amoeba.xpos = boardVars.realBoardWidth - amoeba.radius - 1;
  } else if (amoeba.xpos - amoeba.radius <= 0) {
    amoeba.nextMomentum['x'] = -1 * amoeba.momentum['x'];
    amoeba.xpos = 0 + amoeba.radius + 1;
  }
  if (amoeba.ypos + amoeba.radius >= boardVars.realBoardHeight) {
    amoeba.nextMomentum['y'] = -1 * amoeba.momentum['y'];
    amoeba.ypos = boardVars.realBoardHeight - amoeba.radius - 1;
  } else if (amoeba.ypos - amoeba.radius <= 0) {
    amoeba.nextMomentum['y'] = -1 * amoeba.momentum['y'];
    amoeba.ypos = 0 + amoeba.radius + 1;
  }
};
