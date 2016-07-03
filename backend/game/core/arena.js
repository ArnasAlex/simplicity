var _ = require('lodash');
var EN = require('../objects/enemy');
var PL = require('../objects/player');
var Arena = (function () {
    function Arena() {
        this.enemies = [];
        this.shots = [];
        this.strokes = [];
        this.players = [];
        this.width = 3000;
        this.height = 3000;
        this.boundary = 400;
        this.objects = [];
        this.initPlayer();
    }
    Arena.prototype.initPlayer = function () {
    };
    Arena.prototype.addPlayer = function (id) {
        var player = this.getPlayer(id);
        if (!player) {
            var x = this.width / 2;
            var y = this.height / 2;
            var player = new PL.PlayerObject(id, this, { x: x, y: y });
            this.players.push(player);
            this.objects.push(player);
        }
        return player;
    };
    Arena.prototype.playerShoot = function (id, location) {
        var player = this.getPlayer(id);
        player.shoot(location);
    };
    Arena.prototype.playerUpdateMove = function (id, xAxis, yAxis) {
        var player = this.getPlayer(id);
        player.changeSpeed(xAxis, yAxis);
    };
    Arena.prototype.modifyDestinationForObstacles = function (location, destination, size) {
        var result = this.modifyDestinationForBoundary(destination, size);
        return result;
    };
    Arena.prototype.modifyDestinationForBoundary = function (destination, size) {
        var leftBoundary = this.leftBoundary();
        if (destination.x < leftBoundary) {
            destination.x = leftBoundary;
        }
        var rightBoundary = this.rightBoundary();
        if (destination.x + size.width > rightBoundary) {
            destination.x = rightBoundary - size.width;
        }
        var topBoundary = this.topBoundary();
        if (destination.y < topBoundary) {
            destination.y = topBoundary;
        }
        var bottomBoundary = this.bottomBoundary();
        if (destination.y + size.height > bottomBoundary) {
            destination.y = bottomBoundary - size.height;
        }
        return destination;
    };
    Arena.prototype.getEnemies = function (all) {
        if (all === void 0) { all = false; }
        return _.filter(this.enemies, function (obj) {
            return (all || !obj.remove);
        });
    };
    Arena.prototype.isTouchingObstacle = function (location, destination, size) {
        return this.isTouchingBoundary(destination, size);
    };
    Arena.prototype.isTouchingBoundary = function (destination, size) {
        return destination.x <= this.leftBoundary() || destination.x + size.width >= this.rightBoundary() || destination.y <= this.topBoundary() || destination.y + size.height >= this.bottomBoundary();
    };
    Arena.prototype.getPayload = function () {
        this.process();
        var payload = this.collectGameInfo();
        return payload;
    };
    Arena.prototype.addEnemy = function (location) {
        var enemy = new EN.Enemy(this, { x: location.x, y: location.y });
        this.objects.push(enemy);
        this.enemies.push(enemy);
    };
    Arena.prototype.addRandomEnemy = function () {
        if (this.getEnemies(true).length < 80) {
            var location = this.getRandomEnemyLocation();
            this.addEnemy(location);
        }
    };
    Arena.prototype.playerLeft = function (player) {
        var nr = this.players.indexOf(player);
        if (nr !== -1) {
            this.players.splice(nr, 1);
        }
        var nr = this.objects.indexOf(player);
        if (nr !== -1) {
            this.objects.splice(nr, 1);
        }
    };
    Arena.prototype.getNearestPlayer = function (location) {
        var nearestDistance;
        var nearestPlayer;
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            var distance = global.getDistanceBetween(location, player.getLocation());
            if (nearestDistance === undefined || nearestDistance > distance) {
                nearestDistance = distance;
                nearestPlayer = player;
            }
        }
        return nearestPlayer;
    };
    Arena.prototype.getPlayer = function (id) {
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (player.id === id) {
                return player;
            }
        }
    };
    Arena.prototype.getRandomEnemyLocation = function () {
        var areaOffset = 100;
        var x = global.random(this.leftBoundary() + areaOffset, this.rightBoundary() - EN.Enemy.size.width - areaOffset);
        var y = global.random(this.topBoundary() + areaOffset, this.bottomBoundary() - EN.Enemy.size.height - areaOffset);
        return { x: x, y: y };
    };
    Arena.prototype.process = function () {
        var timeSpanMs = this.getCycleTimeSpan();
        this.updateObjects(timeSpanMs);
        this.addEnemies();
    };
    Arena.prototype.addEnemies = function () {
        if (this.enemies.length < 50) {
            this.addRandomEnemy();
        }
    };
    Arena.prototype.updateObjects = function (timeSpanMs) {
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            obj.proceed(timeSpanMs);
        }
        this.clearRemovedObjects();
    };
    Arena.prototype.clearRemovedObjects = function () {
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            if (obj.remove) {
                obj.onRemove();
                this.objects.splice(i, 1);
                i--;
            }
        }
    };
    Arena.prototype.getCycleTimeSpan = function () {
        var now = global.now();
        if (this.lastCycleTimeStamp === undefined) {
            this.lastCycleTimeStamp = now;
        }
        var result = now - this.lastCycleTimeStamp;
        this.lastCycleTimeStamp = now;
        return result;
    };
    Arena.prototype.collectGameInfo = function () {
        var objects = this.collectObjectInfo();
        var payload = { o: objects, p: null };
        return payload;
    };
    Arena.prototype.collectObjectInfo = function () {
        var objects = [];
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            var payload = {
                t: obj.type,
                l: obj.getLocation()
            };
            if (obj.hasHp()) {
                payload.h = obj.getHp();
            }
            if (obj.rotation) {
                payload.r = obj.rotation;
            }
            if (obj.onTop) {
                payload.z = true;
            }
            objects.push(payload);
        }
        return objects;
    };
    Arena.prototype.leftBoundary = function () {
        return this.boundary;
    };
    Arena.prototype.rightBoundary = function () {
        return this.boundary + this.width;
    };
    Arena.prototype.topBoundary = function () {
        return this.boundary;
    };
    Arena.prototype.bottomBoundary = function () {
        return this.boundary + this.height;
    };
    return Arena;
})();
exports.Arena = Arena;
//# sourceMappingURL=arena.js.map