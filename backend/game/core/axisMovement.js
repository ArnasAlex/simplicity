/// <reference path='../../typings/refs.d.ts' />
var AxisMovement = (function () {
    function AxisMovement(coordinate, speed) {
        this.coordinate = coordinate;
        this.speed = speed;
        this.remainder = 0;
    }
    AxisMovement.prototype.update = function (moveDestination) {
        this.coordinate = moveDestination.coordinate;
        this.remainder = moveDestination.remainder;
    };
    AxisMovement.prototype.reset = function (coordinate) {
        this.coordinate = coordinate;
    };
    AxisMovement.prototype.changeSpeed = function (speed) {
        this.speed = speed;
    };
    AxisMovement.prototype.getMoveDestination = function (timeSpan) {
        var distance = this.getDistance(this.speed, timeSpan);
        distance += this.remainder;
        var rounded = Math.floor(distance);
        return {
            coordinate: this.coordinate + rounded,
            remainder: distance - rounded
        };
    };
    AxisMovement.prototype.getDistance = function (speed, timeSpan) {
        return speed * timeSpan / AxisMovement.speedConst;
    };
    AxisMovement.speedConst = 16;
    return AxisMovement;
})();
exports.AxisMovement = AxisMovement;
var AxesMovement = (function () {
    function AxesMovement(location, xSpeed, ySpeed) {
        if (xSpeed === void 0) { xSpeed = 0; }
        if (ySpeed === void 0) { ySpeed = 0; }
        this.x = new AxisMovement(location.x, xSpeed);
        this.y = new AxisMovement(location.y, ySpeed);
    }
    AxesMovement.prototype.changeLocation = function (location) {
        this.x.reset(location.x);
        this.y.reset(location.y);
    };
    AxesMovement.prototype.changeSpeed = function (xSpeed, ySpeed) {
        this.x.changeSpeed(xSpeed);
        this.y.changeSpeed(ySpeed);
    };
    AxesMovement.prototype.getDestination = function (timeSpan) {
        var x = this.x.getMoveDestination(timeSpan);
        var y = this.y.getMoveDestination(timeSpan);
        return { x: x, y: y };
    };
    return AxesMovement;
})();
exports.AxesMovement = AxesMovement;
//# sourceMappingURL=axisMovement.js.map