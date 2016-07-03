define(["require", "exports", '../../../../frontend/js/app/objects/objects', '../helpers/mockFactory'], function (require, exports, O, MF) {
    describe('Image Repository', function () {
        var repository;
        beforeEach(function () {
            repository = MF.MockFactory.getImageRepository();
        });
        it('should load images', function (done) {
            repository.loadImages(function () {
                expect(repository['loadedImagesCount']).toBe(O.Images.allObjects.length);
                done();
            });
        });
        it('should get image after loading', function (done) {
            repository.loadImages(function () {
                var img = repository.getImage(O.Images.player.name);
                expect(img.src).toContain(O.Images.player.name);
                done();
            });
        });
        it('should throw error when getting image before load', function () {
            var getImg = function () {
                repository.getImage('test');
            };
            expect(getImg).toThrowError();
        });
    });
});
//# sourceMappingURL=imageRepository.spec.js.map