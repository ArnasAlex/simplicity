export class Operation {
    public execute(responeCallback: (error: string, response: any) => void) {
        throw Error("Override execute() method.");
    }
}

