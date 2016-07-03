/// <reference path="../../typings/refs.d.ts" />
import S = require('../../../../frontend/js/app/core/scene');
import MF = require('../helpers/mockFactory');

describe('Scene', () => {
    it('should should add shot object when click received', () => {
        var drawArea = MF.MockFactory.getDrawArea();
        var imageRepository = MF.MockFactory.getImageRepository();
        var loader = MF.MockFactory.getLoader();
        var scene = new S.Scene(drawArea, loader, imageRepository);
        var objects = scene['objects'];
        var countBeforeClick = objects.length;
        scene.clickReceived();
        expect(objects.length).toBe(countBeforeClick + 1);
    });
});