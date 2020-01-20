import { boardYRelativeToFocus, boardXRelativeToFocus } from './util';
import { baseLog, boundNum } from '../util';

class Canvas {
    constructor(canvasId) {
        this.element = document.getElementById(canvasId);
        this.ctx = this.element.getContext("2d");
        this.homepageYOffset = 0;
        this.clockAngle = 0;
        this.showInstructions = true;
        this.homepageTime = null;
        this.setupImages();
    }

    buildAndColorAmoeba = (amoeba, boardVars, mouseVars, colorize) => {
        if (amoeba.mass <= 0) {
            return;
        }
        if (isNaN(amoeba.xpos) || isNaN(amoeba.ypos) ){
            // DEBUG: somehow these get turned into NaN when absorbed completely by another amoeba
            amoeba.mass = 0;
            return;
        }

        amoeba.adjustRadius();

        const relativeY = boardYRelativeToFocus({
            boardFocusY: boardVars.boardFocus.y,
            boardHeight: boardVars.boardHeight(),
            innerHeight: window.innerHeight,
            mouseOffsetY: mouseVars.mouseOffset.y,
        })(amoeba.ypos);
        const relativeX = boardXRelativeToFocus({
            boardFocusX: boardVars.boardFocus.x,
            boardWidth: boardVars.boardWidth(),
            innerWidth: window.innerWidth,
            mouseOffsetX: mouseVars.mouseOffset.x,
        })(amoeba.xpos);

        let relativeRadius = amoeba.radius / boardVars.realBoardWidth * 1000 * boardVars.currentZoom;

        //radius cannot be kept proportional to window.innerWidth, it will throw off their size on screen

        let gradient = colorize(amoeba, relativeX, relativeY, relativeRadius, boardVars.baseMass);

        this.ctx.beginPath();
        this.ctx.arc(relativeX, relativeY, relativeRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    };

    drawAmoeboi = (amoeboi, boardVars, mouseVars) => {
        this.buildAndColorAmoeba(amoeboi, boardVars, mouseVars, this.colorizeAmoeboi);
    };

    drawAmoeba = (amoeboi, boardVars, mouseVars) => {
        this.buildAndColorAmoeba(amoeboi, boardVars, mouseVars, this.colorizeAmoeba);
    };

    colorizeAmoeba = (amoeba, relativeX, relativeY, relativeRadius, baseMass) => {
        if (amoeba.mass <= 0) {
            return;
        }

        let gradient = this.ctx.createRadialGradient(relativeX, relativeY, relativeRadius, relativeX, relativeY, 0);
        if (amoeba.mass < baseMass) {
            gradient.addColorStop(0, `rgb(${20}, ${20}, ${255})`);
            gradient.addColorStop(boundNum(1 - (amoeba.mass / baseMass),0, 1) , `rgb(${50}, ${20}, ${200})`);
            gradient.addColorStop(1 , `rgb(${255}, ${20}, ${20})`);
        } else {
            gradient.addColorStop(0, `rgb(${255}, ${20}, ${20})`);
            gradient.addColorStop(boundNum(1 -(baseMass / amoeba.mass), 0, 1) , `rgb(${200}, ${20}, ${50})` );
            gradient.addColorStop(1 , `rgb(${20}, ${20}, ${255})`);
        }
        return gradient;
    };

    colorizeAmoeboi = (amoeboi, relativeX, relativeY, relativeRadius) => {
        if (amoeboi.mass <= 0) {
            return;
        }
        let gradient = this.ctx.createRadialGradient(relativeX, relativeY,relativeRadius, relativeX, relativeY, 0);
        gradient.addColorStop(0, `rgb(${0}, ${255}, ${0})`);
        gradient.addColorStop(1, `rgb(${0}, ${150}, ${0})`);
        return gradient;
    };

    makePause = (mousePosX, mousePosY) => {
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        let mouseOffsetX = mousePosX / window.innerWidth * 50;
        let mouseOffsetY = mousePosY / window.innerHeight * 50;

        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.font = '70px Impact';
        let titlePosX = (window.innerWidth / 2) - 75 - mouseOffsetX;
        let titlePosY = (window.innerHeight / 2) + 50 - mouseOffsetY + this.homepageYOffset;
        this.ctx.fillText(`PAUSED`, titlePosX, titlePosY);
    };

    makeClock = (timeVars) => {
        this.ctx.globalAlpha = 0.7;

        this.ctx.beginPath();
        this.ctx.arc(120, 120, 65, 0, ((baseLog(timeVars.timeBase, timeVars.timeCoefficient) + 1) / 2 * Math.PI * 2));
        this.ctx.strokeStyle = 'orange';
        this.ctx.lineWidth = 5;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(120, 120, 60, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillStyle = 'white';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(120,120);
        this.ctx.lineTo(120 + (60*Math.cos(this.clockAngle * Math.PI / 180)), 120 + (60*Math.sin(this.clockAngle * Math.PI / 180)));
        this.ctx.fillStyle = 'black';
        this.ctx.stroke();
        this.clockAngle = (this.clockAngle + (timeVars.timeCoefficient)) % 360;
        this.ctx.globalAlpha = 1;
    };

    drawField = (boardVars, mouseVars, quadtree) => {
        const relY = boardYRelativeToFocus({
            boardFocusY: boardVars.boardFocus.y,
            boardHeight: boardVars.boardHeight(),
            innerHeight: window.innerHeight,
            mouseOffsetY: mouseVars.mouseOffset.y,
        });
        const relX = boardXRelativeToFocus({
            boardFocusX: boardVars.boardFocus.x,
            boardWidth: boardVars.boardWidth(),
            innerWidth: window.innerWidth,
            mouseOffsetX: mouseVars.mouseOffset.x,
        });
        this.drawBorders(relX, relY, boardVars.realBoardWidth, boardVars.realBoardHeight);
        this.drawGrid(relX, relY, boardVars.realBoardWidth, boardVars.realBoardHeight);
        // this.drawQuadtree(relX, relY, quadtree);
    };

    drawGrid = (relX, relY, realBoardWidth, realBoardHeight) => {
        this.ctx.globalAlpha = 0.4;
        this.ctx.fillStyle = 'black';

        const interval = 500;
        let x = interval;
        const topBorderY = relY(0);
        const bottomBorderY =  relY(realBoardHeight);
        while (x < realBoardWidth) {
            this.ctx.fillRect(relX(x), topBorderY, 2, bottomBorderY - topBorderY);
            x += interval;
        }

        let y = interval;
        const leftBorderX = relX(0);
        const rightBorderX = relX(realBoardWidth);
        while (y < realBoardHeight) {
            this.ctx.fillRect(leftBorderX, relY(y), rightBorderX - leftBorderX, 2);
            y += interval;
        }

        this.ctx.globalAlpha = 1;
    };

    drawBorders = (relX, relY, realBoardWidth, realBoardHeight) => {
        this.ctx.globalAlpha = 0.4;
        this.ctx.fillStyle = 'red';

        const topBorderY = relY(0);
        const bottomBorderY =  relY(realBoardHeight);
        this.ctx.fillRect(relX(0), topBorderY, 2, bottomBorderY - topBorderY);
        this.ctx.fillRect(relX(realBoardWidth), topBorderY, 2, bottomBorderY - topBorderY);

        const leftBorderX = relX(0);
        const rightBorderX = relX(realBoardWidth);
        this.ctx.fillRect(leftBorderX, relY(0), rightBorderX - leftBorderX, 2);
        this.ctx.fillRect(leftBorderX, relY(realBoardHeight), rightBorderX - leftBorderX, 2);

        this.ctx.globalAlpha = 1;
    };

    drawQuadtree = (relX, relY, quadtree) => {
        if (!quadtree || !quadtree.quadrants.length) return;
        this.ctx.globalAlpha = 0.4;
        this.ctx.strokeStyle = 'black';

        const relativeX = relX(quadtree.x);
        const relativeY = relY(quadtree.y);
        const relativeEndX = relX(quadtree.endX);
        const relativeEndY = relY(quadtree.endY);
        const relativeHalfX = relX(quadtree.halfX);
        const relativeHalfY = relY(quadtree.halfY);
        this.ctx.beginPath();
        this.ctx.moveTo(relativeX, relativeHalfY);
        this.ctx.lineTo(relativeEndX, relativeHalfY);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(relativeHalfX, relativeY);
        this.ctx.lineTo(relativeHalfX, relativeEndY);
        this.ctx.closePath();
        this.ctx.stroke();

        quadtree.quadrants.forEach(subQuadtree => {
           this.drawQuadtree(relX, relY, subQuadtree);
        });

        this.ctx.globalAlpha = 1;
    };

    makeMassDisplay = (amoeboi) => {
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = 'black';
        let displayWidth;
        if (amoeboi.mass > 0) {
            displayWidth = 130 + (15 * boundNum(Math.floor(Math.log10(amoeboi.mass / 100),1, 10000)));
        } else {
            displayWidth = 145;
        }
        this.ctx.fillRect(window.innerWidth - 220, 65, displayWidth, 50);
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Impact';
        this.ctx.fillText(`Mass: ${Math.floor(amoeboi.mass / 100) }`, window.innerWidth - 200, 100);
    };

    makeInstructions = (muted, autoscaleTime) => {
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = 'black';
        if (!this.showInstructions) {
            this.ctx.fillRect(50, 65, 340, 50);
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = 'white';
            this.ctx.font = '20px Arial Black';
            this.ctx.fillText(`PRESS I FOR INSTRUCTIONS`, 60, 100);
            return;
        }
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(50, 65, 365, 320);
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial Black';
        this.ctx.fillText(`SPACE   :  Pause`, 60, 95);
        this.ctx.fillText(` SHIFT   :  Look Around`, 61, 135);
        this.ctx.fillText(`SCROLL :  Zoom In/Out`, 60, 170);
        this.ctx.fillText(`     H      :  Main Menu`, 65, 215);
        this.ctx.fillText(`     R      :  Restart`, 65, 255);
        this.ctx.fillText(`     I       :  Toggle Instructions`, 67, 295);
        this.ctx.fillText(`     M      :  Toggle Volume (${muted ? "OFF" : "ON"})`, 63, 335);
        this.ctx.fillText(`     A      :  Autoscale Time (${autoscaleTime ? "ON" : "OFF"})`, 63, 375);
    };

    makeMargins = (timeVars) => {
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = "black";
        let marginHeight = Math.floor(window.innerHeight / 8);


        let timebarWidth = 500;
        let timebarHeight = 50;
        let timebarX = (window.innerWidth / 2) - (timebarWidth / 2);
        let timebarY = window.innerHeight - (marginHeight / 2) - (timebarHeight / 2);
        let time0to1 = (baseLog(timeVars.timeBase, timeVars.timeCoefficient) + 1) / 2;

        this.ctx.fillStyle = `black`;
        this.ctx.fillRect(timebarX - 10, timebarY, timebarWidth + 20, timebarHeight);
        this.ctx.fillStyle = `white`;
        this.ctx.fillRect(timebarX + (timebarWidth * time0to1) - 10, timebarY, 20, timebarHeight);
        this.ctx.globalAlpha = 1;
    };

    makeWinScreen = (mouseVars) => {
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        let mouseOffsetX = mouseVars.mousePos.x / window.innerWidth * 50;
        let mouseOffsetY = mouseVars.mousePos.y / window.innerHeight * 50;
        let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
        let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + this.homepageYOffset;
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.font = '70px Impact';
        this.ctx.fillText(`YOU'VE WON`, titlePosX + 55, titlePosY - 920);
        this.ctx.font = '40px Impact';
        this.ctx.fillText(`Press C to continue`, titlePosX + 65, titlePosY - 840);
    };

    setupImages = () => {
        this.iconImages = {};
        let fileNames = ['githubLogo', 'linkedInLogo', 'folderIcon', 'volume','volumeReverse','mute', 'muteReverse'];
        fileNames.forEach(fileName => this.setupImage(fileName));
    };

    setupImage = (fileName) => {
        this.iconImages[fileName] = new Image();
        this.iconImages[fileName].src = `../assets/images/${fileName}.png`;
    };

    makeHomepage = (mouseVars, muted) =>{
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        let mouseOffsetX = mouseVars.mousePos.x / window.innerWidth * 50;
        let mouseOffsetY = mouseVars.mousePos.y / window.innerHeight * 50;

        let homepageWave = Math.sin(((Date.now() - this.homepageTime) % 1500) / 1500 * Math.PI);

        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.font = '120px Impact';
        let titlePosX = (window.innerWidth / 2) - 195 - mouseOffsetX;
        let titlePosY = (window.innerHeight / 2) - 80 - mouseOffsetY + this.homepageYOffset;
        this.ctx.fillText(`AmoeBoi`, titlePosX, titlePosY);

        this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = "rgb(0,0,50)";
        this.ctx.fillRect(titlePosX - 300, titlePosY + 885, 1050, 530);
        this.ctx.globalAlpha = 1;


        this.ctx.fillStyle = "rgb(240,240,240)";
        this.ctx.font = `${30 + (2 * homepageWave) }px Impact`;
        this.ctx.fillText(`PRESS ENTER TO START`, titlePosX + 85 - (5 * homepageWave), titlePosY + 100 + (2 * homepageWave));

        this.ctx.font = '50px Impact';
        this.ctx.fillText(`⬇ INSTRUCTIONS ⬇`, titlePosX + 15, titlePosY + 360);

        this.ctx.fillText(`⬆ MAIN MENU ⬆`, titlePosX + 50, titlePosY + 850);

        this.ctx.font = '25px Arial Black';
        this.ctx.fillText("Become the Biggest!", titlePosX + 80, titlePosY + 930);

        this.ctx.fillText("Absorb smaller amoebas, avoid the bigger ones,", titlePosX - 105, titlePosY + 1000);
        this.ctx.fillText("and become the biggest blob in the land.", titlePosX - 55, titlePosY + 1030);

        this.ctx.fillText("Aim and hold the left mouse button to shoot out smaller amoebas", titlePosX - 222.5, titlePosY + 1100);
        this.ctx.fillText("and propel yourself the other way... but be careful!", titlePosX - 120, titlePosY + 1130);
        this.ctx.fillText("Every shot uses a little bit of your own mass.", titlePosX - 80, titlePosY + 1160);

        this.ctx.fillText("You can speed up or slow down time using the left/right arrow keys.", titlePosX - 240, titlePosY + 1230);

        this.ctx.fillText("Press space to pause the game", titlePosX + 10, titlePosY + 1300);
        this.ctx.fillText("and press H to return to the Main Menu at any time.", titlePosX - 130, titlePosY + 1330);

        this.ctx.fillText("PRESS ENTER TO START", titlePosX + 50 , titlePosY + 1400);

        this.ctx.drawImage(this.iconImages.githubLogo, titlePosX - 50, titlePosY + 170, 80, 80);
        this.ctx.drawImage(this.iconImages.linkedInLogo, titlePosX + 180, titlePosY + 170, 72, 72);
        this.ctx.drawImage(this.iconImages.folderIcon, titlePosX + 380, titlePosY + 170, 88, 88);
        this.ctx.drawImage(muted ? this.iconImages.mute : this.iconImages.volume, titlePosX - 5,
            titlePosY + (muted ? 60 : 65), 50, 50);
        this.ctx.drawImage(muted ? this.iconImages.muteReverse : this.iconImages.volumeReverse, titlePosX + 400,
            titlePosY + (muted ? 60 : 65), 50, 50);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '70px Impact';
        this.ctx.fillText(`YOU'VE LOST`, titlePosX + 55, titlePosY - 920);
        this.ctx.font = '40px Impact';
        this.ctx.fillText(`Press R to play again`, titlePosX + 50, titlePosY - 840);
        this.ctx.fillText(`Press H to return to Main Menu`, titlePosX - 27.5, titlePosY - 760);
    };
};

export default Canvas;