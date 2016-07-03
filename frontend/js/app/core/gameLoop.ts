export class GameLoop{
    stop = false;
    constructor(private doOneTick: () => void){
        this.initAnimationFrame();
    }

    public fps = 0;
    public lastCheckedTimeStamp = new Date().getTime();

    private initAnimationFrame() {
        var win: any = window;
        win.requestAnimationFrame = win.requestAnimationFrame ||
        win.webkitRequestAnimationFrame ||
        win.mozRequestAnimationFrame ||
        win.oRequestAnimationFrame ||
        win.msRequestAnimationFrame;

        if (!win.requestAnimationFrame) {
            win.requestAnimationFrame = (callback) => {
                win.setTimeout(callback, 1000 / 60);
            }
        }
    }

    public start() {
        this.loop();
    }

    private loop() {
        if (!this.stop) {
            this.doOneTick();
            this.updateFps();
            window.requestAnimationFrame(() => {
                this.loop();
            });
        }
    }

    private updateFps(){
        var now = this.getCurrentTimestamp();
        var delta = (now - this.lastCheckedTimeStamp) / 1000;
        this.lastCheckedTimeStamp = now;
        this.fps = Math.ceil(1 / delta);
    }

    private getCurrentTimestamp(){
        return new Date().getTime();
    }
}