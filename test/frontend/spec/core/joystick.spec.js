define(["require", "exports", '../../../../frontend/js/app/core/joystick', '../helpers/mockFactory'], function (require, exports, J, MF) {
    describe('Joystick', function () {
        it('should change player movement according to keys pressed', function () {
            var game = MF.MockFactory.getGame();
            var userMoveSpy = spyOn(game, 'userMove');
            var joystick = new J.Joystick(game);
            joystick.keyPressed(38 /* Up */);
            expect(userMoveSpy.calls.count()).toBe(1);
            expect(userMoveSpy).toHaveBeenCalledWith(0, -1);
            joystick.keyReleased(38 /* Up */);
            expect(userMoveSpy.calls.count()).toBe(2);
            expect(userMoveSpy).toHaveBeenCalledWith(0, 0);
            joystick.keyPressed(39 /* Right */);
            expect(userMoveSpy.calls.count()).toBe(3);
            expect(userMoveSpy).toHaveBeenCalledWith(1, 0);
        });
    });
});
//# sourceMappingURL=joystick.spec.js.map