var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rule_1 = require('../Rule');
var Range = (function (_super) {
    __extends(Range, _super);
    function Range() {
        _super.apply(this, arguments);
    }
    Range.prototype.isValueValid = function (value, parameters) {
        return parameters.min <= value && value <= parameters.max;
    };
    Range.prototype.getErrorMessage = function (parameters) {
        var messageStr = parameters.min instanceof Date || parameters.max instanceof Date ? "date" : "value";
        return "The " + messageStr + " must be between " + parameters.min.toString() + " and " + parameters.max.toString() + ".";
    };
    return Range;
})(Rule_1.Rule);
exports.Range = Range;
