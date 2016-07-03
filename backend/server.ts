/// <reference path="./typings/refs.d.ts" />
import http = require('http');
import app = require('./core/application');
import socket = require('./core/socket');
import config = require('./config/webServerConfig');

class Server{
    private server: http.Server;
    private application: app.Application;
    private config: config.IWebServerConfigValues;

    constructor(){}

    start() {
        this.config = config.WebServerConfig.getConfig();
        this.application = new app.Application();
        this.application.app.set('port', this.config.port);

        this.server = http.createServer(this.application.app);

        this.server.listen(this.config.port, this.config.ip);

        this.server.on('error', (err) => {this.onError(err);});
        this.server.on('listening', () => {this.onListening();});
    }

    private onListening(){
        console.log('Server started on ' + this.config.ip + ':' + this.config.port);
        this.createSocket();
    }

    private onError(error) {
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
    }

    private createSocket(){
        var s = new socket.Socket(this.server);
        s.start();
    }
}

var server = new Server();
server.start();