var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rule_1 = require('../Rule');
var Is = (function (_super) {
    __extends(Is, _super);
    function Is() {
        _super.apply(this, arguments);
    }
    Is.prototype.isValueValid = function (value, reference) {
        return value === reference;
    };
    Is.prototype.getErrorMessage = function (reference) {
        return "The value must be " + reference.toString() + ".";
    };
    return Is;
})(Rule_1.Rule);
exports.Is = Is;
