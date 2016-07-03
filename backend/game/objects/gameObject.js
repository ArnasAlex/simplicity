/// <reference path='../../typings/refs.d.ts' />
var AM = require('../core/axisMovement');
var GameObject = (function () {
    function GameObject(type, size, arena, location, xSpeed, ySpeed) {
        this.type = type;
        this.size = size;
        this.arena = arena;
        this.remove = false;
        this.rotation = 0;
        this.onTop = false;
        this.alpha = 1;
        this.currentFrame = 0;
        this.initAxes(location, xSpeed, ySpeed);
    }
    GameObject.prototype.initAxes = function (location, xSpeed, ySpeed) {
        this.axes = new AM.AxesMovement(location, xSpeed, ySpeed);
    };
    GameObject.prototype.proceed = function (timeSpan) {
        var moveDestination = this.axes.getDestination(timeSpan);
        var location = this.getLocation();
        var destination = { x: moveDestination.x.coordinate, y: moveDestination.y.coordinate };
        destination = this.arena.modifyDestinationForObstacles(location, destination, this.size);
        moveDestination.x.coordinate = destination.x;
        moveDestination.y.coordinate = destination.y;
        this.axes.x.update(moveDestination.x);
        this.axes.y.update(moveDestination.y);
    };
    GameObject.prototype.changeLocation = function (location) {
        this.axes.changeLocation(location);
    };
    GameObject.prototype.getLocation = function () {
        return { x: this.axes.x.coordinate, y: this.axes.y.coordinate };
    };
    GameObject.prototype.getCenterLocation = function () {
        return {
            x: this.axes.x.coordinate + this.size.width / 2,
            y: this.axes.y.coordinate + this.size.height / 2
        };
    };
    GameObject.prototype.changeLocationForCamera = function (xOffset, yOffset) {
        var location = this.getLocation();
        location.x += xOffset;
        location.y += yOffset;
        this.changeLocation(location);
    };
    GameObject.prototype.changeSpeed = function (xSpeed, ySpeed) {
        this.axes.changeSpeed(xSpeed, ySpeed);
    };
    GameObject.prototype.calculateDirection = function (startLocation, destination) {
        var x = destination.x;
        var y = destination.y;
        var xDiff = x - startLocation.x;
        var yDiff = y - startLocation.y;
        var momentum;
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            momentum = xDiff;
        }
        else {
            momentum = yDiff;
        }
        momentum = Math.abs(momentum);
        if (momentum !== 0) {
            var xMoveStep = xDiff / momentum;
            var yMoveStep = yDiff / momentum;
            return { x: xMoveStep, y: yMoveStep };
        }
        else {
            return { x: 0, y: 0 };
        }
    };
    GameObject.prototype.turnRight = function () {
        return this.changeFrame(0) === true;
    };
    GameObject.prototype.turnLeft = function () {
        return this.changeFrame(1) === true;
    };
    GameObject.prototype.turnUp = function () {
        return this.changeFrame(2) === true;
    };
    GameObject.prototype.updateSight = function (sightPoint) {
        var location = this.getLocation();
        var lookingUp = sightPoint.y < location.y;
        var xNear = Math.abs(sightPoint.x - location.x) < 150;
        if (lookingUp && xNear) {
            this.turnUp();
        }
        else if (sightPoint.x < location.x) {
            this.turnLeft();
        }
        else {
            this.turnRight();
        }
    };
    GameObject.prototype.onRemove = function () {
    };
    GameObject.prototype.hasHp = function () {
        return false;
    };
    GameObject.prototype.getHp = function () {
        throw Error('Override getHp method or do not override hasHp method on GameObject child class.');
    };
    GameObject.prototype.changeFrame = function (nr) {
        if (this.currentFrame != nr && this.currentFrame != nr + 3) {
            this.currentFrame = nr;
            return true;
        }
    };
    return GameObject;
})();
exports.GameObject = GameObject;
//# sourceMappingURL=gameObject.js.map