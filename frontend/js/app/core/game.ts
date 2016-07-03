/// <reference path='../../typings/refs.d.ts' />
import S = require('./scene');
import C = require('./canvas');
import L = require('./loader')
import IR = require('./imageRepository');
import GL = require('./gameLoop');

export class Game {
    private lastEnemyCreationDate: number;
    private scene: S.Scene;
    private loader: L.Loader;
    private gameLoop: GL.GameLoop;
    private connectedToServer = false;

    constructor(private drawArea: C.DrawArea) {
        this.initGameLoop();
        this.initLoader();
        this.initScene();
        this.lastEnemyCreationDate = this.getCurrentTimestamp();
    }

    private initGameLoop(){
        this.gameLoop = new GL.GameLoop(() => {this.doOneTick()});
    }

    private initLoader() {
        this.loader = new L.Loader(() => { this.startGame(); });
    }

    private initScene() {
        var repository = new IR.ImageRepository();
        this.scene = new S.Scene(this.drawArea, this.loader, repository);
    }

    private startGame(){
        this.layoutChanged();
        this.gameLoop.start();
    }

    canvasReady(){
        this.loader.componentLoaded(L.LoadableComponentType.canvas);
    }

    layoutChanged(){
        this.scene.layoutChanged();
    }

    update(payload: IPayload){
        this.scene.payload = payload;
        if (!this.connectedToServer){
            this.connectedToServer = true;
            this.loader.componentLoaded(L.LoadableComponentType.connected);
        }
    }

    private doOneTick() {
        this.updateFps();
        this.scene.process();
        if (this.scene.payload.p.h == 0){
            this.gameLoop.stop = true;
        }
    }

    private updateFps(){
        this.scene.fps = this.gameLoop.fps;
    }

    private getCurrentTimestamp(){
        return new Date().getTime();
    }
}