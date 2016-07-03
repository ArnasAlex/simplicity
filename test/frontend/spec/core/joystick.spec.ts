/// <reference path="../../typings/refs.d.ts" />
import J = require('../../../../frontend/js/app/core/joystick');
import MF = require('../helpers/mockFactory');

describe('Joystick', () => {
    it('should change player movement according to keys pressed', () => {
        var game = MF.MockFactory.getGame();
        var userMoveSpy = spyOn(game, 'userMove');
        var joystick = new J.Joystick(game);
        joystick.keyPressed(J.KeyCodes.Up);
        expect(userMoveSpy.calls.count()).toBe(1);
        expect(userMoveSpy).toHaveBeenCalledWith(0, -1);

        joystick.keyReleased(J.KeyCodes.Up);
        expect(userMoveSpy.calls.count()).toBe(2);
        expect(userMoveSpy).toHaveBeenCalledWith(0, 0);

        joystick.keyPressed(J.KeyCodes.Right);
        expect(userMoveSpy.calls.count()).toBe(3);
        expect(userMoveSpy).toHaveBeenCalledWith(1, 0);
    });
});