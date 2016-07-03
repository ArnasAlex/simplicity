define(["require", "exports", '../../../../frontend/js/app/core/painter', '../../../../frontend/js/app/core/backgroundGrid', '../../../../frontend/js/app/objects/objects', '../helpers/mockFactory'], function (require, exports, P, BG, O, MF) {
    describe('Painter', function () {
        it('should draw objects', function (done) {
            var repository = MF.MockFactory.getImageRepository();
            var drawArea = MF.MockFactory.getDrawArea();
            var scene = MF.MockFactory.getScene();
            var context = drawArea.context;
            repository.loadImages(function () {
                var painter = new P.Painter(repository, drawArea, new BG.BackgroundGrid(drawArea, function () {
                }));
                var obj = new O.MovingImgObject(scene, O.Images.enemy, { x: 1, y: 1 }, 0, 0);
                context.drawImage = function (img) {
                    expect(img.src).toContain(obj.image.name);
                    done();
                };
                painter.drawObjects([obj]);
            });
        });
    });
});
//# sourceMappingURL=painter.spec.js.map