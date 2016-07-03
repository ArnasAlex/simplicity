define(["require", "exports", '../../../../frontend/js/app/core/imageRepository', '../../../../frontend/js/app/core/canvas', '../../../../frontend/js/app/core/game', '../../../../frontend/js/app/core/loader', '../../../../frontend/js/app/core/scene'], function (require, exports, IR, C, G, L, S) {
    var MockFactory = (function () {
        function MockFactory() {
        }
        MockFactory.getImageRepository = function () {
            var repository = new IR.ImageRepository();
            repository['bindImageOnLoad'] = function () {
                repository['imageLoaded']();
            };
            return repository;
        };
        MockFactory.getCanvasContext = function () {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            return context;
        };
        MockFactory.getDrawArea = function () {
            var drawArea = new C.DrawArea();
            drawArea.height = 500;
            drawArea.width = 500;
            drawArea.context = MockFactory.getCanvasContext();
            drawArea.backgroundContext = MockFactory.getCanvasContext();
            drawArea.controlsContext = MockFactory.getCanvasContext();
            drawArea.mouseLocation = { x: 5, y: 5 };
            drawArea.xOffset = 0;
            drawArea.yOffset = 0;
            drawArea.sceneWidth = 1000;
            drawArea.sceneHeight = 1000;
            drawArea.sceneBoundary = 100;
            return drawArea;
        };
        MockFactory.getGame = function () {
            var drawArea = MockFactory.getDrawArea();
            var game = new G.Game(drawArea);
            return game;
        };
        MockFactory.getLoader = function () {
            return new L.Loader(function () {
            });
        };
        MockFactory.getScene = function () {
            return new S.Scene(MockFactory.getDrawArea(), MockFactory.getLoader(), MockFactory.getImageRepository());
        };
        return MockFactory;
    })();
    exports.MockFactory = MockFactory;
});
//# sourceMappingURL=mockFactory.js.map