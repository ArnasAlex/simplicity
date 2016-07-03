define(["require", "exports", './canvas', './game', './joystick'], function (require, exports, C, G, J) {
    var Main = (function () {
        function Main() {
            this.initCanvas();
            this.initGame();
            this.bindEvents();
            this.testWS();
        }
        Main.prototype.testWS = function () {
            var _this = this;
            $.get('/getws', function (data) {
                _this.socket = new WebSocket(data);
                _this.socket.onmessage = function (event) {
                    var result = (JSON.parse(event.data));
                    _this.game.update(result);
                };
            });
        };
        Main.prototype.initCanvas = function () {
            var _this = this;
            var canvasContainer = $('#game').parent();
            this.canvasManager = new C.Canvas(canvasContainer);
            this.canvasManager.resize(function () {
                _this.game.canvasReady();
            });
        };
        Main.prototype.initGame = function () {
            var _this = this;
            this.game = new G.Game(this.canvasManager.drawArea);
            this.joystick = new J.Joystick(function (x, y) {
                _this.updateMovement(x, y);
            });
        };
        Main.prototype.updateMovement = function (x, y) {
            var data = { t: 1 /* UserMove */, c: { x: x, y: y } };
            this.sendMessage(data);
        };
        Main.prototype.bindEvents = function () {
            this.bindResize();
            this.bindKeys();
            this.bindMouse();
        };
        Main.prototype.bindResize = function () {
            var _this = this;
            $(window).on('resize', function () {
                _this.canvasManager.resize(function () {
                    _this.game.layoutChanged();
                });
            });
        };
        Main.prototype.bindKeys = function () {
            var _this = this;
            $(window).on('keyup', function (evt) {
                var keyCode = _this.getKeyCodeFromEvt(evt);
                var suppress = _this.joystick.keyReleased(keyCode);
                if (suppress) {
                    evt.preventDefault();
                }
            });
            $(window).on('keydown', function (evt) {
                var keyCode = _this.getKeyCodeFromEvt(evt);
                var suppress = _this.joystick.keyPressed(keyCode);
                if (suppress) {
                    evt.preventDefault();
                }
            });
        };
        Main.prototype.getKeyCodeFromEvt = function (evt) {
            return (evt.keyCode) ? evt.keyCode : evt.charCode;
        };
        Main.prototype.bindMouse = function () {
            var _this = this;
            this.canvasManager.canvases.on('mousedown', function (evt) {
                var location = _this.canvasManager.drawArea.mouseLocation;
                var locationWithOffset = {
                    x: location.x - _this.canvasManager.drawArea.xOffset,
                    y: location.y - _this.canvasManager.drawArea.yOffset
                };
                var data = { t: 0 /* MouseClick */, c: locationWithOffset };
                _this.sendMessage(data);
                return false;
            });
            this.canvasManager.canvases.on('mouseup', function () {
                return false;
            });
            this.canvasManager.canvases.on('mousemove', function (evt) {
                var point = _this.getMouseCoordinates(evt);
                _this.canvasManager.drawArea.mouseLocation = point;
            });
        };
        Main.prototype.getMouseCoordinates = function (evt) {
            var x = evt.pageX;
            var y = evt.pageY;
            x -= this.canvasManager.canvases[0].offsetLeft;
            y -= this.canvasManager.canvases[0].offsetTop;
            return { x: x, y: y };
        };
        Main.prototype.sendMessage = function (data) {
            if (this.socket) {
                var str = JSON.stringify(data);
                this.socket.send(str);
            }
        };
        return Main;
    })();
    exports.Main = Main;
});
//# sourceMappingURL=main.js.map