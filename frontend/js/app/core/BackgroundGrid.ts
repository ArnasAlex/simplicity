import C = require('./canvas');

export class BackgroundGrid{
    public tileSize = 50;
    public xPerspective = 1;
    public yPerspective = 0.5;
    private tileColors = [];
    private cacheCanvas: HTMLCanvasElement;
    private widthCacheCanvas = 0;
    private heightCacheCanvas = 0;

    constructor(private drawArea: C.DrawArea, private loadCallback){
        this.createCacheCanvas();
        this.fillTileColors();
        loadCallback();
    }

    private createCacheCanvas(){
        this.cacheCanvas = document.createElement('canvas');
        this.widthCacheCanvas = this.drawArea.sceneWidth + this.drawArea.sceneBoundary * 2;
        this.heightCacheCanvas = this.drawArea.sceneHeight + this.drawArea.sceneBoundary * 2;
    }

    draw(redraw?: boolean){
        if (redraw) {
            this.drawGridToCache();
        }

        this.drawArea.backgroundContext.drawImage(
            this.cacheCanvas,
            -this.drawArea.xOffset, -this.drawArea.yOffset,
            this.drawArea.width, this.drawArea.height,
            0, 0,
            this.drawArea.width, this.drawArea.height);
    }

    getTileCountHorizontally(){
        return Math.ceil(this.widthCacheCanvas / (2 * this.tileSize * this.xPerspective)) + 1;
    }

    getTileCountVertically(){
        return Math.ceil(this.heightCacheCanvas * 2 / (2 * this.tileSize * this.yPerspective)) + 1;
    }

    getTileCoordinates(xNr, yNr): IPoint {
        var x = xNr * this.tileSize * (this.xPerspective * 2);
        if (yNr % 2 === 1){
            x = x - this.tileSize;
        }
        var y = yNr * this.tileSize * (this.yPerspective * 2) / 2;
        var point = {x: x, y: y};

        return point;
    }

    private drawGridToCache(){
        this.widthCacheCanvas = this.drawArea.sceneWidth + this.drawArea.sceneBoundary * 2;
        this.heightCacheCanvas = this.drawArea.sceneHeight + this.drawArea.sceneBoundary * 2;
        this.cacheCanvas.width = this.widthCacheCanvas;
        this.cacheCanvas.height = this.heightCacheCanvas;

        var tileCountHorizontally = this.getTileCountHorizontally();
        var tileCountVertically = this.getTileCountVertically();
        for (var i = 0; i < tileCountHorizontally; i++){
            for (var j = 0; j < tileCountVertically; j++) {
                var point = this.getTileCoordinates(i, j);
                var color = this.getTileColor(i, j);
                this.drawTile(point, color);
            }
        }

        this.drawBoundary();
    }

    private drawBoundary(){
        this.drawBoundaryLine();
        this.drawBoundaryShade();
    }

    private drawBoundaryShade(){
        var ctx = this.cacheCanvas.getContext('2d');
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = 'black';
        var boundary = this.drawArea.sceneBoundary;
        ctx.fillRect(0, 0, this.widthCacheCanvas, boundary);
        ctx.fillRect(0, boundary, boundary, this.drawArea.sceneHeight);
        ctx.fillRect(boundary + this.drawArea.sceneWidth, boundary, boundary, this.drawArea.sceneHeight);
        ctx.fillRect(0, boundary + this.drawArea.sceneHeight, this.widthCacheCanvas, boundary);
        ctx.globalAlpha = 1;
    }

    private drawBoundaryLine(){
        var ctx = this.cacheCanvas.getContext('2d');
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'black';
        ctx.rect(
            this.drawArea.sceneBoundary, this.drawArea.sceneBoundary,
            this.drawArea.sceneWidth, this.drawArea.sceneHeight);
        ctx.stroke();
    }

    private drawTile(point: IPoint, color: string){
        var x = point.x;
        var y = point.y;
        var ctx = this.cacheCanvas.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = 'white';
        ctx.moveTo(x, y);
        ctx.lineWidth = 1;
        ctx.lineTo(x + this.tileSize * this.xPerspective, y + this.tileSize * this.yPerspective);
        ctx.lineTo(x + this.tileSize * 2 * this.xPerspective, y);
        ctx.lineTo(x + this.tileSize * this.xPerspective, y - this.tileSize * this.yPerspective);
        ctx.lineTo(x, y);
        ctx.fill();
        ctx.stroke();
    }

    private getRandomColor(){
        var letters = '89ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 8)];
        }
        return color;
    }

    private getTileColor(xNr, yNr){
        return this.tileColors[xNr][yNr];
    }

    private fillTileColors(){
        var fewColors = [];
        var colorCount = 3;
        for (var i = 0; i < colorCount; i++){
            fewColors.push(this.getRandomColor());
        }

        var countHorizontally = this.getTileCountHorizontally();
        var countVertically = this.getTileCountVertically();
        for (var i = 0; i < countHorizontally; i++){
            this.tileColors[i] = [];
            for (var j = 0; j < countVertically; j++){
                var color = fewColors[Math.floor(Math.random() * 5)];
                this.tileColors[i][j] = color;
            }
        }
    }
}