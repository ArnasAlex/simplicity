import OP = require('./base/operation');

export class GetPlayerPayloadOperation extends OP.Operation {
    public execute(responeCallback: (error: string, response: number) => void) {
        throw Error("Override execute() method.");
    }
}