import C = require('./canvas');
import G = require('./game');
import J = require('./joystick');

export class Main {
    private game: G.Game;
    private joystick: J.Joystick;
    private canvasManager: C.Canvas;
    private socket: WebSocket;

    constructor() {
        this.initCanvas();
        this.initGame();
        this.bindEvents();
        this.testWS();
    }

    private testWS(){
        $.get('/getws', (data) => {
            this.socket = new WebSocket(data);
            this.socket.onmessage = (event) => {
                var result = (JSON.parse(event.data));
                this.game.update(result);
            };
        });
    }

    private initCanvas() {
        var canvasContainer = $('#game').parent();
        this.canvasManager = new C.Canvas(canvasContainer);
        this.canvasManager.resize(() => {
            this.game.canvasReady();
        });
    }

    private initGame() {
        this.game = new G.Game(this.canvasManager.drawArea);
        this.joystick = new J.Joystick((x, y) => {this.updateMovement(x, y); });
    }

    private updateMovement(x: number, y: number){
        var data = {t: ClientMessageType.UserMove, c: {x: x, y: y}};
        this.sendMessage(data);
    }

    private bindEvents() {
        this.bindResize();
        this.bindKeys();
        this.bindMouse();
    }

    private bindResize() {
        $(window).on('resize',() => {
            this.canvasManager.resize(() => {this.game.layoutChanged(); });
        });
    }

    private bindKeys() {
        $(window).on('keyup', (evt) => {
            var keyCode = this.getKeyCodeFromEvt(evt);
            var suppress = this.joystick.keyReleased(keyCode);
            if (suppress) {
                evt.preventDefault();
            }
        });

        $(window).on('keydown', (evt) => {
            var keyCode = this.getKeyCodeFromEvt(evt);
            var suppress = this.joystick.keyPressed(keyCode);
            if (suppress) {
                evt.preventDefault();
            }
        });
    }

    private getKeyCodeFromEvt(evt) {
        return (evt.keyCode) ? evt.keyCode : evt.charCode;
    }

    private bindMouse() {
        this.canvasManager.canvases.on('mousedown', (evt) => {
            var location = this.canvasManager.drawArea.mouseLocation;
            var locationWithOffset = {
                x: location.x - this.canvasManager.drawArea.xOffset,
                y: location.y - this.canvasManager.drawArea.yOffset
            };

            var data = {t: ClientMessageType.MouseClick, c: locationWithOffset};
            this.sendMessage(data);

            return false;
        });

        this.canvasManager.canvases.on('mouseup', () => {
            return false;
        });

        this.canvasManager.canvases.on('mousemove', (evt) => {
            var point = this.getMouseCoordinates(evt);
            this.canvasManager.drawArea.mouseLocation = point;
        });
    }

    private getMouseCoordinates(evt): IPoint{
        var x = evt.pageX;
        var y = evt.pageY;

        x -= this.canvasManager.canvases[0].offsetLeft;
        y -= this.canvasManager.canvases[0].offsetTop;
        return {x: x, y: y};
    }

    private sendMessage(data: IClientMessage){
        if (this.socket){
            var str = JSON.stringify(data)
            this.socket.send(str);
        }
    }
}