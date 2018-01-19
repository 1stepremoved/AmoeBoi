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
