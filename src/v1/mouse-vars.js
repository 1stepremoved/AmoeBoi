class MouseVars {
  constructor(opts) {
    this.mouseDownTime = opts.mouseDownTime;
    this.mouseDownInterval = opts.mouseDownInterval;
    this.mouseOffset = opts.mouseOffset; // x and y for panning
    this.mousePos = opts.mousePos;
  }
}

export default MouseVars;