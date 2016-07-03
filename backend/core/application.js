var express = require('express');
var session = require('cookie-session');
var CFG = require('../config/webServerConfig');
var Application = (function () {
    function Application() {
        this.initGlobalScope();
        this.app = express();
        this.initCookies();
        this.initStaticFiles();
        this.initRoutes();
        this.initErrorHandler();
        this.initDevelopmentErrorHandler();
    }
    Application.prototype.initCookies = function () {
        this.app.set('trust proxy', 1);
        this.app.use(session({
            keys: ["S1mpl!city-k3y"],
            maxAge: 30 * 60 * 1000
        }));
    };
    Application.prototype.initStaticFiles = function () {
        var frontendPath = __dirname + '/../../frontend/';
        this.app.use(express.static(frontendPath));
    };
    Application.prototype.initRoutes = function () {
        this.app.get('/getws', function (req, res) {
            var host = req.headers['host'];
            var portNr = host.indexOf(':');
            if (portNr > 0) {
                host = host.substr(0, portNr);
            }
            res.send('ws://' + host + ':' + CFG.WebServerConfig.getConfig().socketPort);
        });
    };
    Application.prototype.initErrorHandler = function () {
        this.app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    };
    Application.prototype.initDevelopmentErrorHandler = function () {
        if (this.app.get('env') === 'development') {
            this.app.use(function (err, req, res) {
                res.status(err.status || 500);
                res.send(err.message + " " + err);
            });
        }
    };
    Application.prototype.initGlobalScope = function () {
        global.now = function () {
            return new Date().getTime();
        };
        global.clone = function (obj) {
            return JSON.parse(JSON.stringify(obj));
        };
        global.random = function (min, max) {
            return Math.floor((Math.random() * (max - min) + min));
        };
        global.getDistanceBetween = function (a, b) {
            return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        };
    };
    return Application;
})();
exports.Application = Application;
//# sourceMappingURL=application.js.map