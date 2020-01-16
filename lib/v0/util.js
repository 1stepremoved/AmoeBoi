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
