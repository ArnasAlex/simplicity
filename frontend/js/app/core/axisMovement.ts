/// <reference path='../../typings/refs.d.ts' />
export class AxisMovement {
    private static speedConst = 16;
    private remainder: number = 0;

    constructor(
        public coordinate:number,
        public speed:number) {
    }

    update(moveDestination: IMoveDestination){
        this.coordinate = moveDestination.coordinate;
        this.remainder = moveDestination.remainder;
    }

    reset(coordinate: number){
        this.coordinate = coordinate;
    }

    changeSpeed(speed: number){
        this.speed = speed;
    }

    getMoveDestination(timeSpan: number): IMoveDestination{
        var distance = this.getDistance(this.speed, timeSpan);
        distance += this.remainder;
        var rounded = Math.floor(distance);
        return {
            coordinate: this.coordinate + rounded,
            remainder: distance - rounded
        };
    }

    private getDistance(speed, timeSpan){
        return speed * timeSpan / AxisMovement.speedConst;
    }
}

interface IMoveDestination{
    coordinate: number;
    remainder: number;
}

export class AxesMovement {
    public x: AxisMovement;
    public y: AxisMovement;
    constructor(
        location: IPoint,
        xSpeed: number = 0,
        ySpeed: number = 0)
    {
        this.x = new AxisMovement(location.x, xSpeed);
        this.y = new AxisMovement(location.y, ySpeed);
    }

    public changeLocation(location: IPoint){
        this.x.reset(location.x);
        this.y.reset(location.y);
    }

    public changeSpeed(xSpeed, ySpeed){
        this.x.changeSpeed(xSpeed);
        this.y.changeSpeed(ySpeed);
    }

    public getDestination(timeSpan): {x: IMoveDestination; y: IMoveDestination}{
        var x = this.x.getMoveDestination(timeSpan);
        var y = this.y.getMoveDestination(timeSpan);
        return {x: x, y: y};
    }
}