/// <reference path='../../typings/refs.d.ts' />
import A = require('../core/arena');
import ST = require('./stroke');
import GO = require('./gameObject')
import P = require('./player');

export class Enemy extends GO.GameObject{
    public static size = {width: 50, height: 50};
    private moveTimeSpan = 0;
    private speed = 1;
    private speedOnApproach = 1.5;
    private speedOnGoHome = 2;
    private pointToMove: IPoint;
    private movingAreaSize = 200;
    private stayStillPercent = 30;
    private distanceForApproaching = 300;
    private distanceToAbandonPlayer = 600;
    private state: EnemyState = EnemyState.Normal;
    private health: number;
    private totalHealth = 7;
    private lastStrikeTimeStamp: number;
    private attackSpeed = 2;
    private target: P.PlayerObject;

    constructor(
        arena: A.Arena,
        private startLocation: IPoint
    ){
        super(GameObjectType.Enemy, Enemy.size, arena, startLocation, 0, 0);
        this.health = this.totalHealth;
        this.pointToMove = startLocation;
    }

    proceed(timeSpan){
        this.update(timeSpan);
        super.proceed(timeSpan);
    }

    changeLocationForCamera(xOffset, yOffset){
        this.startLocation.x += xOffset;
        this.startLocation.y += yOffset;
        super.changeLocationForCamera(xOffset, yOffset);
    }

    receiveDamage(dmg: number, attacker: P.PlayerObject){
        this.health -= dmg;
        if (this.health <= 0){
            this.remove = true;
        }
        else if (this.state !== EnemyState.Chasing) {
            this.target = attacker;
            this.approachPlayer();
        }
    }

    hasHp(){
        return true;
    }

    getHp(){
        return Math.floor(this.health / this.totalHealth * 100);
    }

    onRemove(){
        var nr = this.arena.enemies.indexOf(this);
        this.arena.enemies.splice(nr, 1);
    }

    private update(timeSpan: number){
        if (this.state == EnemyState.Chasing){
            this.approachPlayer();
        }
        else if (this.state == EnemyState.Returning){
            this.checkReturnedHome();
        } else{
            this.normalState(timeSpan);
        }
    }

    private checkReturnedHome(){
        var enemyCoordinates = this.getLocation();
        var distance = global.getDistanceBetween(enemyCoordinates, this.startLocation);
        if (distance < this.movingAreaSize){
            this.state = EnemyState.Normal;
            this.changeSpeed(0, 0);
        }
    }

    private goHome(){
        this.state = EnemyState.Returning;
        var enemyCoordinates = this.getLocation();
        var direction = this.calculateDirection(enemyCoordinates, this.startLocation);
        this.changeSpeed(direction.x * this.speedOnGoHome, direction.y * this.speedOnGoHome);
        this.updateSight(this.startLocation);
    }

    private approachPlayer(){
        var playerCoordinates = this.target.getLocation();
        var enemyCoordinates = this.getLocation();
        var distanceToStartLocation = global.getDistanceBetween(enemyCoordinates, this.startLocation);
        if (distanceToStartLocation > this.distanceToAbandonPlayer){
            this.goHome();
        }
        else {
            if (!this.isTouchingPlayer(playerCoordinates, enemyCoordinates)) {
                this.moveCloserToPlayer(playerCoordinates, enemyCoordinates);
            }
            else{
                this.fight(this.target.getCenterLocation());
            }
            this.updateSight(this.target.getCenterLocation());
        }
    }

    private fight(playerCoordinates: IPoint){
        this.changeSpeed(0, 0);
        this.strike(playerCoordinates);
    }

    private strike(destination: IPoint) {
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
    }

    private moveCloserToPlayer(playerCoordinates: IPoint, enemyCoordinates: IPoint){
        var direction = this.calculateDirection(enemyCoordinates, playerCoordinates);
        this.changeSpeed(direction.x * this.speedOnApproach, direction.y * this.speedOnApproach);
    }

    private isTouchingPlayer(playerCoordinates: IPoint, enemyCoordinates: IPoint){
        var objectsWidth = (this.size.width + this.target.size.width) / 2;
        var distanceToPlayer = global.getDistanceBetween(playerCoordinates, enemyCoordinates);
        return distanceToPlayer < objectsWidth;
    }

    private normalState(timeSpan: number){
        if (this.moveTimeSpan <= 0){
            this.setMoveTimeSpan();
            this.updateMovement();
        }
        else{
            this.moveTimeSpan -= timeSpan;
        }
        this.checkForNearbyPlayer();
    }

    private checkForNearbyPlayer(){
        var location = this.getLocation();
        var nearestPlayer = this.arena.getNearestPlayer(location);
        if (nearestPlayer) {
            var distance = global.getDistanceBetween(location, nearestPlayer.getLocation());
            if (distance <= this.distanceForApproaching) {
                this.state = EnemyState.Chasing;
                this.target = nearestPlayer;
            }
        }
    }

    private updateMovement(){
        var stayStill = this.shouldStayStill();
        if (stayStill){
            this.changeSpeed(0, 0);
        }
        else{
            var destination = this.getRandomDestination();
            var direction = this.calculateDirection(this.getLocation(), destination);
            var xSpeed = Math.random() * this.speed;
            var ySpeed = Math.random() * this.speed;
            this.changeSpeed(direction.x * xSpeed, direction.y * ySpeed);
            this.updateSight(destination);
        }
    }

    private shouldStayStill(){
        return Math.ceil(Math.random() * 100) <= this.stayStillPercent;
    }

    private setMoveTimeSpan(){
        this.moveTimeSpan = Math.floor(Math.random() * 2000) + 500;
    }

    private getRandomDestination(){
        var range = this.movingAreaSize;
        var xRand = this.startLocation.x + Math.floor(Math.random() * range * 2 - range);
        var yRand = this.startLocation.y + Math.floor(Math.random() * range * 2 - range);
        return {x: xRand, y: yRand};
    }
}

export enum EnemyState {
    Normal = 1,
    Chasing = 2,
    Returning = 3
}