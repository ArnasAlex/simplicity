var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../../typings/refs.d.ts' />
var GO = require('./gameObject');
var Stroke = (function (_super) {
    __extends(Stroke, _super);
    function Stroke(arena, ownerLocation, ownerSize, destination, target) {
        _super.call(this, 3 /* Stroke */, Stroke.size, arena, ownerLocation, 0, 0);
        this.ownerLocation = ownerLocation;
        this.ownerSize = ownerSize;
        this.destination = destination;
        this.target = target;
        this.damage = 1;
        this.range = 5;
        this.speed = 2;
        this.lifeSpan = 200;
        this.executed = new Date().getTime();
        this.hadHit = false;
        this.init(ownerLocation, ownerSize, destination);
        this.onTop = true;
    }
    Stroke.prototype.init = function (ownerLocation, ownerSize, destination) {
        var direction = this.calculateDirection(ownerLocation, destination);
        this.setLocation(ownerLocation, direction, ownerSize);
        this.setRotation(destination, ownerLocation);
        this.setSpeed(destination, direction);
    };
    Stroke.prototype.setSpeed = function (destination, direction) {
        destination.x -= this.size.width / 2;
        destination.y -= this.size.height / 2;
        this.changeSpeed(direction.x * this.speed, direction.y * this.speed);
    };
    Stroke.prototype.setLocation = function (ownerLocation, direction, ownerSize) {
        ownerLocation.x += direction.x * (ownerSize.width / 2 - this.range);
        ownerLocation.y += direction.y * (ownerSize.height / 2 - this.range);
        this.changeLocation(ownerLocation);
    };
    Stroke.prototype.setRotation = function (destination, location) {
        var deltaY = location.y - destination.y;
        var deltaX = location.x - destination.x;
        this.rotation = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    };
    Stroke.prototype.proceed = function (timeSpan) {
        this.hitPlayer();
        if (!this.fadeOut()) {
            _super.prototype.proceed.call(this, timeSpan);
        }
    };
    Stroke.prototype.onRemove = function () {
        var nr = this.arena.strokes.indexOf(this);
        this.arena.strokes.splice(nr, 1);
    };
    Stroke.prototype.hitPlayer = function () {
        if (!this.hadHit) {
            var strokeLocation = this.getLocation();
            var player = this.target;
            if (this.isSameLocationAsPlayer(strokeLocation, player)) {
                player.receiveDamage(this.damage);
                this.hadHit = true;
            }
        }
    };
    Stroke.prototype.isSameLocationAsPlayer = function (strokeLocation, player) {
        var playerLocation = player.getLocation();
        return strokeLocation.x > playerLocation.x && strokeLocation.x < playerLocation.x + player.size.width && strokeLocation.y > playerLocation.y && strokeLocation.y < playerLocation.y + player.size.height;
    };
    Stroke.prototype.fadeOut = function () {
        var now = new Date().getTime();
        if (now > this.executed + this.lifeSpan) {
            this.remove = true;
            return true;
        }
        return false;
    };
    Stroke.size = { width: 10, height: 25 };
    return Stroke;
})(GO.GameObject);
exports.Stroke = Stroke;
//# sourceMappingURL=stroke.js.map