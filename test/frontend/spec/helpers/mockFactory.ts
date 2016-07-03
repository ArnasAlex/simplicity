/// <reference path='../../typings/refs.d.ts' />
import IR = require('../../../../frontend/js/app/core/imageRepository');
import C = require('../../../../frontend/js/app/core/canvas');
import G = require('../../../../frontend/js/app/core/game');
import L = require('../../../../frontend/js/app/core/loader');
import S = require('../../../../frontend/js/app/core/scene');

export class MockFactory{
    public static getImageRepository(){
        var repository = new IR.ImageRepository();
        repository['bindImageOnLoad'] = () => {repository['imageLoaded']();}
        return repository;
    }

    public static getCanvasContext(){
        var canvas: HTMLCanvasElement = document.createElement('canvas');
        var context = canvas.getContext('2d');
        return context;
    }

    public static getDrawArea(): C.DrawArea{
        var drawArea = new C.DrawArea();
        drawArea.height = 500;
        drawArea.width = 500;
        drawArea.context = MockFactory.getCanvasContext();
        drawArea.backgroundContext = MockFactory.getCanvasContext();
        drawArea.controlsContext = MockFactory.getCanvasContext();
        drawArea.mouseLocation = {x: 5, y: 5};
        drawArea.xOffset = 0;
        drawArea.yOffset = 0;
        drawArea.sceneWidth = 1000;
        drawArea.sceneHeight = 1000;
        drawArea.sceneBoundary = 100;
        return drawArea;
    }

    public static getGame(): G.Game{
        var drawArea = MockFactory.getDrawArea();
        var game = new G.Game(drawArea);
        return game;
    }

    public static getLoader(): L.Loader{
        return new L.Loader(()=>{});
    }

    public static getScene(): S.Scene{
        return new S.Scene(MockFactory.getDrawArea(), MockFactory.getLoader(), MockFactory.getImageRepository());
    }
}