/// <reference path="../../typings/refs.d.ts" />
import MF = require('../helpers/mockFactory');
import E = require('../../../../frontend/js/app/objects/enemy');

describe('Enemy', () => {
    var scene = MF.MockFactory.getScene();
    beforeEach(() => {
        scene = MF.MockFactory.getScene();
    });

    it('should update start location on changing camera', () => {
        var enemyInitialLocation = {x: 200, y: 200};
        scene.addEnemy(enemyInitialLocation);
        var enemy = scene.getEnemies()[0];
        expect(enemy['startLocation'].x).toEqual(enemyInitialLocation.x);
        expect(enemy['startLocation'].y).toEqual(enemyInitialLocation.y);

        enemy.proceed(200);
        expect(enemy['startLocation'].x).toEqual(enemyInitialLocation.x);
        expect(enemy['startLocation'].y).toEqual(enemyInitialLocation.y);

        enemy.changeLocationForCamera(5, 10);
        expect(enemy['startLocation'].x).toEqual(enemyInitialLocation.x + 5);
        expect(enemy['startLocation'].y).toEqual(enemyInitialLocation.y + 10);
    });

    it('should update start location on changing camera', () => {
        var enemyInitialLocation = {x: 200, y: 200};
        scene.addEnemy(enemyInitialLocation);
        var enemy = scene.getEnemies()[0];
        expect(enemy['startLocation'].x).toEqual(enemyInitialLocation.x);
        expect(enemy['startLocation'].y).toEqual(enemyInitialLocation.y);

        enemy.proceed(200);
        expect(enemy['startLocation'].x).toEqual(enemyInitialLocation.x);
        expect(enemy['startLocation'].y).toEqual(enemyInitialLocation.y);

        enemy.changeLocationForCamera(5, 10);
        expect(enemy['startLocation'].x).toEqual(enemyInitialLocation.x + 5);
        expect(enemy['startLocation'].y).toEqual(enemyInitialLocation.y + 10);
    });

    it('should move randomly', () => {
        var enemyInitialLocation = {x: 1000, y: 1000};
        scene.addEnemy(enemyInitialLocation);
        var enemy = scene.getEnemies()[0];
        enemy['shouldStayStill'] = () => {return false;};
        enemy['getRandomDestination'] = () => { return {x: enemyInitialLocation.x + 200, y: enemyInitialLocation.y + 200}};

        var location = enemy.getLocation();
        expect(location.x).toEqual(enemyInitialLocation.x);
        expect(location.y).toEqual(enemyInitialLocation.y);

        enemy.proceed(200);
        enemy.proceed(200);
        enemy.proceed(200);
        location = enemy.getLocation();
        expect(location.x).not.toEqual(enemyInitialLocation.x);
        expect(location.y).not.toEqual(enemyInitialLocation.y);
    });

    it('should stay still randomly', () => {
        var enemyInitialLocation = {x: 1000, y: 1000};
        scene.addEnemy(enemyInitialLocation);
        var enemy = scene.getEnemies()[0];
        enemy['shouldStayStill'] = () => {return true;};

        var location = enemy.getLocation();
        expect(location.x).toEqual(enemyInitialLocation.x);
        expect(location.y).toEqual(enemyInitialLocation.y);

        enemy.proceed(200);
        location = enemy.getLocation();
        expect(location.x).toEqual(enemyInitialLocation.x);
        expect(location.y).toEqual(enemyInitialLocation.y);
    });

    it('should approach player if player is nearby', () => {
        var enemyInitialLocation = {x: 1000, y: 1000};
        scene.addEnemy(enemyInitialLocation);
        var enemy = scene.getEnemies()[0];
        enemy['shouldStayStill'] = () => { return true;};

        // Stays still
        var location = enemy.getLocation();
        expect(location.x).toEqual(enemyInitialLocation.x);
        expect(location.y).toEqual(enemyInitialLocation.y);

        enemy.proceed(200);
        location = enemy.getLocation();
        expect(location.x).toEqual(enemyInitialLocation.x);
        expect(location.y).toEqual(enemyInitialLocation.y);
        expect(enemy['state']).toEqual(E.EnemyState.Normal);

        // Adding player nearby enemy and enemy changes state to chasing
        scene.player.changeLocation({x: enemyInitialLocation.x - 100, y: enemyInitialLocation.y - 100});
        enemy.proceed(50);
        location = enemy.getLocation();
        expect(enemy['state']).toEqual(E.EnemyState.Chasing);
        expect(location.x).toEqual(enemyInitialLocation.x);
        expect(location.y).toEqual(enemyInitialLocation.y);

        // Moves to player
        enemy.proceed(50);
        location = enemy.getLocation();
        expect(location.x).toBeLessThan(enemyInitialLocation.x);
        expect(location.y).toBeLessThan(enemyInitialLocation.y);
    });

    it('should go home if went too far from starting point', () => {
        var enemyInitialLocation = {x: 1000, y: 1000};
        scene.addEnemy(enemyInitialLocation);
        var enemy = scene.getEnemies()[0];

        enemy['state'] = E.EnemyState.Chasing;
        enemy.changeLocation({x: enemyInitialLocation.x + 500, y: enemyInitialLocation.y + 500});

        enemy.proceed(200);
        expect(enemy['state']).toEqual(E.EnemyState.Returning);

        enemy.proceed(200);
        var location = enemy.getLocation();
        expect(location.x).toBeGreaterThan(enemyInitialLocation.x);
        expect(location.y).toBeGreaterThan(enemyInitialLocation.y);
    });

    it('should switch to normal state when returned home', () => {
        var enemyInitialLocation = {x: 1000, y: 1000};
        scene.addEnemy(enemyInitialLocation);
        var enemy = scene.getEnemies()[0];

        enemy['state'] = E.EnemyState.Returning;

        enemy.proceed(200);
        enemy.changeLocation(enemyInitialLocation);
        enemy.proceed(200);
        expect(enemy['state']).toEqual(E.EnemyState.Normal);
    });

    it('should stay still when standing near player', () => {
        var enemyInitialLocation = {x: 1000, y: 1000};
        scene.addEnemy(enemyInitialLocation);
        var enemy = scene.getEnemies()[0];

        scene.player.changeLocation({x: enemyInitialLocation.x - 100, y: enemyInitialLocation.y - 100});
        enemy.proceed(5);
        enemy.changeLocation({x: enemyInitialLocation.x - 100, y: enemyInitialLocation.y - 100});
        enemy.proceed(1);

        expect(enemy.axes.x.speed).toEqual(0);
        expect(enemy.axes.y.speed).toEqual(0);
    });

    it('should strike player when standing near player', () => {
        var enemyLocation = {x: 100, y: 100};
        scene.addEnemy(enemyLocation);
        var enemy = scene.getEnemies()[0];
        scene.player.changeLocation(enemyLocation);

        // Creates stroke object which hits player
        var objCountBeforeStrike = scene.objects.length;
        var playerHp = scene.player.hp;
        scene.process();
        scene.process();
        scene.process();

        expect(scene.objects.length).toBeGreaterThan(objCountBeforeStrike);
        expect(scene.player.hp).not.toEqual(playerHp);
    });
});