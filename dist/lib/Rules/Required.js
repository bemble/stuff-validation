var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rule_1 = require('../Rule');
var Required = (function (_super) {
    __extends(Required, _super);
    function Required() {
        _super.apply(this, arguments);
    }
    Required.prototype.isValueValid = function (value) {
        if (typeof value === 'object' && value === null) {
            return false;
        }
        var testedValue = (typeof value === 'object') ? Object.keys(value).toString() : ('' + value);
        return testedValue.length > 0;
    };
    return Required;
})(Rule_1.Rule);
exports.Required = Required;
