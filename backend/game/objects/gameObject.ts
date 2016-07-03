/// <reference path='../../typings/refs.d.ts' />
import AM = require('../core/axisMovement');
import A = require('../core/arena');

export class GameObject {
    axes: AM.AxesMovement;
    remove = false;
    rotation = 0;
    onTop = false;
    alpha = 1;
    currentFrame = 0;

    constructor(
        public type: GameObjectType,
        public size: ISize,
        protected arena: A.Arena,
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
        destination = this.arena.modifyDestinationForObstacles(location, destination, this.size);
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
            x: this.axes.x.coordinate + this.size.width / 2,
            y: this.axes.y.coordinate + this.size.height / 2
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

    turnRight(){
        return this.changeFrame(0) === true;
    }

    turnLeft() {
        return this.changeFrame(1) === true;
    }

    turnUp(){
        return this.changeFrame(2) === true;
    }

    updateSight(sightPoint: IPoint) {
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

    onRemove(){
    }

    hasHp(){
        return false;
    }

    getHp(): number{
        throw Error('Override getHp method or do not override hasHp method on GameObject child class.');
    }

    private changeFrame(nr: number){
        if (this.currentFrame != nr && this.currentFrame != nr + 3){
            this.currentFrame = nr;
            return true;
        }
    }
}