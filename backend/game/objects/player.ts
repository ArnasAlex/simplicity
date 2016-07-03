/// <reference path='../../typings/refs.d.ts' />
import GO = require('./gameObject');
import A = require('../core/arena');
import SH = require('./shot');

export class PlayerObject extends GO.GameObject {
    private static size = {width: 50, height: 50};
    speed = 2;
    hp: number;
    static totalHp = 20;
    isDead = false;
    isInvincible = false;

    private lastShotTimeStamp:number = null;

    constructor(
        public id: string,
        arena: A.Arena,
        location: IPoint
    ){
        super(GameObjectType.Player, PlayerObject.size, arena, location, 0, 0);
        this.hp = PlayerObject.totalHp;
    }

    update(mouseLocation: IPoint) {
        this.updateSight(mouseLocation);
        this.updateFrame();
    }

    shoot(targetLocation: IPoint) {
        this.createShot(targetLocation);

        this.lastShotTimeStamp = global.now();
        if (!this.isShotAnimation()){
            this.setShotAnimation();
        }
    }

    changeSpeed(xSpeed, ySpeed) {
        super.changeSpeed(xSpeed * this.speed, ySpeed * this.speed);
    }

    receiveDamage(dmg: number){
        if (!this.isInvincible) {
            this.hp -= dmg;
            if (this.hp <= 0) {
                //this.hp = 0;
                //this.isDead = true;
                this.hp = PlayerObject.totalHp;
            }
        }
    }

    hasHp(){
        return true;
    }

    getHp (){
        return Math.ceil((this.hp / PlayerObject.totalHp) * 100);
    }

    private createShot(destination: IPoint) {
        var playerLocation = this.getLocation();
        playerLocation.x += this.size.width / 2;
        playerLocation.y += this.size.height / 2;

        var shot = new SH.Shot(this.arena, playerLocation, destination, this);
        this.arena.shots.push(shot);
        this.arena.objects.push(shot);
    }

    private updateFrame(){
        if (this.lastShotTimeStamp){
            var now = global.now();
            if (this.isShotAnimation() && now - this.lastShotTimeStamp > 200){
                this.setNormalAnimation();
                this.lastShotTimeStamp = null;
            }
        }
    }

    private setShotAnimation(){
        if (this.currentFrame < 2) {
            this.currentFrame += 3;
        }
    }

    private setNormalAnimation(){
        this.currentFrame -= 3;
    }

    private isShotAnimation(){
        return this.currentFrame > 2;
    }
}