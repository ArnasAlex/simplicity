define(["require", "exports", '../../../../frontend/js/app/core/scene', '../helpers/mockFactory'], function (require, exports, S, MF) {
    describe('Scene', function () {
        it('should should add shot object when click received', function () {
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
});
//# sourceMappingURL=scene.spec.js.map