var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../../typings/refs.d.ts' />
var GO = require('./gameObject');
var SH = require('./shot');
var PlayerObject = (function (_super) {
    __extends(PlayerObject, _super);
    function PlayerObject(id, arena, location) {
        _super.call(this, 0 /* Player */, PlayerObject.size, arena, location, 0, 0);
        this.id = id;
        this.speed = 2;
        this.isDead = false;
        this.isInvincible = false;
        this.lastShotTimeStamp = null;
        this.hp = PlayerObject.totalHp;
    }
    PlayerObject.prototype.update = function (mouseLocation) {
        this.updateSight(mouseLocation);
        this.updateFrame();
    };
    PlayerObject.prototype.shoot = function (targetLocation) {
        this.createShot(targetLocation);
        this.lastShotTimeStamp = global.now();
        if (!this.isShotAnimation()) {
            this.setShotAnimation();
        }
    };
    PlayerObject.prototype.changeSpeed = function (xSpeed, ySpeed) {
        _super.prototype.changeSpeed.call(this, xSpeed * this.speed, ySpeed * this.speed);
    };
    PlayerObject.prototype.receiveDamage = function (dmg) {
        if (!this.isInvincible) {
            this.hp -= dmg;
            if (this.hp <= 0) {
                //this.hp = 0;
                //this.isDead = true;
                this.hp = PlayerObject.totalHp;
            }
        }
    };
    PlayerObject.prototype.hasHp = function () {
        return true;
    };
    PlayerObject.prototype.getHp = function () {
        return Math.ceil((this.hp / PlayerObject.totalHp) * 100);
    };
    PlayerObject.prototype.createShot = function (destination) {
        var playerLocation = this.getLocation();
        playerLocation.x += this.size.width / 2;
        playerLocation.y += this.size.height / 2;
        var shot = new SH.Shot(this.arena, playerLocation, destination, this);
        this.arena.shots.push(shot);
        this.arena.objects.push(shot);
    };
    PlayerObject.prototype.updateFrame = function () {
        if (this.lastShotTimeStamp) {
            var now = global.now();
            if (this.isShotAnimation() && now - this.lastShotTimeStamp > 200) {
                this.setNormalAnimation();
                this.lastShotTimeStamp = null;
            }
        }
    };
    PlayerObject.prototype.setShotAnimation = function () {
        if (this.currentFrame < 2) {
            this.currentFrame += 3;
        }
    };
    PlayerObject.prototype.setNormalAnimation = function () {
        this.currentFrame -= 3;
    };
    PlayerObject.prototype.isShotAnimation = function () {
        return this.currentFrame > 2;
    };
    PlayerObject.size = { width: 50, height: 50 };
    PlayerObject.totalHp = 20;
    return PlayerObject;
})(GO.GameObject);
exports.PlayerObject = PlayerObject;
//# sourceMappingURL=player.js.map