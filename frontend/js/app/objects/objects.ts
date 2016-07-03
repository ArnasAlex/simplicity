/// <reference path='../../typings/refs.d.ts' />
import AM = require('../core/axisMovement');
import S = require('../core/scene');

export class Images {
    public static player: Image = {name: 'player', size: {width: 50, height: 50}, type: GameObjectType.Player};
    public static shot: Image = {name: 'shot', size: {width: 10, height: 10}, type: GameObjectType.Shot};
    public static enemy: Image = {name: 'enemy', size: {width: 50, height: 50}, type: GameObjectType.Enemy};
    public static stroke: Image = {name: 'stroke', size: {width: 10, height: 25}, type: GameObjectType.Stroke};

    public static allObjects: Image[] = [
        Images.player,
        Images.shot,
        Images.enemy,
        Images.stroke
    ];

    public static objectsByType: Array<Image>;
    public static getImageByType(type: GameObjectType): Image{
        if (Images.objectsByType === undefined){
            Images.objectsByType = [];
            for (var i = 0; i < Images.allObjects.length; i++){
                var img = Images.allObjects[i];
                Images.objectsByType[img.type] = img;
            }
        }

        return Images.objectsByType[type];
    }
}

export interface Image{
    name: string;
    size: ISize;
    type: GameObjectType;
}

export class MovingImgObject {
    public axes: AM.AxesMovement;
    public remove = false;
    public rotation = 0;
    public onTop = false;

    constructor(
        protected scene: S.Scene,
        public image: Image,
        location: IPoint,
        xSpeed: number,
        ySpeed: number
    ) {
        this.initAxes(location, xSpeed, ySpeed);
    }

    private initAxes(location, xSpeed, ySpeed){
        this.axes = new AM.AxesMovement(location, xSpeed, ySpeed);
    }

    proceed(timeSpan) {
        var moveDestination = this.axes.getDestination(timeSpan);
        var location = this.getLocation();
        var destination = {x: moveDestination.x.coordinate, y: moveDestination.y.coordinate};
        destination = this.scene.modifyDestinationForObstacles(location, destination, this.image.size);
        moveDestination.x.coordinate = destination.x;
        moveDestination.y.coordinate = destination.y;

        this.axes.x.update(moveDestination.x);
        this.axes.y.update(moveDestination.y);
    }

    changeLocation(location: IPoint){
        this.axes.changeLocation(location);
    }

    getLocation(): IPoint{
        return {x: this.axes.x.coordinate, y: this.axes.y.coordinate};
    }

    getCenterLocation(): IPoint{
        return {
            x: this.axes.x.coordinate + this.image.size.width / 2,
            y: this.axes.y.coordinate + this.image.size.height / 2
        };
    }

    changeLocationForCamera(xOffset, yOffset){
        var location = this.getLocation();
        location.x += xOffset;
        location.y += yOffset;
        this.changeLocation(location);
    }

    changeSpeed(xSpeed, ySpeed){
        this.axes.changeSpeed(xSpeed, ySpeed);
    }

    calculateDirection(startLocation: IPoint, destination: IPoint): IPoint{
        var x = destination.x;
        var y = destination.y;

        var xDiff = x - startLocation.x;
        var yDiff = y - startLocation.y;

        var momentum;
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            momentum = xDiff;
        } else {
            momentum = yDiff;
        }

        momentum = Math.abs(momentum);

        if (momentum !== 0) {
            var xMoveStep = xDiff / momentum;
            var yMoveStep = yDiff / momentum;
            return {x: xMoveStep, y: yMoveStep};
        }
        else {
            return {x: 0, y: 0};
        }
    }

    protected getDistanceBetween(a: IPoint, b: IPoint){
        var result = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        return result;
    }
}

export class AnimatingObject extends MovingImgObject {
    alpha = 1;
    currentFrame = 0;
    constructor(
        scene: S.Scene,
        image: Image,
        location: IPoint,
        xSpeed: number,
        ySpeed: number
    ){
        super(scene, image, location, xSpeed, ySpeed);
    }

    public turnRight(){
        return this.changeFrame(0) === true;
    }

    public turnLeft() {
        return this.changeFrame(1) === true;
    }

    public turnUp(){
        return this.changeFrame(2) === true;
    }

    public updateSight(sightPoint: IPoint) {
        var location = this.getLocation();
        var lookingUp = sightPoint.y < location.y;
        var xNear = Math.abs(sightPoint.x - location.x) < 150;
        if (lookingUp && xNear) {
            this.turnUp();
        }
        else if (sightPoint.x < location.x) {
            this.turnLeft();
        } else {
            this.turnRight();
        }
    }

    private changeFrame(nr: number){
        if (this.currentFrame != nr && this.currentFrame != nr + 3){
            this.currentFrame = nr;
            return true;
        }
    }
}