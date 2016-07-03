/// <reference path="../../typings/refs.d.ts" />
import MF = require('../helpers/mockFactory');
import SH = require('../../../../frontend/js/app/objects/shot');
import E = require('../../../../frontend/js/app/objects/enemy');

describe('Shot', () => {
    it('should be created when player shoots', () => {
        var scene = MF.MockFactory.getScene();
        scene.drawArea.mouseLocation = {x: 5, y: 5};
        var shots = _.filter(scene.objects, x => x instanceof SH.Shot);
        expect(shots.length).toEqual(0);

        scene.player.shoot();
        shots = _.filter(scene.objects, x => x instanceof SH.Shot);
        expect(shots.length).toEqual(1);

        scene.player.shoot();
        shots = _.filter(scene.objects, x => x instanceof SH.Shot);
        expect(shots.length).toEqual(2);
    });

    it('should be removed when it hits enemy', () => {
        var scene = MF.MockFactory.getScene();
        scene.drawArea.mouseLocation = {x: 100, y: 100};
        var playerLocation = scene.player.getLocation();
        scene.addEnemy({x: playerLocation.x + 200, y: playerLocation.y + 200});

        var enemy = <E.Enemy>_.filter(scene.objects, x => x instanceof E.Enemy)[0];
        var enemyInitialHP = enemy.getHP();

        scene.player.shoot();
        var shot = <SH.Shot>_.filter(scene.objects, x => x instanceof SH.Shot)[0];
        shot.proceed(1);
        expect(enemy.getHP()).toEqual(enemyInitialHP);

        var enemyLocation = enemy.getLocation();
        shot.changeLocation({x: enemyLocation.x + enemy.image.size.width - 5, y: enemyLocation.y + enemy.image.size.height - 5});
        shot.proceed(1);
        expect(enemy.getHP()).toBeLessThan(enemyInitialHP);
    });

    it('should be removed when it reaches max distance', () => {
        var scene = MF.MockFactory.getScene();
        scene.drawArea.mouseLocation = {x: 100, y: 100};

        scene.player.shoot();
        var shot = <SH.Shot>_.filter(scene.objects, x => x instanceof SH.Shot)[0];
        shot.proceed(400);
        expect(shot.remove).toEqual(false);

        shot.proceed(900);
        expect(shot.remove).toEqual(false);

        shot.proceed(5);
        expect(shot.remove).toEqual(true);
    });
});