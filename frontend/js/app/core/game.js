define(["require", "exports", './scene', './loader', './imageRepository', './gameLoop'], function (require, exports, S, L, IR, GL) {
    var Game = (function () {
        function Game(drawArea) {
            this.drawArea = drawArea;
            this.connectedToServer = false;
            this.initGameLoop();
            this.initLoader();
            this.initScene();
            this.lastEnemyCreationDate = this.getCurrentTimestamp();
        }
        Game.prototype.initGameLoop = function () {
            var _this = this;
            this.gameLoop = new GL.GameLoop(function () {
                _this.doOneTick();
            });
        };
        Game.prototype.initLoader = function () {
            var _this = this;
            this.loader = new L.Loader(function () {
                _this.startGame();
            });
        };
        Game.prototype.initScene = function () {
            var repository = new IR.ImageRepository();
            this.scene = new S.Scene(this.drawArea, this.loader, repository);
        };
        Game.prototype.startGame = function () {
            this.layoutChanged();
            this.gameLoop.start();
        };
        Game.prototype.canvasReady = function () {
            this.loader.componentLoaded(2 /* canvas */);
        };
        Game.prototype.layoutChanged = function () {
            this.scene.layoutChanged();
        };
        Game.prototype.update = function (payload) {
            this.scene.payload = payload;
            if (!this.connectedToServer) {
                this.connectedToServer = true;
                this.loader.componentLoaded(4 /* connected */);
            }
        };
        Game.prototype.doOneTick = function () {
            this.updateFps();
            this.scene.process();
            if (this.scene.payload.p.h == 0) {
                this.gameLoop.stop = true;
            }
        };
        Game.prototype.updateFps = function () {
            this.scene.fps = this.gameLoop.fps;
        };
        Game.prototype.getCurrentTimestamp = function () {
            return new Date().getTime();
        };
        return Game;
    })();
    exports.Game = Game;
});
//# sourceMappingURL=game.js.map