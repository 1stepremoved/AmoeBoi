class BoardVars {
    constructor(opts) {
        this.realBoardWidth = opts.realBoardWidth;
        this.realBoardHeight = opts.realBoardHeight;
        this.baseMass = opts.baseMass;
        this.maxZoom = opts.maxZoom;
        this.absoluteMaxZoom = opts.absoluteMaxZoom;
        this.minZoom = opts.minZoom;
        this.currentZoom = opts.currentZoom;
        this.boardWidth = opts.boardWidth;
        this.boardHeight = opts.boardHeight;
        this.boardFocus = opts.boardFocus;
    }
}

export default BoardVars;