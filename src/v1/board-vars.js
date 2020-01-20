class BoardVars {
    constructor(opts) {
        this.boardSize = opts.boardSize;
        this.realBoardWidth = opts.realBoardWidth;
        this.realBoardHeight = opts.realBoardHeight;
        this.baseMass = opts.baseMass;
        this.maxZoom = opts.maxZoom;
        this.absoluteMaxZoom = opts.absoluteMaxZoom;
        this.minZoom = opts.minZoom;
        this.currentZoom = opts.currentZoom;
        this.boardFocus = opts.boardFocus;
    }

    boardHeight = () => this.realBoardHeight / this.currentZoom;
    boardWidth = () => this.realBoardWidth / this.currentZoom;
}

export default BoardVars;