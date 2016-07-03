var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../../typings/refs.d.ts' />
var _ = require('lodash');
var GO = require('./gameObject');
var Shot = (function (_super) {
    __extends(Shot, _super);
    function Shot(arena, startLocation, destination, owner) {
        _super.call(this, 2 /* Shot */, Shot.size, arena, startLocation, 0, 0);
        this.startLocation = startLocation;
        this.destination = destination;
        this.owner = owner;
        this.shotSpeed = 7;
        this.maxDistance = 500;
        this.damage = 1;
        this.setSpeed(startLocation, destination);
    }
    Shot.prototype.setSpeed = function (startLocation, destination) {
        destination.x -= this.size.width / 2;
        destination.y -= this.size.height / 2;
        var direction = this.calculateDirection(startLocation, destination);
        this.changeSpeed(direction.x * this.shotSpeed, direction.y * this.shotSpeed);
    };
    Shot.prototype.proceed = function (timeSpan) {
        if (!this.hitEnemy() && !this.wentMaxDistance() && !this.hitObstacle()) {
            _super.prototype.proceed.call(this, timeSpan);
        }
    };
    Shot.prototype.changeLocationForCamera = function (xOffset, yOffset) {
        this.startLocation.x += xOffset;
        this.startLocation.y += yOffset;
        _super.prototype.changeLocationForCamera.call(this, xOffset, yOffset);
    };
    Shot.prototype.onRemove = function () {
        var nr = this.arena.shots.indexOf(this);
        this.arena.shots.splice(nr, 1);
    };
    Shot.prototype.hitEnemy = function () {
        var _this = this;
        var enemies = this.arena.getEnemies();
        var players = _.filter(this.arena.players, function (p) { return p !== _this.owner; });
        var targets = enemies.concat(players);
        var shotLocation = this.getLocation();
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            if (this.isSameLocationAsTarget(shotLocation, target)) {
                target.receiveDamage(this.damage, this.owner);
                this.remove = true;
                return true;
            }
        }
        return false;
    };
    Shot.prototype.isSameLocationAsTarget = function (shotLocation, target) {
        var targetLocation = target.getLocation();
        return shotLocation.x > targetLocation.x && shotLocation.x < targetLocation.x + target.size.width && shotLocation.y > targetLocation.y && shotLocation.y < targetLocation.y + target.size.height;
    };
    Shot.prototype.wentMaxDistance = function () {
        var distance = global.getDistanceBetween(this.getLocation(), this.startLocation);
        if (distance > this.maxDistance) {
            this.remove = true;
            return true;
        }
        return false;
    };
    Shot.prototype.hitObstacle = function () {
        var location = this.getLocation();
        var result = this.arena.isTouchingObstacle(location, location, this.size);
        if (result) {
            this.remove = true;
        }
        return result;
    };
    Shot.size = { width: 10, height: 10 };
    return Shot;
})(GO.GameObject);
exports.Shot = Shot;
//# sourceMappingURL=shot.js.map