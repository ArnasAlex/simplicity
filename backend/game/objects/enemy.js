var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ST = require('./stroke');
var GO = require('./gameObject');
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(arena, startLocation) {
        _super.call(this, 1 /* Enemy */, Enemy.size, arena, startLocation, 0, 0);
        this.startLocation = startLocation;
        this.moveTimeSpan = 0;
        this.speed = 1;
        this.speedOnApproach = 1.5;
        this.speedOnGoHome = 2;
        this.movingAreaSize = 200;
        this.stayStillPercent = 30;
        this.distanceForApproaching = 300;
        this.distanceToAbandonPlayer = 600;
        this.state = 1 /* Normal */;
        this.totalHealth = 7;
        this.attackSpeed = 2;
        this.health = this.totalHealth;
        this.pointToMove = startLocation;
    }
    Enemy.prototype.proceed = function (timeSpan) {
        this.update(timeSpan);
        _super.prototype.proceed.call(this, timeSpan);
    };
    Enemy.prototype.changeLocationForCamera = function (xOffset, yOffset) {
        this.startLocation.x += xOffset;
        this.startLocation.y += yOffset;
        _super.prototype.changeLocationForCamera.call(this, xOffset, yOffset);
    };
    Enemy.prototype.receiveDamage = function (dmg, attacker) {
        this.health -= dmg;
        if (this.health <= 0) {
            this.remove = true;
        }
        else if (this.state !== 2 /* Chasing */) {
            this.target = attacker;
            this.approachPlayer();
        }
    };
    Enemy.prototype.hasHp = function () {
        return true;
    };
    Enemy.prototype.getHp = function () {
        return Math.floor(this.health / this.totalHealth * 100);
    };
    Enemy.prototype.onRemove = function () {
        var nr = this.arena.enemies.indexOf(this);
        this.arena.enemies.splice(nr, 1);
    };
    Enemy.prototype.update = function (timeSpan) {
        if (this.state == 2 /* Chasing */) {
            this.approachPlayer();
        }
        else if (this.state == 3 /* Returning */) {
            this.checkReturnedHome();
        }
        else {
            this.normalState(timeSpan);
        }
    };
    Enemy.prototype.checkReturnedHome = function () {
        var enemyCoordinates = this.getLocation();
        var distance = global.getDistanceBetween(enemyCoordinates, this.startLocation);
        if (distance < this.movingAreaSize) {
            this.state = 1 /* Normal */;
            this.changeSpeed(0, 0);
        }
    };
    Enemy.prototype.goHome = function () {
        this.state = 3 /* Returning */;
        var enemyCoordinates = this.getLocation();
        var direction = this.calculateDirection(enemyCoordinates, this.startLocation);
        this.changeSpeed(direction.x * this.speedOnGoHome, direction.y * this.speedOnGoHome);
        this.updateSight(this.startLocation);
    };
    Enemy.prototype.approachPlayer = function () {
        var playerCoordinates = this.target.getLocation();
        var enemyCoordinates = this.getLocation();
        var distanceToStartLocation = global.getDistanceBetween(enemyCoordinates, this.startLocation);
        if (distanceToStartLocation > this.distanceToAbandonPlayer) {
            this.goHome();
        }
        else {
            if (!this.isTouchingPlayer(playerCoordinates, enemyCoordinates)) {
                this.moveCloserToPlayer(playerCoordinates, enemyCoordinates);
            }
            else {
                this.fight(this.target.getCenterLocation());
            }
            this.updateSight(this.target.getCenterLocation());
        }
    };
    Enemy.prototype.fight = function (playerCoordinates) {
        this.changeSpeed(0, 0);
        this.strike(playerCoordinates);
    };
    Enemy.prototype.strike = function (destination) {
        var now = global.now();
        if (!this.lastStrikeTimeStamp || now > this.lastStrikeTimeStamp + 1000 / this.attackSpeed) {
            this.lastStrikeTimeStamp = now;
            var location = this.getCenterLocation();
            var size = this.size;
            var clonedLocation = global.clone(location);
            var stroke = new ST.Stroke(this.arena, clonedLocation, size, destination, this.target);
            this.arena.strokes.push(stroke);
            this.arena.objects.push(stroke);
        }
    };
    Enemy.prototype.moveCloserToPlayer = function (playerCoordinates, enemyCoordinates) {
        var direction = this.calculateDirection(enemyCoordinates, playerCoordinates);
        this.changeSpeed(direction.x * this.speedOnApproach, direction.y * this.speedOnApproach);
    };
    Enemy.prototype.isTouchingPlayer = function (playerCoordinates, enemyCoordinates) {
        var objectsWidth = (this.size.width + this.target.size.width) / 2;
        var distanceToPlayer = global.getDistanceBetween(playerCoordinates, enemyCoordinates);
        return distanceToPlayer < objectsWidth;
    };
    Enemy.prototype.normalState = function (timeSpan) {
        if (this.moveTimeSpan <= 0) {
            this.setMoveTimeSpan();
            this.updateMovement();
        }
        else {
            this.moveTimeSpan -= timeSpan;
        }
        this.checkForNearbyPlayer();
    };
    Enemy.prototype.checkForNearbyPlayer = function () {
        var location = this.getLocation();
        var nearestPlayer = this.arena.getNearestPlayer(location);
        if (nearestPlayer) {
            var distance = global.getDistanceBetween(location, nearestPlayer.getLocation());
            if (distance <= this.distanceForApproaching) {
                this.state = 2 /* Chasing */;
                this.target = nearestPlayer;
            }
        }
    };
    Enemy.prototype.updateMovement = function () {
        var stayStill = this.shouldStayStill();
        if (stayStill) {
            this.changeSpeed(0, 0);
        }
        else {
            var destination = this.getRandomDestination();
            var direction = this.calculateDirection(this.getLocation(), destination);
            var xSpeed = Math.random() * this.speed;
            var ySpeed = Math.random() * this.speed;
            this.changeSpeed(direction.x * xSpeed, direction.y * ySpeed);
            this.updateSight(destination);
        }
    };
    Enemy.prototype.shouldStayStill = function () {
        return Math.ceil(Math.random() * 100) <= this.stayStillPercent;
    };
    Enemy.prototype.setMoveTimeSpan = function () {
        this.moveTimeSpan = Math.floor(Math.random() * 2000) + 500;
    };
    Enemy.prototype.getRandomDestination = function () {
        var range = this.movingAreaSize;
        var xRand = this.startLocation.x + Math.floor(Math.random() * range * 2 - range);
        var yRand = this.startLocation.y + Math.floor(Math.random() * range * 2 - range);
        return { x: xRand, y: yRand };
    };
    Enemy.size = { width: 50, height: 50 };
    return Enemy;
})(GO.GameObject);
exports.Enemy = Enemy;
(function (EnemyState) {
    EnemyState[EnemyState["Normal"] = 1] = "Normal";
    EnemyState[EnemyState["Chasing"] = 2] = "Chasing";
    EnemyState[EnemyState["Returning"] = 3] = "Returning";
})(exports.EnemyState || (exports.EnemyState = {}));
var EnemyState = exports.EnemyState;
//# sourceMappingURL=enemy.js.map