define(["require", "exports", '../objects/objects'], function (require, exports, O) {
    var Painter = (function () {
        function Painter(imageRepository, drawArea, backgroundGrid) {
            this.imageRepository = imageRepository;
            this.drawArea = drawArea;
            this.backgroundGrid = backgroundGrid;
            this.hpBarSize = { width: 50, height: 8 };
            this.context = drawArea.context;
        }
        Painter.prototype.drawBackground = function (redraw) {
            this.backgroundGrid.draw(redraw);
        };
        Painter.prototype.drawObjects = function (objects) {
            var _this = this;
            this.drawArea.context.clearRect(0, 0, this.drawArea.width, this.drawArea.height);
            _.each(objects, function (obj) {
                if (obj instanceof O.AnimatingObject) {
                    _this.drawAnimatingObject(obj);
                }
                else {
                    var payloadObj = obj;
                    var imgObj = O.Images.getImageByType(payloadObj.t);
                    _this.drawObject(payloadObj, imgObj.size);
                    if (payloadObj.h !== undefined) {
                        _this.drawHP(payloadObj, imgObj.size);
                    }
                }
            });
        };
        Painter.prototype.drawObject = function (obj, size) {
            var img = this.imageRepository.getImageByType(obj.t);
            var location = { x: obj.l.x + this.drawArea.xOffset, y: obj.l.y + this.drawArea.yOffset };
            if (obj.r !== undefined) {
                this.drawWithRotation(img, obj.r, size, location);
            }
            else {
                this.draw(img, size, location);
            }
        };
        Painter.prototype.drawHP = function (obj, imgSize) {
            var location = obj.l;
            var x = location.x + imgSize.width / 2 - this.hpBarSize.width / 2 + this.drawArea.xOffset;
            var y = location.y - 2 - this.hpBarSize.height + this.drawArea.yOffset;
            this.fillHPBar(x, y, obj.h);
            this.drawHPBar(x, y);
        };
        Painter.prototype.fillHPBar = function (x, y, hp) {
            this.context.fillStyle = '#2b2b2b';
            this.context.fillRect(x, y, this.hpBarSize.width, this.hpBarSize.height);
            var widthHp = Math.ceil(this.hpBarSize.width * hp / 100);
            this.context.fillStyle = '#F25F57';
            this.context.fillRect(x, y, widthHp, this.hpBarSize.height);
        };
        Painter.prototype.drawHPBar = function (x, y) {
            this.context.beginPath();
            this.context.strokeStyle = 'white';
            this.context.lineWidth = 1;
            this.context.rect(x, y, this.hpBarSize.width, this.hpBarSize.height);
            this.context.stroke();
        };
        Painter.prototype.drawMO = function (img, obj, location) {
            this.context.drawImage(img, 0, 0, obj.image.size.width, obj.image.size.height, location.x, location.y, obj.image.size.width, obj.image.size.height);
        };
        Painter.prototype.draw = function (img, size, location) {
            this.context.drawImage(img, 0, 0, size.width, size.height, location.x, location.y, size.width, size.height);
        };
        Painter.prototype.drawWithRotation = function (img, rotation, size, location) {
            this.context.save();
            this.context.translate(location.x, location.y);
            this.context.rotate(rotation * Math.PI / 180);
            this.draw(img, size, { x: -size.width / 2, y: -size.height / 2 });
            this.context.restore();
        };
        Painter.prototype.drawAnimatingObject = function (obj) {
            var img = this.imageRepository.getImage(obj.image.name);
            var location = obj.getLocation();
            this.context.globalAlpha = obj.alpha;
            this.context.drawImage(img, obj.image.size.width * obj.currentFrame, 0, obj.image.size.width, obj.image.size.height, location.x, location.y, obj.image.size.width, obj.image.size.height);
            this.context.globalAlpha = 1;
        };
        return Painter;
    })();
    exports.Painter = Painter;
});
//# sourceMappingURL=painter.js.map