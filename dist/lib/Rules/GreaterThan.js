var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rule_1 = require('../Rule');
var GreaterThan = (function (_super) {
    __extends(GreaterThan, _super);
    function GreaterThan() {
        _super.apply(this, arguments);
    }
    GreaterThan.prototype.isValueValid = function (value, parameters) {
        var ref = parameters.reference;
        return !parameters.orEqual ? value > ref : value >= ref;
    };
    GreaterThan.prototype.getErrorMessage = function (parameters) {
        var messageStr = "The value must be greater";
        if (parameters.reference instanceof Date) {
            messageStr = "The date must be later";
        }
        if (!parameters.orEqual) {
            messageStr += " than ";
        }
        else {
            messageStr += " or equal to ";
        }
        return messageStr + parameters.reference.toString() + ".";
    };
    return GreaterThan;
})(Rule_1.Rule);
exports.GreaterThan = GreaterThan;
