var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../core/axisMovement'], function (require, exports, AM) {
    var Images = (function () {
        function Images() {
        }
        Images.getImageByType = function (type) {
            if (Images.objectsByType === undefined) {
                Images.objectsByType = [];
                for (var i = 0; i < Images.allObjects.length; i++) {
                    var img = Images.allObjects[i];
                    Images.objectsByType[img.type] = img;
                }
            }
            return Images.objectsByType[type];
        };
        Images.player = { name: 'player', size: { width: 50, height: 50 }, type: 0 /* Player */ };
        Images.shot = { name: 'shot', size: { width: 10, height: 10 }, type: 2 /* Shot */ };
        Images.enemy = { name: 'enemy', size: { width: 50, height: 50 }, type: 1 /* Enemy */ };
        Images.stroke = { name: 'stroke', size: { width: 10, height: 25 }, type: 3 /* Stroke */ };
        Images.allObjects = [
            Images.player,
            Images.shot,
            Images.enemy,
            Images.stroke
        ];
        return Images;
    })();
    exports.Images = Images;
    var MovingImgObject = (function () {
        function MovingImgObject(scene, image, location, xSpeed, ySpeed) {
            this.scene = scene;
            this.image = image;
            this.remove = false;
            this.rotation = 0;
            this.onTop = false;
            this.initAxes(location, xSpeed, ySpeed);
        }
        MovingImgObject.prototype.initAxes = function (location, xSpeed, ySpeed) {
            this.axes = new AM.AxesMovement(location, xSpeed, ySpeed);
        };
        MovingImgObject.prototype.proceed = function (timeSpan) {
            var moveDestination = this.axes.getDestination(timeSpan);
            var location = this.getLocation();
            var destination = { x: moveDestination.x.coordinate, y: moveDestination.y.coordinate };
            destination = this.scene.modifyDestinationForObstacles(location, destination, this.image.size);
            moveDestination.x.coordinate = destination.x;
            moveDestination.y.coordinate = destination.y;
            this.axes.x.update(moveDestination.x);
            this.axes.y.update(moveDestination.y);
        };
        MovingImgObject.prototype.changeLocation = function (location) {
            this.axes.changeLocation(location);
        };
        MovingImgObject.prototype.getLocation = function () {
            return { x: this.axes.x.coordinate, y: this.axes.y.coordinate };
        };
        MovingImgObject.prototype.getCenterLocation = function () {
            return {
                x: this.axes.x.coordinate + this.image.size.width / 2,
                y: this.axes.y.coordinate + this.image.size.height / 2
            };
        };
        MovingImgObject.prototype.changeLocationForCamera = function (xOffset, yOffset) {
            var location = this.getLocation();
            location.x += xOffset;
            location.y += yOffset;
            this.changeLocation(location);
        };
        MovingImgObject.prototype.changeSpeed = function (xSpeed, ySpeed) {
            this.axes.changeSpeed(xSpeed, ySpeed);
        };
        MovingImgObject.prototype.calculateDirection = function (startLocation, destination) {
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
        MovingImgObject.prototype.getDistanceBetween = function (a, b) {
            var result = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
            return result;
        };
        return MovingImgObject;
    })();
    exports.MovingImgObject = MovingImgObject;
    var AnimatingObject = (function (_super) {
        __extends(AnimatingObject, _super);
        function AnimatingObject(scene, image, location, xSpeed, ySpeed) {
            _super.call(this, scene, image, location, xSpeed, ySpeed);
            this.alpha = 1;
            this.currentFrame = 0;
        }
        AnimatingObject.prototype.turnRight = function () {
            return this.changeFrame(0) === true;
        };
        AnimatingObject.prototype.turnLeft = function () {
            return this.changeFrame(1) === true;
        };
        AnimatingObject.prototype.turnUp = function () {
            return this.changeFrame(2) === true;
        };
        AnimatingObject.prototype.updateSight = function (sightPoint) {
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
        AnimatingObject.prototype.changeFrame = function (nr) {
            if (this.currentFrame != nr && this.currentFrame != nr + 3) {
                this.currentFrame = nr;
                return true;
            }
        };
        return AnimatingObject;
    })(MovingImgObject);
    exports.AnimatingObject = AnimatingObject;
});
//# sourceMappingURL=objects.js.map