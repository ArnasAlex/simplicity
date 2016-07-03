define(["require", "exports", './painter', './loader', './backgroundGrid', './controls'], function (require, exports, P, L, BG, CO) {
    var Scene = (function () {
        function Scene(drawArea, loader, imageRepository) {
            this.drawArea = drawArea;
            this.loader = loader;
            this.fps = 0;
            //public player: PL.PlayerObject;
            this.objects = [];
            this.cameraChanged = true;
            this.redrawBackground = true;
            this.cameraBoundary = 300;
            this.defaultCameraBoundary = 300;
            this.width = 3000;
            this.height = 3000;
            this.boundary = 400;
            this.updateDrawArea();
            this.initPainter(imageRepository);
            this.lastFpsUpdateTimestamp = this.getCurrentTimestamp();
            this.updateCameraBoundary();
        }
        Scene.prototype.updateDrawArea = function () {
            this.drawArea.sceneWidth = this.width;
            this.drawArea.sceneHeight = this.height;
            this.drawArea.sceneBoundary = this.boundary;
        };
        Scene.prototype.initPainter = function (imageRepository) {
            var _this = this;
            imageRepository.loadImages(function () {
                _this.loader.componentLoaded(1 /* images */);
            });
            var bgLoaded = function () {
                _this.loader.componentLoaded(3 /* background */);
            };
            var backgroundGrid = new BG.BackgroundGrid(this.drawArea, bgLoaded);
            this.painter = new P.Painter(imageRepository, this.drawArea, backgroundGrid);
            this.controls = new CO.Controls(imageRepository, this.drawArea);
        };
        Scene.prototype.process = function () {
            var timeSpanMs = this.getFrameTimeSpan();
            this.updateObjects(timeSpanMs);
            this.updateFps();
            this.updateCamera();
            if (this.redrawBackground || this.cameraChanged) {
                this.painter.drawBackground(this.redrawBackground);
                this.redrawBackground = false;
                this.cameraChanged = false;
            }
            var payload = this.payload;
            var uiObjects = this.objects;
            var objects;
            if (payload) {
                this.sortObjects(payload.o);
                objects = uiObjects.concat(payload.o);
            }
            else {
                objects = uiObjects;
            }
            this.painter.drawObjects(objects);
            this.updateControls();
        };
        Scene.prototype.layoutChanged = function () {
            this.redrawBackground = true;
            this.updateCameraBoundary();
        };
        Scene.prototype.isTouchingObstacle = function (location, destination, size) {
            return this.isTouchingBoundary(destination, size);
        };
        Scene.prototype.isTouchingBoundary = function (destination, size) {
            return destination.x <= this.leftBoundary() || destination.x + size.width >= this.rightBoundary() || destination.y <= this.topBoundary() || destination.y + size.height >= this.bottomBoundary();
        };
        Scene.prototype.modifyDestinationForObstacles = function (location, destination, size) {
            var result = this.modifyDestinationForBoundary(destination, size);
            return result;
        };
        Scene.prototype.modifyDestinationForBoundary = function (destination, size) {
            var leftBoundary = this.leftBoundary();
            if (destination.x < leftBoundary) {
                destination.x = leftBoundary;
            }
            var rightBoundary = this.rightBoundary();
            if (destination.x + size.width > rightBoundary) {
                destination.x = rightBoundary - size.width;
            }
            var topBoundary = this.topBoundary();
            if (destination.y < topBoundary) {
                destination.y = topBoundary;
            }
            var bottomBoundary = this.bottomBoundary();
            if (destination.y + size.height > bottomBoundary) {
                destination.y = bottomBoundary - size.height;
            }
            return destination;
        };
        Scene.prototype.updateCameraBoundary = function () {
            var val = this.drawArea.width / 2;
            if (this.drawArea.height / 2 < val) {
                val = this.drawArea.height / 2;
            }
            if (this.defaultCameraBoundary < val) {
                val = this.defaultCameraBoundary;
            }
            this.cameraBoundary = val;
        };
        Scene.prototype.leftBoundary = function () {
            return this.drawArea.sceneBoundary + this.drawArea.xOffset;
        };
        Scene.prototype.rightBoundary = function () {
            return this.drawArea.sceneBoundary + this.drawArea.sceneWidth + this.drawArea.xOffset;
        };
        Scene.prototype.topBoundary = function () {
            return this.drawArea.sceneBoundary + this.drawArea.yOffset;
        };
        Scene.prototype.bottomBoundary = function () {
            return this.drawArea.sceneBoundary + this.drawArea.sceneHeight + this.drawArea.yOffset;
        };
        Scene.prototype.sortObjects = function (objects) {
            objects.sort(function (obj1, obj2) {
                var a = obj1.l;
                var b = obj2.l;
                var result;
                if (obj1.z) {
                    result = 1;
                }
                else if (obj2.z) {
                    result = -1;
                }
                else {
                    result = a.y > b.y ? 1 : a.y < b.y ? -1 : a.x > b.x ? 1 : a.x < b.x ? -1 : 0;
                }
                return result;
            });
        };
        Scene.prototype.updateCamera = function () {
            var xOffset = 0;
            var playerLocation = {
                x: this.payload.p.l.x + this.drawArea.xOffset,
                y: this.payload.p.l.y + this.drawArea.yOffset
            };
            if (playerLocation.x < this.cameraBoundary) {
                xOffset = this.cameraBoundary - playerLocation.x;
            }
            else if (playerLocation.x > this.drawArea.width - this.cameraBoundary) {
                xOffset = this.drawArea.width - (playerLocation.x + this.cameraBoundary);
            }
            var yOffset = 0;
            if (playerLocation.y < this.cameraBoundary) {
                yOffset = this.cameraBoundary - playerLocation.y;
            }
            else if (playerLocation.y > this.drawArea.height - this.cameraBoundary) {
                yOffset = this.drawArea.height - (playerLocation.y + this.cameraBoundary);
            }
            if (xOffset !== 0 || yOffset !== 0) {
                this.cameraChanged = true;
                this.drawArea.xOffset += xOffset;
                this.drawArea.yOffset += yOffset;
            }
        };
        Scene.prototype.getFrameTimeSpan = function () {
            var now = new Date().getTime();
            if (this.lastFrameTimestamp === undefined) {
                this.lastFrameTimestamp = now;
            }
            var result = now - this.lastFrameTimestamp;
            this.lastFrameTimestamp = now;
            return result;
        };
        Scene.prototype.updateObjects = function (timeSpanMs) {
            for (var i = 0; i < this.objects.length; i++) {
                var obj = this.objects[i];
                obj.proceed(timeSpanMs);
            }
            this.clearRemovedObjects();
        };
        Scene.prototype.clearRemovedObjects = function () {
            for (var i = 0; i < this.objects.length; i++) {
                if (this.objects[i].remove) {
                    this.objects.splice(i, 1);
                    i--;
                }
            }
        };
        Scene.prototype.isObjectOutOfBounds = function (x, y, width, height) {
            return x + width < 0 || x > this.painter.drawArea.width || y + height < 0 || y > this.painter.drawArea.height;
        };
        Scene.prototype.updateFps = function () {
            var now = this.getCurrentTimestamp();
            if (now - this.lastFpsUpdateTimestamp > 1000) {
                this.lastFpsUpdateTimestamp = now;
                this.controls.drawFps(this.fps);
            }
        };
        Scene.prototype.getCurrentTimestamp = function () {
            return new Date().getTime();
        };
        Scene.prototype.updateControls = function () {
            this.controls.drawHp(this.payload.p.h);
        };
        return Scene;
    })();
    exports.Scene = Scene;
});
//# sourceMappingURL=scene.js.map