define(["require", "exports", '../../../../frontend/js/app/core/canvas'], function (require, exports, C) {
    describe('Canvas', function () {
        it('should update draw area width and height on resize', function (done) {
            var div = $('<div></div>', { style: 'width: 100px; height: 100px;' });
            var gameCanvas = $('<canvas id="game" />', { style: 'width: 50px, height: 50px;' });
            div.append(gameCanvas);
            var bgCanvas = $('<canvas id="background" />', { style: 'width: 50px, height: 50px;' });
            div.append(bgCanvas);
            var controlsCanvas = $('<canvas id="controls" />', { style: 'width: 50px, height: 50px;' });
            div.append(controlsCanvas);
            var canvas = new C.Canvas(div);
            expect(canvas.drawArea.height).toBe(0);
            expect(canvas.drawArea.width).toBe(0);
            canvas.resize(function () {
                expect(canvas.drawArea.height).toBe(100);
                expect(canvas.drawArea.width).toBe(100);
                done();
            });
        });
    });
});
//# sourceMappingURL=canvas.spec.js.map