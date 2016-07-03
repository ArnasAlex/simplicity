/// <reference path='../../typings/refs.d.ts' />

export class Canvas {
    public canvases:JQuery;
    public drawArea:DrawArea;
    private canvasContainer:JQuery;
    private context:CanvasRenderingContext2D;
    private backgroundContext: CanvasRenderingContext2D;
    private controlsContext: CanvasRenderingContext2D;

    constructor(canvasContainer:JQuery) {
        this.initCanvas(canvasContainer);
        this.initDrawArea();
    }

    private initCanvas(canvasContainer:JQuery) {
        this.canvasContainer = canvasContainer;
        this.canvases = this.canvasContainer.find('canvas');
        this.context = (<HTMLCanvasElement>this.canvasContainer.find('#game')[0]).getContext('2d');
        this.backgroundContext = (<HTMLCanvasElement>this.canvasContainer.find('#background')[0]).getContext('2d');
        this.controlsContext = (<HTMLCanvasElement>this.canvasContainer.find('#controls')[0]).getContext('2d');
    }

    private initDrawArea() {
        var area = new DrawArea();
        area.context = this.context;
        area.backgroundContext = this.backgroundContext;
        area.controlsContext = this.controlsContext;
        area.width = this.canvases.width();
        area.height = this.canvases.height();
        area.mouseLocation = {x: 0, y: 0};
        area.xOffset = 0;
        area.yOffset = 0;
        this.drawArea = area;
    }

    public resize(cb?:() => void) {
        this.resetCanvasSize();
        setTimeout(() => {
            this.setCanvasSizeToParent();
            if (cb) {
                cb();
            }
        });
    }

    private resetCanvasSize() {
        this.canvases.width(0);
        this.canvases.height(0);
    }

    private setCanvasSizeToParent() {
        var wdiff = this.canvases.outerWidth(true) - this.canvases.width();
        var hdiff = this.canvases.outerHeight(true) - this.canvases.height();
        var width = this.canvasContainer.innerWidth() - wdiff;
        var height = this.canvasContainer.innerHeight() - hdiff;

        for (var i = 0; i < this.canvases.length; i++){
            var canvasEl = <HTMLCanvasElement>this.canvases[i];
            canvasEl.width = width;
            canvasEl.height = height;
        }

        this.canvases.width(width);
        this.canvases.height(height);

        this.drawArea.width = width;
        this.drawArea.height = height;
    }
}

export class DrawArea {
    context: CanvasRenderingContext2D;
    backgroundContext: CanvasRenderingContext2D;
    controlsContext: CanvasRenderingContext2D;
    width: number;
    height: number;
    mouseLocation: IPoint;
    xOffset: number;
    yOffset: number;
    sceneWidth: number;
    sceneHeight: number;
    sceneBoundary: number;
}