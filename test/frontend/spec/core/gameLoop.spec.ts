/// <reference path="../../typings/refs.d.ts" />
import GL = require('../../../../frontend/js/app/core/gameLoop');

describe('Game Loop', () => {
    it('should set animation frame function', (done) => {
        if (window.requestAnimationFrame){
            expect(window.requestAnimationFrame).not.toBeUndefined();
            done();
        }
        else {
            expect(window.requestAnimationFrame).toBeUndefined();
            var gameLoop = new GL.GameLoop(null);
            expect(window.requestAnimationFrame).not.toBeUndefined();
            window.requestAnimationFrame(() => {
                done();
            });
        }
    });

    it('should execute function each loop cycle', (done) => {
        var counter = 0;
        var doOneTickSpy = jasmine.createSpy('doOneTick', () => {
            counter++;
            if (counter === 5){
                expect(doOneTickSpy.calls.count()).toBe(5);
                done();
            }
        });
        doOneTickSpy.and.callThrough();

        var gameLoop = new GL.GameLoop(doOneTickSpy);
        gameLoop.start();
    });

    it('should update fps', () => {
        var gameLoop = new GL.GameLoop(null);
        var x = 0;
        spyOn(gameLoop, 'getCurrentTimestamp').and.callFake(() => {
            return x;
        });

        gameLoop['updateFps']();

        x = 1000;
        gameLoop['updateFps']();
        expect(gameLoop.fps).toEqual(1);

        x = 1034;
        gameLoop['updateFps']();
        expect(gameLoop.fps).toEqual(30);
    })
});