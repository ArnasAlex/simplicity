/// <reference path="./../typings/refs.d.ts" />

export class WebServerConfig {
    private static values: IWebServerConfigValues;
    private static env: Environments;

    public static getEnvironment() {
        if (!WebServerConfig.env) {
            var result;
            if (process.env.PORT){
                result = Environments.Test;
            }
            else{
                result = Environments.Local;
            }

            WebServerConfig.env = result;
        }

        return WebServerConfig.env;
    }

    public static isLocalEnvironment() {
        return this.getEnvironment() === Environments.Local;
    }

    public static getConfig(): IWebServerConfigValues {
        if (!WebServerConfig.values) {
            var configs = [];
            configs[Environments.Local] = WebServerConfig.getLocalConfig();
            configs[Environments.Test] = WebServerConfig.getTestConfig();

            WebServerConfig.values = configs[WebServerConfig.getEnvironment()];
        }

        return WebServerConfig.values;
    }

    private static getLocalConfig(): IWebServerConfigValues {
        var port = 3000;
        var values = {
            port: port,
            ip: "127.0.0.1",
            host: "localhost:" + port,
            socketPort: port
        };
        return values;
    }

    private static getTestConfig(): IWebServerConfigValues {
        var values = {
            ip: process.env.IP,
            port: process.env.PORT,
            host: 'simplicitygame.herokuapp.com',
            socketPort: 8000
        };

        return values;
    }
}

export interface IWebServerConfigValues {
    ip: string;
    port: number;
    host: string;
    socketPort: number;
}

export enum Environments {
    Local,
    Test
}