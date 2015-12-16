var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rule_1 = require('../Rule');
var Pattern = (function (_super) {
    __extends(Pattern, _super);
    function Pattern() {
        _super.apply(this, arguments);
    }
    Pattern.prototype.isValueValid = function (value, reference) {
        return reference.test(value.toString());
    };
    Pattern.prototype.getErrorMessage = function (reference) {
        return "The value must match " + reference.toString() + " pattern.";
    };
    return Pattern;
})(Rule_1.Rule);
exports.Pattern = Pattern;
