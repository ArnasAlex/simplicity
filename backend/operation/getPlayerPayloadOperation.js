var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OP = require('./base/operation');
var GetPlayerPayloadOperation = (function (_super) {
    __extends(GetPlayerPayloadOperation, _super);
    function GetPlayerPayloadOperation() {
        _super.apply(this, arguments);
    }
    GetPlayerPayloadOperation.prototype.execute = function (responeCallback) {
        throw Error("Override execute() method.");
    };
    return GetPlayerPayloadOperation;
})(OP.Operation);
exports.GetPlayerPayloadOperation = GetPlayerPayloadOperation;
//# sourceMappingURL=getPlayerPayloadOperation.js.map