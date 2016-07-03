import _ = require('lodash');
import EN = require('../objects/enemy');
import PL = require('../objects/player');
import SH = require('../objects/shot');
import ST = require('../objects/stroke');
import GO = require('../objects/gameObject');

export class Arena {
    public enemies: Array<EN.Enemy> = [];
    public shots: Array<SH.Shot> = [];
    public strokes: Array<ST.Stroke> = [];
    public players: Array<PL.PlayerObject> = [];
    private width = 3000;
    private height = 3000;
    private boundary = 400;
    private lastCycleTimeStamp: number;
    public objects: Array<GO.GameObject> = [];

    constructor(){
        this.initPlayer();
    }

    private initPlayer() {
    }

    addPlayer(id: string){
        var player = this.getPlayer(id);
        if (!player) {
            var x = this.width / 2;
            var y = this.height / 2;
            var player = new PL.PlayerObject(id, this, {x: x, y: y});
            this.players.push(player);
            this.objects.push(player);
        }

        return player;
    }

    playerShoot(id: string, location: IPoint){
        var player = this.getPlayer(id);
        player.shoot(location);
    }

    playerUpdateMove(id: string, xAxis: number, yAxis: number){
        var player = this.getPlayer(id);
        player.changeSpeed(xAxis, yAxis);
    }

    modifyDestinationForObstacles(location: IPoint, destination: IPoint, size: ISize): IPoint{
        var result = this.modifyDestinationForBoundary(destination, size);
        return result;
    }

    modifyDestinationForBoundary(destination: IPoint, size: ISize): IPoint{
        var leftBoundary = this.leftBoundary();
        if (destination.x < leftBoundary){
            destination.x = leftBoundary;
        }

        var rightBoundary = this.rightBoundary();
        if (destination.x + size.width > rightBoundary){
            destination.x = rightBoundary - size.width;
        }

        var topBoundary = this.topBoundary();
        if (destination.y < topBoundary){
            destination.y = topBoundary;
        }

        var bottomBoundary = this.bottomBoundary();
        if (destination.y + size.height > bottomBoundary){
            destination.y = bottomBoundary - size.height;
        }

        return destination;
    }

    getEnemies(all = false): EN.Enemy[] {
        return _.filter(this.enemies, (obj) => {
            return (all || !obj.remove);
        });
    }

    isTouchingObstacle(location: IPoint, destination: IPoint, size: ISize): boolean{
        return this.isTouchingBoundary(destination, size);
    }

    isTouchingBoundary(destination: IPoint, size: ISize): boolean{
        return destination.x <= this.leftBoundary() ||
            destination.x + size.width >= this.rightBoundary() ||
            destination.y <= this.topBoundary() ||
            destination.y + size.height >= this.bottomBoundary();
    }

    getPayload(){
        this.process();
        var payload = this.collectGameInfo();
        return payload;
    }

    addEnemy(location: IPoint) {
        var enemy = new EN.Enemy(this, {x: location.x, y: location.y});
        this.objects.push(enemy);
        this.enemies.push(enemy);
    }

    addRandomEnemy(){
        if (this.getEnemies(true).length < 80) {
            var location = this.getRandomEnemyLocation();
            this.addEnemy(location);
        }
    }

    playerLeft(player: PL.PlayerObject){
        var nr = this.players.indexOf(player);
        if (nr !== -1){
            this.players.splice(nr, 1);
        }

        var nr = this.objects.indexOf(player);
        if (nr !== -1){
            this.objects.splice(nr, 1);
        }
    }

    getNearestPlayer(location: IPoint){
        var nearestDistance;
        var nearestPlayer;
        for (var i = 0; i < this.players.length; i++){
            var player = this.players[i];
            var distance = global.getDistanceBetween(location, player.getLocation());
            if (nearestDistance === undefined || nearestDistance > distance){
                nearestDistance = distance;
                nearestPlayer = player;
            }
        }

        return nearestPlayer;
    }

    private getPlayer(id: string): PL.PlayerObject{
        for (var i = 0; i < this.players.length; i++){
            var player = this.players[i];
            if (player.id === id){
                return player;
            }
        }
    }

    private getRandomEnemyLocation(): IPoint {
        var areaOffset = 100;
        var x = global.random(this.leftBoundary() + areaOffset, this.rightBoundary() - EN.Enemy.size.width - areaOffset);
        var y = global.random(this.topBoundary() + areaOffset, this.bottomBoundary() - EN.Enemy.size.height - areaOffset);
        return {x: x, y: y};
    }

    private process() {
        var timeSpanMs = this.getCycleTimeSpan();
        this.updateObjects(timeSpanMs);
        this.addEnemies();
    }

    private addEnemies(){
        if (this.enemies.length < 50){
            this.addRandomEnemy();
        }
    }

    private updateObjects(timeSpanMs){
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            obj.proceed(timeSpanMs);
        }

        this.clearRemovedObjects();
    }

    private clearRemovedObjects() {
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            if (obj.remove) {
                obj.onRemove();
                this.objects.splice(i, 1);
                i--;
            }
        }
    }

    private getCycleTimeSpan(){
        var now = global.now();
        if (this.lastCycleTimeStamp === undefined){
            this.lastCycleTimeStamp = now;
        }

        var result = now - this.lastCycleTimeStamp;
        this.lastCycleTimeStamp = now;

        return result;
    }

    private collectGameInfo(): IPayload{
        var objects = this.collectObjectInfo();
        var payload = {o: objects, p: null};
        return payload;
    }

    private collectObjectInfo(){
        var objects = [];
        for (var i = 0; i < this.objects.length; i++){
            var obj = this.objects[i];
            var payload: IObjectPayload = {
                t: obj.type,
                l: obj.getLocation()
            };

            if (obj.hasHp()){
                payload.h = obj.getHp();
            }

            if (obj.rotation){
                payload.r = obj.rotation;
            }

            if (obj.onTop){
                payload.z = true;
            }

            objects.push(payload);
        }

        return objects;
    }

    private leftBoundary(): number{
        return this.boundary;
    }

    private rightBoundary(): number{
        return this.boundary + this.width;
    }

    private topBoundary(): number{
        return this.boundary;
    }

    private bottomBoundary(): number{
        return this.boundary + this.height;
    }
}