define(["require", "exports", '../objects/objects'], function (require, exports, O) {
    var ImageRepository = (function () {
        function ImageRepository() {
            this.images = [];
            this.imagesByType = [];
            this.loadedImagesCount = 0;
            this.totalImageCount = O.Images.allObjects.length;
        }
        ImageRepository.prototype.loadImages = function (loadCompleteCb) {
            var _this = this;
            this.loadCompleteCb = loadCompleteCb;
            var imageNames = O.Images.allObjects;
            _.each(imageNames, function (img) {
                _this.loadImage(img.name, img.type);
            });
        };
        ImageRepository.prototype.getImage = function (name) {
            if (this.loadedImagesCount != this.totalImageCount) {
                throw Error('Images must be loaded before getting them.');
            }
            return this.images[name];
        };
        ImageRepository.prototype.getImageByType = function (type) {
            if (this.loadedImagesCount != this.totalImageCount) {
                throw Error('Images must be loaded before getting them.');
            }
            return this.imagesByType[type];
        };
        ImageRepository.prototype.loadImage = function (name, type) {
            var img = new Image();
            img.src = 'img/object/' + name + '.png';
            this.images[name] = img;
            this.imagesByType[type] = img;
            this.bindImageOnLoad(img);
        };
        ImageRepository.prototype.bindImageOnLoad = function (img) {
            var _this = this;
            img.onload = function () {
                _this.imageLoaded();
            };
        };
        ImageRepository.prototype.imageLoaded = function () {
            this.loadedImagesCount++;
            if (this.loadedImagesCount === O.Images.allObjects.length) {
                this.loadCompleteCb();
            }
        };
        return ImageRepository;
    })();
    exports.ImageRepository = ImageRepository;
});
//# sourceMappingURL=imageRepository.js.map