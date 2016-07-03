import G = require('./game');

export class Joystick {
    private keyStatuses = {};

    constructor(private userMove: (x: number, y: number) => void) {
        this.fillKeyStatuses();
    }

    private fillKeyStatuses() {
        var keyCodes = KeyCodes;
        for (var code in keyCodes) {
            if (keyCodes.hasOwnProperty(code)) {
                this.keyStatuses[code] = false;
            }
        }
    }

    keyPressed(keyCode: number) {
        this.keyAction(keyCode, true);
    }

    keyReleased(keyCode: number) {
        this.keyAction(keyCode, false);
    }

    private keyAction(keyCode: number, isActive: boolean) {
        if (KeyCodes[keyCode]) {
            this.keyStatuses[keyCode] = isActive;
            this.updateMovement();
            return true;
        }
        return false;
    }

    private updateMovement() {
        var x = 0;
        var y = 0;

        if (this.keyStatuses[KeyCodes.Right] || this.keyStatuses[KeyCodes.D]) { x++; }
        if (this.keyStatuses[KeyCodes.Left] || this.keyStatuses[KeyCodes.A]) { x--; }
        if (this.keyStatuses[KeyCodes.Up] || this.keyStatuses[KeyCodes.W]) { y--; }
        if (this.keyStatuses[KeyCodes.Down] || this.keyStatuses[KeyCodes.S]) { y++; }

        this.userMove(x, y);
    }
}

export enum KeyCodes {
    Space = 32,
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
    A = 65,
    D = 68,
    S = 83,
    W = 87
}
