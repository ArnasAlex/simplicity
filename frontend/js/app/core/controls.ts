/// <reference path='../../typings/refs.d.ts' />
import IR = require('./imageRepository');
import C = require('./canvas');

export class Controls {
    private context: CanvasRenderingContext2D;
    private hpBarSize: ISize = {width: 400, height: 20};

    constructor(private imageRepository: IR.ImageRepository, public drawArea: C.DrawArea) {
        this.context = drawArea.controlsContext;
    }

    drawFps(fps: number){
        var x = this.drawArea.width - 100;
        var y = 50;
        this.context.clearRect(x, y/2, 105, 30);
        this.context.fillStyle = 'gray';
        this.context.font = "bold 30px Antic";
        this.context.fillText("FPS:" + fps, x, y);
    }

    drawHp(hp: number){
        var x = this.drawArea.width / 2 - this.hpBarSize.width / 2;
        var y = this.drawArea.height - this.hpBarSize.height - 30;
        this.clearHPBar(x, y);
        this.fillHPBar(x, y, hp);
        this.drawHPBar(x, y);
    }

    private clearHPBar(x, y){
        this.context.clearRect(x, y, this.hpBarSize.width, this.hpBarSize.height);
    }

    private fillHPBar(x, y, hp){
        this.context.fillStyle = '#2b2b2b';
        this.context.fillRect(x, y, this.hpBarSize.width, this.hpBarSize.height);

        var widthHp = Math.ceil(this.hpBarSize.width * hp / 100);
        this.context.fillStyle = '#28c938';
        this.context.fillRect(x, y, widthHp, this.hpBarSize.height);
    }

    private drawHPBar(x, y){
        this.context.beginPath();
        this.context.strokeStyle = 'white';
        this.context.lineWidth = 1;
        this.context.rect(x, y, this.hpBarSize.width, this.hpBarSize.height);
        this.context.stroke();
    }
}


