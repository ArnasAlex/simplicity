/// <reference path="../../typings/refs.d.ts" />
import IR = require('../../../../frontend/js/app/core/imageRepository');
import O = require('../../../../frontend/js/app/objects/objects');
import MF = require('../helpers/mockFactory');

describe('Image Repository',() => {
    var repository: IR.ImageRepository;

    beforeEach(() => {
        repository = MF.MockFactory.getImageRepository();
    });

    it('should load images', (done) => {
        repository.loadImages(() => {
            expect(repository['loadedImagesCount']).toBe(O.Images.allObjects.length);
            done();
        });
    });

    it('should get image after loading', (done) => {
        repository.loadImages(() => {
            var img = repository.getImage(O.Images.player.name);
            expect(img.src).toContain(O.Images.player.name);
            done();
        });
    });

    it('should throw error when getting image before load', () => {
        var getImg = () => { repository.getImage('test') };
        expect(getImg).toThrowError();
    });
});