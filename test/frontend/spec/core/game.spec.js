define(["require", "exports", '../helpers/mockFactory'], function (require, exports, MF) {
    describe('Game', function () {
        it('should place player when canvas ready', function () {
            var game = MF.MockFactory.getGame();
            game.canvasReady();
            var scene = game['scene'];
            var playerLocation = scene.player.getLocation();
            expect(playerLocation.x).toBeGreaterThan(0);
            expect(playerLocation.y).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=game.spec.js.map