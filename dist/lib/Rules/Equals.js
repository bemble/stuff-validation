var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rule_1 = require('../Rule');
var Equals = (function (_super) {
    __extends(Equals, _super);
    function Equals() {
        _super.apply(this, arguments);
    }
    Equals.prototype.isValueValid = function (value, reference) {
        var compValue = Equals.getValueOf(value);
        var compRef = Equals.getValueOf(reference);
        return compValue === compRef;
    };
    Equals.getValueOf = function (value) {
        if (typeof value !== 'object') {
            return value;
        }
        return value.valueOf && typeof value.valueOf() !== 'object' ? value.valueOf() : value.toString();
    };
    Equals.prototype.getErrorMessage = function (reference) {
        var messageStr = "The value must equal";
        if (reference instanceof Date) {
            messageStr = "The date must be";
        }
        return messageStr + " " + reference.toString() + ".";
    };
    return Equals;
})(Rule_1.Rule);
exports.Equals = Equals;
