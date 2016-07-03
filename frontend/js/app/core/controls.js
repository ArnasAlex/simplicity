define(["require", "exports"], function (require, exports) {
    var Controls = (function () {
        function Controls(imageRepository, drawArea) {
            this.imageRepository = imageRepository;
            this.drawArea = drawArea;
            this.hpBarSize = { width: 400, height: 20 };
            this.context = drawArea.controlsContext;
        }
        Controls.prototype.drawFps = function (fps) {
            var x = this.drawArea.width - 100;
            var y = 50;
            this.context.clearRect(x, y / 2, 105, 30);
            this.context.fillStyle = 'gray';
            this.context.font = "bold 30px Antic";
            this.context.fillText("FPS:" + fps, x, y);
        };
        Controls.prototype.drawHp = function (hp) {
            var x = this.drawArea.width / 2 - this.hpBarSize.width / 2;
            var y = this.drawArea.height - this.hpBarSize.height - 30;
            this.clearHPBar(x, y);
            this.fillHPBar(x, y, hp);
            this.drawHPBar(x, y);
        };
        Controls.prototype.clearHPBar = function (x, y) {
            this.context.clearRect(x, y, this.hpBarSize.width, this.hpBarSize.height);
        };
        Controls.prototype.fillHPBar = function (x, y, hp) {
            this.context.fillStyle = '#2b2b2b';
            this.context.fillRect(x, y, this.hpBarSize.width, this.hpBarSize.height);
            var widthHp = Math.ceil(this.hpBarSize.width * hp / 100);
            this.context.fillStyle = '#28c938';
            this.context.fillRect(x, y, widthHp, this.hpBarSize.height);
        };
        Controls.prototype.drawHPBar = function (x, y) {
            this.context.beginPath();
            this.context.strokeStyle = 'white';
            this.context.lineWidth = 1;
            this.context.rect(x, y, this.hpBarSize.width, this.hpBarSize.height);
            this.context.stroke();
        };
        return Controls;
    })();
    exports.Controls = Controls;
});
//# sourceMappingURL=controls.js.map