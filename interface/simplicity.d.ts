interface IPoint {
    x: number;
    y: number;
}

interface ISize {
    width: number;
    height: number;
}

interface IPayload {
    o: Array<IObjectPayload>;
    p: IPlayerPayload;
}

interface IObjectPayload {
    l: IPoint;
    t: GameObjectType;
    h?: number;
    r?: number;
    z?: boolean;
}

interface IPlayerPayload {
    l: IPoint;
    h: number;
}

interface IClientMessage{
    t: ClientMessageType;
    c: any;
}

declare enum ClientMessageType{
    MouseClick = 0,
    UserMove = 1,
}

declare enum GameObjectType{
    Player = 0,
    Enemy = 1,
    Shot = 2,
    Stroke = 3
}