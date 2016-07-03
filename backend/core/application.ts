/// <reference path="./../typings/refs.d.ts" />
import express = require('express');
var session = require('cookie-session');
import CFG = require('../config/webServerConfig');

export class Application {
    app: express.Express;

    constructor(){
        this.initGlobalScope();
        this.app = express();
        this.initCookies();
        this.initStaticFiles();
        this.initRoutes();
        this.initErrorHandler();
        this.initDevelopmentErrorHandler();
    }

    private initCookies(){
        this.app.set('trust proxy', 1);
        this.app.use(session({
            keys: ["S1mpl!city-k3y"],
            maxAge: 30 * 60 * 1000 // session timeout 30 min
        }));
    }

    private initStaticFiles(){
        var frontendPath = __dirname + '/../../frontend/';
        this.app.use(express.static(frontendPath));
    }

    private initRoutes(){
        this.app.get('/getws', (req: express.Request, res: express.Response) => {
            var host = req.headers['host'];
            //var x = req.session();
            var portNr = host.indexOf(':');
            if (portNr > 0){
                host = host.substr(0, portNr);
            }
            res.send('ws://' + host + ':' + CFG.WebServerConfig.getConfig().socketPort);
        });
    }

    private initErrorHandler(){
        this.app.use((req, res, next) => {
            var err: any = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }

    private initDevelopmentErrorHandler(){
        if (this.app.get('env') === 'development') {
            this.app.use((err, req: express.Request, res: express.Response) => {
                res.status(err.status || 500);
                res.send(err.message + " " + err);
            });
        }
    }

    private initGlobalScope(){
        global.now = () => {return new Date().getTime()};
        global.clone = function<T>(obj: T) {
            return JSON.parse(JSON.stringify(obj));
        };
        global.random = (min: number, max: number) => {
            return Math.floor((Math.random() * (max - min) + min));
        };
        global.getDistanceBetween = (a: IPoint, b: IPoint) => {
            return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        };
    }
}
