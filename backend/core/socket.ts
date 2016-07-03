/// <reference path="./../typings/refs.d.ts" />
import ws = require('ws');
import http = require('http');
import CFG = require('../config/webServerConfig');
import AR = require('../game/core/arena');
import PL = require('../game/objects/player');

export class Socket{
    private players: Array<IPlayer> = [];
    private intervalId: NodeJS.Timer;
    private intervalTimeSpan = 20;
    private stopProcessing = false;
    private arena: AR.Arena;
    private clientUpdateInProgress = false;

    constructor(private server: http.Server){
        this.arena = new AR.Arena();
    }

    public start(){
        this.log('WebSocket starting on port: ' + CFG.WebServerConfig.getConfig().socketPort);

        var WebSocketServer = ws.Server;
        var wss = new WebSocketServer({server: this.server});

        wss.on('connection', (client) => { this.onConnection(client); });
    }

    private onConnection(client: ISocketClient){
        var playerId = client.upgradeReq.headers.cookie;
        this.log('WebSocket client connected, id: ' + playerId);
        var player = this.arena.addPlayer(playerId);
        var p = {id: playerId, client: client, player: player};
        this.players.push(p);

        this.checkStartInterval();

        client.on('close', () => { this.onClose(p); });
        client.on('message', (data, flags) => { this.onClientMessage(p, data, flags); });
    }

    private onClientMessage(player: IPlayer, data: string, flags){
        var msg: IClientMessage = JSON.parse(data);
        switch (msg.t){
            case ClientMessageType.MouseClick:
                this.playerClickedMouse(player.id, msg.c);
                break;

            case ClientMessageType.UserMove:
                this.playerUpdateMove(player.id, msg.c);
                break;
        }
    }

    private playerClickedMouse(playerId: string, location: IPoint){
        this.arena.playerShoot(playerId, location);
    }

    private playerUpdateMove(playerId: string, location: IPoint){
        this.arena.playerUpdateMove(playerId, location.x, location.y);
    }

    private checkStartInterval(){
        if (!this.intervalId){
            this.stopProcessing = false;
            this.startInterval();
        }
    }

    private startInterval(){
        this.oneTick();
    }

    private oneTick(){
        if (!this.stopProcessing) {
            this.intervalId = setTimeout(() => {
                this.updateClients();
                this.oneTick();
            }, this.intervalTimeSpan);
        }
    }

    private stopInterval(){
        if (this.intervalId){
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.stopProcessing = true;
        }
    }

    private updateClients(){
        if (!this.clientUpdateInProgress) {
            this.clientUpdateInProgress = true;
            var payload = this.getPayload();

            for (var i = 0; i < this.players.length; i++) {
                var player = this.players[i];
                var payloadClone = global.clone(payload);
                var client = player.client;
                var playerPayload = this.getPlayerSpecificPayload(payloadClone, player);
                var msg = JSON.stringify(playerPayload);
                client.send(msg, (err) => {
                    this.errorOnSend(err);
                });
            }
            this.clientUpdateInProgress = false;
        }
    }

    private getPlayerSpecificPayload(payload: IPayload, player: IPlayer){
        payload.p = {
            l: player.player.getLocation(),
            h: player.player.getHp()
        };

        return payload;
    }

    private errorOnSend(err){
        if (err){
            this.log('WebSocket error: ' + err);
        }
    }

    private getPayload(): IPayload{
        return this.arena.getPayload();
    }

    private onClose(player: IPlayer){
        this.log('WebSocket client disconnected');
        var clientNr = this.players.indexOf(player);
        this.players.splice(clientNr, 1);
        this.arena.playerLeft(player.player);
        this.checkStopInterval();
    }

    private checkStopInterval(){
        if (this.players.length === 0){
            this.stopInterval();
        }
    }

    private log(msg: string){
        console.log(msg);
    }
}

interface ISocketClient {
    on(evt: string, callback: (...params) => void);
    send(payload: any, err: (err) => void);
    upgradeReq: http.ServerRequest;
}

interface IPlayer {
    id: string;
    client: ISocketClient;
    player: PL.PlayerObject;
}