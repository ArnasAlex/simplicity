/// <reference path='../../typings/refs.d.ts' />
define(["require", "exports"], function (require, exports) {
    var Canvas = (function () {
        function Canvas(canvasContainer) {
            this.initCanvas(canvasContainer);
            this.initDrawArea();
        }
        Canvas.prototype.initCanvas = function (canvasContainer) {
            this.canvasContainer = canvasContainer;
            this.canvases = this.canvasContainer.find('canvas');
            this.context = this.canvasContainer.find('#game')[0].getContext('2d');
            this.backgroundContext = this.canvasContainer.find('#background')[0].getContext('2d');
            this.controlsContext = this.canvasContainer.find('#controls')[0].getContext('2d');
        };
        Canvas.prototype.initDrawArea = function () {
            var area = new DrawArea();
            area.context = this.context;
            area.backgroundContext = this.backgroundContext;
            area.controlsContext = this.controlsContext;
            area.width = this.canvases.width();
            area.height = this.canvases.height();
            area.mouseLocation = { x: 0, y: 0 };
            area.xOffset = 0;
            area.yOffset = 0;
            this.drawArea = area;
        };
        Canvas.prototype.resize = function (cb) {
            var _this = this;
            this.resetCanvasSize();
            setTimeout(function () {
                _this.setCanvasSizeToParent();
                if (cb) {
                    cb();
                }
            });
        };
        Canvas.prototype.resetCanvasSize = function () {
            this.canvases.width(0);
            this.canvases.height(0);
        };
        Canvas.prototype.setCanvasSizeToParent = function () {
            var wdiff = this.canvases.outerWidth(true) - this.canvases.width();
            var hdiff = this.canvases.outerHeight(true) - this.canvases.height();
            var width = this.canvasContainer.innerWidth() - wdiff;
            var height = this.canvasContainer.innerHeight() - hdiff;
            for (var i = 0; i < this.canvases.length; i++) {
                var canvasEl = this.canvases[i];
                canvasEl.width = width;
                canvasEl.height = height;
            }
            this.canvases.width(width);
            this.canvases.height(height);
            this.drawArea.width = width;
            this.drawArea.height = height;
        };
        return Canvas;
    })();
    exports.Canvas = Canvas;
    var DrawArea = (function () {
        function DrawArea() {
        }
        return DrawArea;
    })();
    exports.DrawArea = DrawArea;
});
//# sourceMappingURL=canvas.js.map