/// <reference path="./typings/refs.d.ts" />
var http = require('http');
var app = require('./core/application');
var socket = require('./core/socket');
var config = require('./config/webServerConfig');
var Server = (function () {
    function Server() {
    }
    Server.prototype.start = function () {
        var _this = this;
        this.config = config.WebServerConfig.getConfig();
        this.application = new app.Application();
        this.application.app.set('port', this.config.port);
        this.server = http.createServer(this.application.app);
        this.server.listen(this.config.port);
        this.server.on('error', function (err) {
            _this.onError(err);
        });
        this.server.on('listening', function () {
            _this.onListening();
        });
    };
    Server.prototype.onListening = function () {
        console.log('Server started on ' + this.config.ip + ':' + this.config.port);
        this.createSocket();
    };
    Server.prototype.onError = function (error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        switch (error.code) {
            case 'EACCES':
                console.error(this.config.port + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(this.config.port + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
    Server.prototype.createSocket = function () {
        var s = new socket.Socket(this.server);
        s.start();
    };
    return Server;
})();
var server = new Server();
server.start();
//# sourceMappingURL=server.js.map