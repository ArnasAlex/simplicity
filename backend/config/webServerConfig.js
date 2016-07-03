/// <reference path="./../typings/refs.d.ts" />
var WebServerConfig = (function () {
    function WebServerConfig() {
    }
    WebServerConfig.getEnvironment = function () {
        if (!WebServerConfig.env) {
            var result;
            if (process.env.PORT) {
                result = 1 /* Test */;
            }
            else {
                result = 0 /* Local */;
            }
            WebServerConfig.env = result;
        }
        return WebServerConfig.env;
    };
    WebServerConfig.isLocalEnvironment = function () {
        return this.getEnvironment() === 0 /* Local */;
    };
    WebServerConfig.getConfig = function () {
        if (!WebServerConfig.values) {
            var configs = [];
            configs[0 /* Local */] = WebServerConfig.getLocalConfig();
            configs[1 /* Test */] = WebServerConfig.getTestConfig();
            WebServerConfig.values = configs[WebServerConfig.getEnvironment()];
        }
        return WebServerConfig.values;
    };
    WebServerConfig.getLocalConfig = function () {
        var port = 3000;
        var values = {
            port: port,
            ip: "127.0.0.1",
            host: "localhost:" + port,
            socketPort: port
        };
        return values;
    };
    WebServerConfig.getTestConfig = function () {
        var values = {
            ip: process.env.IP,
            port: process.env.PORT,
            host: 'simplicitygame.herokuapp.com',
            socketPort: 8000
        };
        return values;
    };
    return WebServerConfig;
})();
exports.WebServerConfig = WebServerConfig;
(function (Environments) {
    Environments[Environments["Local"] = 0] = "Local";
    Environments[Environments["Test"] = 1] = "Test";
})(exports.Environments || (exports.Environments = {}));
var Environments = exports.Environments;
//# sourceMappingURL=webServerConfig.js.map