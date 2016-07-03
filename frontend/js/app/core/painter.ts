/// <reference path='../../typings/refs.d.ts' />
import IR = require('./imageRepository');
import C = require('./canvas');
import O = require('../objects/objects');
import BG = require('./backgroundGrid');

export class Painter {
    private context: CanvasRenderingContext2D;
    private hpBarSize: ISize = {width: 50, height: 8};

    constructor(private imageRepository: IR.ImageRepository, public drawArea: C.DrawArea, private backgroundGrid: BG.BackgroundGrid) {
        this.context = drawArea.context;
    }

    drawBackground(redraw?: boolean) {
        this.backgroundGrid.draw(redraw);
    }

    drawObjects(objects: O.MovingImgObject[]) {
        this.drawArea.context.clearRect(0, 0, this.drawArea.width, this.drawArea.height);
        _.each(objects, (obj:O.MovingImgObject) => {
            if (obj instanceof O.AnimatingObject) {
                this.drawAnimatingObject(obj);
            }
            else{
                var payloadObj: IObjectPayload = <any>obj;
                var imgObj = O.Images.getImageByType(payloadObj.t);
                this.drawObject(payloadObj, imgObj.size);

                if (payloadObj.h !== undefined){
                    this.drawHP(payloadObj, imgObj.size);
                }
            }
        });
    }

    private drawObject(obj: IObjectPayload, size: ISize){
        var img = this.imageRepository.getImageByType(obj.t);
        var location = {x: obj.l.x + this.drawArea.xOffset, y: obj.l.y + this.drawArea.yOffset};
        if (obj.r !== undefined){
            this.drawWithRotation(img, obj.r, size, location);
        }
        else{
            this.draw(img, size, location);
        }
    }

    private drawHP(obj: IObjectPayload, imgSize: ISize){
        var location = obj.l;
        var x = location.x + imgSize.width / 2 - this.hpBarSize.width / 2 + this.drawArea.xOffset;
        var y = location.y - 2 - this.hpBarSize.height + this.drawArea.yOffset;
        this.fillHPBar(x, y, obj.h);
        this.drawHPBar(x, y);
    }

    private fillHPBar(x, y, hp){
        this.context.fillStyle = '#2b2b2b';
        this.context.fillRect(x, y, this.hpBarSize.width, this.hpBarSize.height);

        var widthHp = Math.ceil(this.hpBarSize.width * hp / 100);
        this.context.fillStyle = '#F25F57';
        this.context.fillRect(x, y, widthHp, this.hpBarSize.height);
    }

    private drawHPBar(x, y){
        this.context.beginPath();
        this.context.strokeStyle = 'white';
        this.context.lineWidth = 1;
        this.context.rect(x, y, this.hpBarSize.width, this.hpBarSize.height);
        this.context.stroke();
    }

    private drawMO(img: HTMLImageElement, obj: O.MovingImgObject, location: IPoint){
        this.context.drawImage(
            img,
            0, 0,
            obj.image.size.width, obj.image.size.height,
            location.x, location.y,
            obj.image.size.width, obj.image.size.height
        );
    }

    private draw(img: HTMLImageElement, size: ISize, location: IPoint){
        this.context.drawImage(
            img,
            0, 0,
            size.width, size.height,
            location.x, location.y,
            size.width, size.height
        );
    }

    private drawWithRotation(img: HTMLImageElement, rotation: number, size: ISize , location: IPoint){
        this.context.save();
        this.context.translate(location.x, location.y);
        this.context.rotate(rotation*Math.PI/180);
        this.draw(img, size, {x: -size.width/2, y: -size.height/2});
        this.context.restore();
    }

    private drawAnimatingObject(obj: O.AnimatingObject) {
        var img = this.imageRepository.getImage(obj.image.name);
        var location = obj.getLocation();
        this.context.globalAlpha = obj.alpha;

        this.context.drawImage(
            img,
            obj.image.size.width * obj.currentFrame, 0,
            obj.image.size.width, obj.image.size.height,
            location.x, location.y,
            obj.image.size.width, obj.image.size.height
        );

        this.context.globalAlpha = 1;
    }
}


