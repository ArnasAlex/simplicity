define(["require", "exports"], function (require, exports) {
    var BackgroundGrid = (function () {
        function BackgroundGrid(drawArea, loadCallback) {
            this.drawArea = drawArea;
            this.loadCallback = loadCallback;
            this.tileSize = 50;
            this.xPerspective = 1;
            this.yPerspective = 0.5;
            this.tileColors = [];
            this.widthCacheCanvas = 0;
            this.heightCacheCanvas = 0;
            this.createCacheCanvas();
            this.fillTileColors();
            loadCallback();
        }
        BackgroundGrid.prototype.createCacheCanvas = function () {
            this.cacheCanvas = document.createElement('canvas');
            this.widthCacheCanvas = this.drawArea.sceneWidth + this.drawArea.sceneBoundary * 2;
            this.heightCacheCanvas = this.drawArea.sceneHeight + this.drawArea.sceneBoundary * 2;
        };
        BackgroundGrid.prototype.draw = function (redraw) {
            if (redraw) {
                this.drawGridToCache();
            }
            this.drawArea.backgroundContext.drawImage(this.cacheCanvas, -this.drawArea.xOffset, -this.drawArea.yOffset, this.drawArea.width, this.drawArea.height, 0, 0, this.drawArea.width, this.drawArea.height);
        };
        BackgroundGrid.prototype.getTileCountHorizontally = function () {
            return Math.ceil(this.widthCacheCanvas / (2 * this.tileSize * this.xPerspective)) + 1;
        };
        BackgroundGrid.prototype.getTileCountVertically = function () {
            return Math.ceil(this.heightCacheCanvas * 2 / (2 * this.tileSize * this.yPerspective)) + 1;
        };
        BackgroundGrid.prototype.getTileCoordinates = function (xNr, yNr) {
            var x = xNr * this.tileSize * (this.xPerspective * 2);
            if (yNr % 2 === 1) {
                x = x - this.tileSize;
            }
            var y = yNr * this.tileSize * (this.yPerspective * 2) / 2;
            var point = { x: x, y: y };
            return point;
        };
        BackgroundGrid.prototype.drawGridToCache = function () {
            this.widthCacheCanvas = this.drawArea.sceneWidth + this.drawArea.sceneBoundary * 2;
            this.heightCacheCanvas = this.drawArea.sceneHeight + this.drawArea.sceneBoundary * 2;
            this.cacheCanvas.width = this.widthCacheCanvas;
            this.cacheCanvas.height = this.heightCacheCanvas;
            var tileCountHorizontally = this.getTileCountHorizontally();
            var tileCountVertically = this.getTileCountVertically();
            for (var i = 0; i < tileCountHorizontally; i++) {
                for (var j = 0; j < tileCountVertically; j++) {
                    var point = this.getTileCoordinates(i, j);
                    var color = this.getTileColor(i, j);
                    this.drawTile(point, color);
                }
            }
            this.drawBoundary();
        };
        BackgroundGrid.prototype.drawBoundary = function () {
            this.drawBoundaryLine();
            this.drawBoundaryShade();
        };
        BackgroundGrid.prototype.drawBoundaryShade = function () {
            var ctx = this.cacheCanvas.getContext('2d');
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = 'black';
            var boundary = this.drawArea.sceneBoundary;
            ctx.fillRect(0, 0, this.widthCacheCanvas, boundary);
            ctx.fillRect(0, boundary, boundary, this.drawArea.sceneHeight);
            ctx.fillRect(boundary + this.drawArea.sceneWidth, boundary, boundary, this.drawArea.sceneHeight);
            ctx.fillRect(0, boundary + this.drawArea.sceneHeight, this.widthCacheCanvas, boundary);
            ctx.globalAlpha = 1;
        };
        BackgroundGrid.prototype.drawBoundaryLine = function () {
            var ctx = this.cacheCanvas.getContext('2d');
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'black';
            ctx.rect(this.drawArea.sceneBoundary, this.drawArea.sceneBoundary, this.drawArea.sceneWidth, this.drawArea.sceneHeight);
            ctx.stroke();
        };
        BackgroundGrid.prototype.drawTile = function (point, color) {
            var x = point.x;
            var y = point.y;
            var ctx = this.cacheCanvas.getContext('2d');
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.strokeStyle = 'white';
            ctx.moveTo(x, y);
            ctx.lineWidth = 1;
            ctx.lineTo(x + this.tileSize * this.xPerspective, y + this.tileSize * this.yPerspective);
            ctx.lineTo(x + this.tileSize * 2 * this.xPerspective, y);
            ctx.lineTo(x + this.tileSize * this.xPerspective, y - this.tileSize * this.yPerspective);
            ctx.lineTo(x, y);
            ctx.fill();
            ctx.stroke();
        };
        BackgroundGrid.prototype.getRandomColor = function () {
            var letters = '89ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 8)];
            }
            return color;
        };
        BackgroundGrid.prototype.getTileColor = function (xNr, yNr) {
            return this.tileColors[xNr][yNr];
        };
        BackgroundGrid.prototype.fillTileColors = function () {
            var fewColors = [];
            var colorCount = 3;
            for (var i = 0; i < colorCount; i++) {
                fewColors.push(this.getRandomColor());
            }
            var countHorizontally = this.getTileCountHorizontally();
            var countVertically = this.getTileCountVertically();
            for (var i = 0; i < countHorizontally; i++) {
                this.tileColors[i] = [];
                for (var j = 0; j < countVertically; j++) {
                    var color = fewColors[Math.floor(Math.random() * 5)];
                    this.tileColors[i][j] = color;
                }
            }
        };
        return BackgroundGrid;
    })();
    exports.BackgroundGrid = BackgroundGrid;
});
//# sourceMappingURL=backgroundGrid.js.map