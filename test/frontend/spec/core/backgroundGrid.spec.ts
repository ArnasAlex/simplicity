/// <reference path="../../typings/refs.d.ts" />
import BG = require('../../../../frontend/js/app/core/backgroundGrid');
import MF = require('../helpers/mockFactory');

describe('Background Grid', () => {
    it('should calculate tile count horizontally', () => {
        var drawArea = MF.MockFactory.getDrawArea();
        var bg = new BG.BackgroundGrid(drawArea, () => {});
        var result = bg.getTileCountHorizontally();
        expect(result).toBe(13);
    });

    it('should calculate tile count vertically', () => {
        var drawArea = MF.MockFactory.getDrawArea();
        var bg = new BG.BackgroundGrid(drawArea, () => {});
        var result = bg.getTileCountVertically();
        expect(result).toBe(49);
    });

    it('should calculate correct tile coordinates', () => {
        var drawArea = MF.MockFactory.getDrawArea();
        var bg = new BG.BackgroundGrid(drawArea, () => {});
        var result = bg.getTileCoordinates(0, 0);
        expect(result).toEqual({x: 0, y: 0});
        result = bg.getTileCoordinates(1, 0);
        expect(result).toEqual({x: 100, y: 0});
        result = bg.getTileCoordinates(2, 0);
        expect(result).toEqual({x: 200, y: 0});
        result = bg.getTileCoordinates(0, 1);
        expect(result).toEqual({x: -50, y: 25});
        result = bg.getTileCoordinates(1, 1);
        expect(result).toEqual({x: 50, y: 25});
        result = bg.getTileCoordinates(0, 2);
        expect(result).toEqual({x: 0, y: 50});
    });
});