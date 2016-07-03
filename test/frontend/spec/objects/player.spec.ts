/// <reference path="../../typings/refs.d.ts" />
import MF = require('../helpers/mockFactory');
import P = require('../../../../frontend/js/app/objects/player');
import SH = require('../../../../frontend/js/app/objects/shot');

describe('Player', () => {
    it('should stay in place when no action is initiated', () => {
        var scene = MF.MockFactory.getScene();
        var player = scene.player;
        var initialPlayerLocation = player.getLocation();

        player.proceed(200);
        var playerLocation = player.getLocation();
        expect(playerLocation.x).toEqual(initialPlayerLocation.x);
        expect(playerLocation.y).toEqual(initialPlayerLocation.y);
    });

    it('should change location when changing speed from 0', () => {
        var scene = MF.MockFactory.getScene();
        var player = scene.player;
        var initialPlayerLocation = player.getLocation();

        player.changeSpeed(1, 1);
        player.proceed(200);
        var playerLocation = player.getLocation();
        expect(playerLocation.x).not.toEqual(initialPlayerLocation.x);
        expect(playerLocation.y).not.toEqual(initialPlayerLocation.y);
    });

    it('should animate on shooting', () => {
        var scene = MF.MockFactory.getScene();
        var player = scene.player;
        var frameBeforeShoot = player.currentFrame;

        player.shoot();
        var frameAfterShoot = player.currentFrame;

        expect(frameBeforeShoot).not.toEqual(frameAfterShoot);
    });

    it('should add shot object on shooting', () => {
        var scene = MF.MockFactory.getScene();
        var player = scene.player;
        var shotCountBeforeShoot = _.filter(scene.objects, x => x instanceof SH.Shot).length;

        player.shoot();
        var shotCountAfterShoot = _.filter(scene.objects, x => x instanceof SH.Shot).length;

        expect(shotCountAfterShoot).toEqual(shotCountBeforeShoot + 1);
    });

    it('should use normal animation when shoot animation expires', () => {
        var scene = MF.MockFactory.getScene();
        var player = scene.player;
        var mouseLocation = {x: 500, y: 500};
        player.update(mouseLocation);

        var currentTimeStamp = 5;
        window['now'] = () => { return currentTimeStamp; };
        player.shoot();
        var frameAfterShoot = player.currentFrame;

        currentTimeStamp = 10;
        player.update(mouseLocation);
        expect(player.currentFrame).toEqual(frameAfterShoot);

        currentTimeStamp = 1000;
        player.update(mouseLocation);
        expect(player.currentFrame).not.toEqual(frameAfterShoot);
    });
});