define(["require", "exports"], function (require, exports) {
    var GameLoop = (function () {
        function GameLoop(doOneTick) {
            this.doOneTick = doOneTick;
            this.stop = false;
            this.fps = 0;
            this.lastCheckedTimeStamp = new Date().getTime();
            this.initAnimationFrame();
        }
        GameLoop.prototype.initAnimationFrame = function () {
            var win = window;
            win.requestAnimationFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame;
            if (!win.requestAnimationFrame) {
                win.requestAnimationFrame = function (callback) {
                    win.setTimeout(callback, 1000 / 60);
                };
            }
        };
        GameLoop.prototype.start = function () {
            this.loop();
        };
        GameLoop.prototype.loop = function () {
            var _this = this;
            if (!this.stop) {
                this.doOneTick();
                this.updateFps();
                window.requestAnimationFrame(function () {
                    _this.loop();
                });
            }
        };
        GameLoop.prototype.updateFps = function () {
            var now = this.getCurrentTimestamp();
            var delta = (now - this.lastCheckedTimeStamp) / 1000;
            this.lastCheckedTimeStamp = now;
            this.fps = Math.ceil(1 / delta);
        };
        GameLoop.prototype.getCurrentTimestamp = function () {
            return new Date().getTime();
        };
        return GameLoop;
    })();
    exports.GameLoop = GameLoop;
});
//# sourceMappingURL=gameLoop.js.map