/// <reference path='../../typings/refs.d.ts' />
import _= require('lodash');
import GO = require('./gameObject');
import A = require('../core/arena');
import E = require('./enemy');
import P = require('./player');

export class Shot extends GO.GameObject {
    private static size = {width: 10, height: 10};
    private shotSpeed = 7;
    private maxDistance = 500;
    private damage = 1;

    constructor(
        arena: A.Arena,
        private startLocation:IPoint,
        private destination:IPoint,
        private owner: P.PlayerObject)
    {
        super(GameObjectType.Shot, Shot.size, arena, startLocation, 0, 0);
        this.setSpeed(startLocation, destination);
    }

    private setSpeed(startLocation:IPoint, destination:IPoint) {
        destination.x -= this.size.width / 2;
        destination.y -= this.size.height / 2;
        var direction = this.calculateDirection(startLocation, destination);
        this.changeSpeed(direction.x * this.shotSpeed, direction.y * this.shotSpeed);
    }

    proceed(timeSpan){
        if (!this.hitEnemy() && !this.wentMaxDistance() && !this.hitObstacle()) {
            super.proceed(timeSpan);
        }
    }

    changeLocationForCamera(xOffset, yOffset){
        this.startLocation.x += xOffset;
        this.startLocation.y += yOffset;
        super.changeLocationForCamera(xOffset, yOffset);
    }

    onRemove(){
        var nr = this.arena.shots.indexOf(this);
        this.arena.shots.splice(nr, 1);
    }

    private hitEnemy(): boolean {
        var enemies: Array<GO.GameObject> = this.arena.getEnemies();
        var players: Array<GO.GameObject> = _.filter(this.arena.players, p => p !== this.owner);
        var targets: Array<GO.GameObject> = enemies.concat(players);
        var shotLocation = this.getLocation();
        for (var i = 0; i < targets.length; i++) {
            var target: any = targets[i];
            if (this.isSameLocationAsTarget(shotLocation, target)) {
                target.receiveDamage(this.damage, this.owner);
                this.remove = true;
                return true;
            }
        }

        return false;
    }

    private isSameLocationAsTarget(shotLocation: IPoint, target: GO.GameObject) {
        var targetLocation = target.getLocation();
        return shotLocation.x > targetLocation.x && shotLocation.x < targetLocation.x + target.size.width
            && shotLocation.y > targetLocation.y && shotLocation.y < targetLocation.y + target.size.height;
    }

    private wentMaxDistance(): boolean{
        var distance = global.getDistanceBetween(this.getLocation(), this.startLocation);
        if (distance > this.maxDistance){
            this.remove = true;
            return true;
        }

        return false;
    }

    private hitObstacle(): boolean{
        var location = this.getLocation();
        var result = this.arena.isTouchingObstacle(location, location, this.size);
        if (result){
            this.remove = true;
        }

        return result;
    }
}