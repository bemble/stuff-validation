var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rule_1 = require('../Rule');
var LowerThan = (function (_super) {
    __extends(LowerThan, _super);
    function LowerThan() {
        _super.apply(this, arguments);
    }
    LowerThan.prototype.isValueValid = function (value, parameters) {
        var ref = parameters.reference;
        return !parameters.orEqual ? value < ref : value <= ref;
    };
    LowerThan.prototype.getErrorMessage = function (parameters) {
        var messageStr = "The value must be lower";
        if (parameters.reference instanceof Date) {
            messageStr = "The date must be earlier";
        }
        if (!parameters.orEqual) {
            messageStr += " than ";
        }
        else {
            messageStr += " or equal to ";
        }
        return messageStr + parameters.reference.toString() + ".";
    };
    return LowerThan;
})(Rule_1.Rule);
exports.LowerThan = LowerThan;
