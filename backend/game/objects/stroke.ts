/// <reference path='../../typings/refs.d.ts' />
import GO = require('./gameObject');
import A = require('../core/arena');
import P = require('./player');

export class Stroke extends GO.GameObject {
    private static size = {width: 10, height: 25};
    private damage = 1;
    private range = 5;
    private speed = 2;
    private lifeSpan = 200;
    private executed = new Date().getTime();
    private hadHit = false;

    constructor(
        arena: A.Arena,
        private ownerLocation: IPoint,
        private ownerSize: ISize,
        private destination: IPoint,
        private target: P.PlayerObject)
    {
        super(GameObjectType.Stroke, Stroke.size, arena, ownerLocation, 0, 0);
        this.init(ownerLocation, ownerSize, destination);
        this.onTop = true;
    }

    private init(ownerLocation: IPoint, ownerSize: ISize, destination: IPoint) {
        var direction = this.calculateDirection(ownerLocation, destination);
        this.setLocation(ownerLocation, direction, ownerSize);
        this.setRotation(destination, ownerLocation);
        this.setSpeed(destination, direction);
    }

    private setSpeed(destination, direction){
        destination.x -= this.size.width / 2;
        destination.y -= this.size.height / 2;
        this.changeSpeed(direction.x * this.speed, direction.y * this.speed);
    }

    private setLocation(ownerLocation: IPoint, direction: IPoint, ownerSize: ISize){
        ownerLocation.x += direction.x * (ownerSize.width / 2 - this.range);
        ownerLocation.y += direction.y * (ownerSize.height / 2 - this.range);

        this.changeLocation(ownerLocation);
    }

    private setRotation(destination: IPoint, location: IPoint){
        var deltaY = location.y - destination.y;
        var deltaX = location.x - destination.x;
        this.rotation = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    }

    proceed(timeSpan){
        this.hitPlayer();
        if (!this.fadeOut()) {
            super.proceed(timeSpan);
        }
    }

    onRemove(){
        var nr = this.arena.strokes.indexOf(this);
        this.arena.strokes.splice(nr, 1);
    }

    private hitPlayer() {
        if (!this.hadHit) {
            var strokeLocation = this.getLocation();
            var player = this.target;
            if (this.isSameLocationAsPlayer(strokeLocation, player)) {
                player.receiveDamage(this.damage);
                this.hadHit = true;
            }
        }
    }

    private isSameLocationAsPlayer(strokeLocation: IPoint, player: P.PlayerObject) {
        var playerLocation = player.getLocation();
        return strokeLocation.x > playerLocation.x && strokeLocation.x < playerLocation.x + player.size.width
            && strokeLocation.y > playerLocation.y && strokeLocation.y < playerLocation.y + player.size.height;
    }

    private fadeOut(): boolean{
        var now = new Date().getTime();
        if (now > this.executed + this.lifeSpan){
            this.remove = true;
            return true;
        }

        return false;
    }
}