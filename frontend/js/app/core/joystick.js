define(["require", "exports"], function (require, exports) {
    var Joystick = (function () {
        function Joystick(userMove) {
            this.userMove = userMove;
            this.keyStatuses = {};
            this.fillKeyStatuses();
        }
        Joystick.prototype.fillKeyStatuses = function () {
            var keyCodes = KeyCodes;
            for (var code in keyCodes) {
                if (keyCodes.hasOwnProperty(code)) {
                    this.keyStatuses[code] = false;
                }
            }
        };
        Joystick.prototype.keyPressed = function (keyCode) {
            this.keyAction(keyCode, true);
        };
        Joystick.prototype.keyReleased = function (keyCode) {
            this.keyAction(keyCode, false);
        };
        Joystick.prototype.keyAction = function (keyCode, isActive) {
            if (KeyCodes[keyCode]) {
                this.keyStatuses[keyCode] = isActive;
                this.updateMovement();
                return true;
            }
            return false;
        };
        Joystick.prototype.updateMovement = function () {
            var x = 0;
            var y = 0;
            if (this.keyStatuses[39 /* Right */] || this.keyStatuses[68 /* D */]) {
                x++;
            }
            if (this.keyStatuses[37 /* Left */] || this.keyStatuses[65 /* A */]) {
                x--;
            }
            if (this.keyStatuses[38 /* Up */] || this.keyStatuses[87 /* W */]) {
                y--;
            }
            if (this.keyStatuses[40 /* Down */] || this.keyStatuses[83 /* S */]) {
                y++;
            }
            this.userMove(x, y);
        };
        return Joystick;
    })();
    exports.Joystick = Joystick;
    (function (KeyCodes) {
        KeyCodes[KeyCodes["Space"] = 32] = "Space";
        KeyCodes[KeyCodes["Left"] = 37] = "Left";
        KeyCodes[KeyCodes["Up"] = 38] = "Up";
        KeyCodes[KeyCodes["Right"] = 39] = "Right";
        KeyCodes[KeyCodes["Down"] = 40] = "Down";
        KeyCodes[KeyCodes["A"] = 65] = "A";
        KeyCodes[KeyCodes["D"] = 68] = "D";
        KeyCodes[KeyCodes["S"] = 83] = "S";
        KeyCodes[KeyCodes["W"] = 87] = "W";
    })(exports.KeyCodes || (exports.KeyCodes = {}));
    var KeyCodes = exports.KeyCodes;
});
//# sourceMappingURL=joystick.js.map