import P = require('./painter');
import IR = require('./imageRepository');
import C = require('./canvas');
import L = require('./loader');
import O = require('../objects/objects');
import BG = require('./backgroundGrid');
import CO = require('./controls');

export class Scene {
    public fps = 0;
    //public player: PL.PlayerObject;
    public objects: O.MovingImgObject[] = [];
    private painter: P.Painter;
    private controls: CO.Controls;
    private lastFpsUpdateTimestamp: number;
    private cameraChanged = true;
    private redrawBackground = true;
    private lastFrameTimestamp: number;
    private cameraBoundary = 300;
    private defaultCameraBoundary = 300;
    private width = 3000;
    private height = 3000;
    private boundary = 400;
    public payload: IPayload;

    constructor(public drawArea: C.DrawArea, private loader: L.Loader, imageRepository: IR.ImageRepository) {
        this.updateDrawArea();
        this.initPainter(imageRepository);
        this.lastFpsUpdateTimestamp = this.getCurrentTimestamp();
        this.updateCameraBoundary();
    }

    private updateDrawArea(){
        this.drawArea.sceneWidth = this.width;
        this.drawArea.sceneHeight = this.height;
        this.drawArea.sceneBoundary = this.boundary;
    }

    private initPainter(imageRepository: IR.ImageRepository) {
        imageRepository.loadImages(() => {
            this.loader.componentLoaded(L.LoadableComponentType.images);
        });

        var bgLoaded = () => {this.loader.componentLoaded(L.LoadableComponentType.background);};
        var backgroundGrid = new BG.BackgroundGrid(this.drawArea, bgLoaded);
        this.painter = new P.Painter(imageRepository, this.drawArea, backgroundGrid);

        this.controls = new CO.Controls(imageRepository, this.drawArea);
    }

    process() {
        var timeSpanMs = this.getFrameTimeSpan();
        this.updateObjects(timeSpanMs);
        this.updateFps();
        this.updateCamera();
        if (this.redrawBackground || this.cameraChanged){
            this.painter.drawBackground(this.redrawBackground);
            this.redrawBackground = false;
            this.cameraChanged = false;
        }
        var payload = this.payload;
        var uiObjects: any = this.objects;
        var objects;
        if (payload){
            this.sortObjects(payload.o);
            objects = uiObjects.concat(payload.o);
        }
        else{
            objects = uiObjects;
        }
        this.painter.drawObjects(objects);
        this.updateControls();
    }

    layoutChanged(){
        this.redrawBackground = true;
        this.updateCameraBoundary();
    }

    isTouchingObstacle(location: IPoint, destination: IPoint, size: ISize): boolean{
        return this.isTouchingBoundary(destination, size);
    }

    isTouchingBoundary(destination: IPoint, size: ISize): boolean{
        return destination.x <= this.leftBoundary() ||
                destination.x + size.width >= this.rightBoundary() ||
                destination.y <= this.topBoundary() ||
                destination.y + size.height >= this.bottomBoundary();
    }

    modifyDestinationForObstacles(location: IPoint, destination: IPoint, size: ISize): IPoint{
        var result = this.modifyDestinationForBoundary(destination, size);
        return result;
    }

    modifyDestinationForBoundary(destination: IPoint, size: ISize): IPoint{
        var leftBoundary = this.leftBoundary();
        if (destination.x < leftBoundary){
            destination.x = leftBoundary;
        }

        var rightBoundary = this.rightBoundary();
        if (destination.x + size.width > rightBoundary){
            destination.x = rightBoundary - size.width;
        }

        var topBoundary = this.topBoundary();
        if (destination.y < topBoundary){
            destination.y = topBoundary;
        }

        var bottomBoundary = this.bottomBoundary();
        if (destination.y + size.height > bottomBoundary){
            destination.y = bottomBoundary - size.height;
        }

        return destination;
    }

    private updateCameraBoundary(){
        var val = this.drawArea.width / 2;
        if (this.drawArea.height / 2 < val){
            val = this.drawArea.height / 2;
        }

        if (this.defaultCameraBoundary < val){
            val = this.defaultCameraBoundary;
        }

        this.cameraBoundary = val;
    }

    private leftBoundary(): number{
        return this.drawArea.sceneBoundary + this.drawArea.xOffset;
    }

    private rightBoundary(): number{
        return this.drawArea.sceneBoundary + this.drawArea.sceneWidth + this.drawArea.xOffset;
    }

    private topBoundary(): number{
        return this.drawArea.sceneBoundary + this.drawArea.yOffset;
    }

    private bottomBoundary(): number{
        return this.drawArea.sceneBoundary + this.drawArea.sceneHeight + this.drawArea.yOffset;
    }

    private sortObjects(objects: Array<IObjectPayload>){
        objects.sort((obj1, obj2) => {
            var a = obj1.l;
            var b = obj2.l;

            var result;
            if (obj1.z){
                result = 1;
            } else if (obj2.z){
                result = -1;
            } else {
                result = a.y > b.y
                    ? 1
                    : a.y < b.y
                    ? -1
                    : a.x > b.x
                    ? 1
                    : a.x < b.x
                    ? -1
                    : 0;
            }

            return result;
        });
    }

    private updateCamera() {
        var xOffset = 0;
        var playerLocation = {
            x: this.payload.p.l.x + this.drawArea.xOffset,
            y: this.payload.p.l.y + this.drawArea.yOffset
        };

        if (playerLocation.x < this.cameraBoundary) {
            xOffset = this.cameraBoundary - playerLocation.x;
        } else if (playerLocation.x > this.drawArea.width - this.cameraBoundary) {
            xOffset = this.drawArea.width - (playerLocation.x + this.cameraBoundary);
        }

        var yOffset = 0;
        if (playerLocation.y < this.cameraBoundary) {
            yOffset = this.cameraBoundary - playerLocation.y;
        } else if (playerLocation.y > this.drawArea.height - this.cameraBoundary){
            yOffset = this.drawArea.height - (playerLocation.y + this.cameraBoundary);
        }

        if (xOffset !== 0 || yOffset !== 0) {
            this.cameraChanged = true;
            this.drawArea.xOffset += xOffset;
            this.drawArea.yOffset += yOffset;
        }
    }

    private getFrameTimeSpan(){
        var now = new Date().getTime();
        if (this.lastFrameTimestamp === undefined){
            this.lastFrameTimestamp = now;
        }

        var result = now - this.lastFrameTimestamp;
        this.lastFrameTimestamp = now;

        return result;
    }

    private updateObjects(timeSpanMs) {
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            obj.proceed(timeSpanMs);
        }

        this.clearRemovedObjects();
    }

    private clearRemovedObjects() {
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].remove) {
                this.objects.splice(i, 1);
                i--;
            }
        }
    }

    private isObjectOutOfBounds(x: number, y: number, width: number, height: number) {
        return x + width < 0 || x > this.painter.drawArea.width
            || y + height < 0 || y > this.painter.drawArea.height;
    }

    private updateFps(){
        var now = this.getCurrentTimestamp();
        if (now - this.lastFpsUpdateTimestamp > 1000) {
            this.lastFpsUpdateTimestamp = now;
            this.controls.drawFps(this.fps);
        }
    }

    private getCurrentTimestamp(){
        return new Date().getTime();
    }

    private updateControls(){
        this.controls.drawHp(this.payload.p.h);
    }
}



