/// <reference path="./../typings/refs.d.ts" />
var ws = require('ws');
var CFG = require('../config/webServerConfig');
var AR = require('../game/core/arena');
var Socket = (function () {
    function Socket(server) {
        this.server = server;
        this.players = [];
        this.intervalTimeSpan = 20;
        this.stopProcessing = false;
        this.clientUpdateInProgress = false;
        this.arena = new AR.Arena();
    }
    Socket.prototype.start = function () {
        var _this = this;
        this.log('WebSocket starting on port: ' + CFG.WebServerConfig.getConfig().socketPort);
        var WebSocketServer = ws.Server;
        var wss = new WebSocketServer({ server: this.server });
        wss.on('connection', function (client) {
            _this.onConnection(client);
        });
    };
    Socket.prototype.onConnection = function (client) {
        var _this = this;
        var playerId = client.upgradeReq.headers.cookie;
        this.log('WebSocket client connected, id: ' + playerId);
        var player = this.arena.addPlayer(playerId);
        var p = { id: playerId, client: client, player: player };
        this.players.push(p);
        this.checkStartInterval();
        client.on('close', function () {
            _this.onClose(p);
        });
        client.on('message', function (data, flags) {
            _this.onClientMessage(p, data, flags);
        });
    };
    Socket.prototype.onClientMessage = function (player, data, flags) {
        var msg = JSON.parse(data);
        switch (msg.t) {
            case 0 /* MouseClick */:
                this.playerClickedMouse(player.id, msg.c);
                break;
            case 1 /* UserMove */:
                this.playerUpdateMove(player.id, msg.c);
                break;
        }
    };
    Socket.prototype.playerClickedMouse = function (playerId, location) {
        this.arena.playerShoot(playerId, location);
    };
    Socket.prototype.playerUpdateMove = function (playerId, location) {
        this.arena.playerUpdateMove(playerId, location.x, location.y);
    };
    Socket.prototype.checkStartInterval = function () {
        if (!this.intervalId) {
            this.stopProcessing = false;
            this.startInterval();
        }
    };
    Socket.prototype.startInterval = function () {
        this.oneTick();
    };
    Socket.prototype.oneTick = function () {
        var _this = this;
        if (!this.stopProcessing) {
            this.intervalId = setTimeout(function () {
                _this.updateClients();
                _this.oneTick();
            }, this.intervalTimeSpan);
        }
    };
    Socket.prototype.stopInterval = function () {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.stopProcessing = true;
        }
    };
    Socket.prototype.updateClients = function () {
        var _this = this;
        if (!this.clientUpdateInProgress) {
            this.clientUpdateInProgress = true;
            var payload = this.getPayload();
            for (var i = 0; i < this.players.length; i++) {
                var player = this.players[i];
                var payloadClone = global.clone(payload);
                var client = player.client;
                var playerPayload = this.getPlayerSpecificPayload(payloadClone, player);
                var msg = JSON.stringify(playerPayload);
                client.send(msg, function (err) {
                    _this.errorOnSend(err);
                });
            }
            this.clientUpdateInProgress = false;
        }
    };
    Socket.prototype.getPlayerSpecificPayload = function (payload, player) {
        payload.p = {
            l: player.player.getLocation(),
            h: player.player.getHp()
        };
        return payload;
    };
    Socket.prototype.errorOnSend = function (err) {
        if (err) {
            this.log('WebSocket error: ' + err);
        }
    };
    Socket.prototype.getPayload = function () {
        return this.arena.getPayload();
    };
    Socket.prototype.onClose = function (player) {
        this.log('WebSocket client disconnected');
        var clientNr = this.players.indexOf(player);
        this.players.splice(clientNr, 1);
        this.arena.playerLeft(player.player);
        this.checkStopInterval();
    };
    Socket.prototype.checkStopInterval = function () {
        if (this.players.length === 0) {
            this.stopInterval();
        }
    };
    Socket.prototype.log = function (msg) {
        console.log(msg);
    };
    return Socket;
})();
exports.Socket = Socket;
//# sourceMappingURL=socket.js.map