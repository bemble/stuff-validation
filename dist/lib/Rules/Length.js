var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rule_1 = require('../Rule');
var Length = (function (_super) {
    __extends(Length, _super);
    function Length() {
        _super.apply(this, arguments);
    }
    Length.prototype.isValueValid = function (value, parameters) {
        var length = value instanceof Array ? value.length : value.toString().length;
        if (parameters.equals !== undefined && length !== parameters.equals) {
            return false;
        }
        var minLength = parameters.min !== undefined ? parameters.min : -Infinity;
        var maxLength = parameters.max !== undefined ? parameters.max : Infinity;
        return minLength <= length && length <= maxLength;
    };
    Length.prototype.getErrorMessage = function (maxLength) {
        return "The value length must be lower or equal to " + maxLength + ".";
    };
    return Length;
})(Rule_1.Rule);
exports.Length = Length;
