var Operation = (function () {
    function Operation() {
    }
    Operation.prototype.execute = function (responeCallback) {
        throw Error("Override execute() method.");
    };
    return Operation;
})();
exports.Operation = Operation;
//# sourceMappingURL=operation.js.map