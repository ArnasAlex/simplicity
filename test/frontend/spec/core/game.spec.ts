/// <reference path="../../typings/refs.d.ts" />
import G = require('../../../../frontend/js/app/core/game');
import MF = require('../helpers/mockFactory');
import S = require('../../../../frontend/js/app/core/scene');

describe('Game', () => {
    it('should place player when canvas ready', () => {
        var game = MF.MockFactory.getGame();
        game.canvasReady();
        var scene: S.Scene = game['scene'];
        var playerLocation = scene.player.getLocation();
        expect(playerLocation.x).toBeGreaterThan(0);
        expect(playerLocation.y).toBeGreaterThan(0);
    });
});