/// <reference path="../../typings/refs.d.ts" />
import P = require('../../../../frontend/js/app/core/painter');
import IR = require('../../../../frontend/js/app/core/imageRepository');
import BG = require('../../../../frontend/js/app/core/backgroundGrid');
import O = require('../../../../frontend/js/app/objects/objects');
import MF = require('../helpers/mockFactory');

describe('Painter',() => {
    it('should draw objects', (done) => {
        var repository = MF.MockFactory.getImageRepository();
        var drawArea = MF.MockFactory.getDrawArea();
        var scene = MF.MockFactory.getScene();
        var context = drawArea.context;

        repository.loadImages(()=>{
            var painter = new P.Painter(repository, drawArea, new BG.BackgroundGrid(drawArea, () => {}));
            var obj = new O.MovingImgObject(scene, O.Images.enemy, {x: 1, y: 1}, 0, 0);
            context.drawImage = (img: HTMLImageElement) => {
                expect(img.src).toContain(obj.image.name);
                done();
            };

            painter.drawObjects([obj]);
        });
    });
});