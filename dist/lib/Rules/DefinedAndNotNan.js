var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rule_1 = require('../Rule');
var DefinedAndNotNan = (function (_super) {
    __extends(DefinedAndNotNan, _super);
    function DefinedAndNotNan() {
        _super.apply(this, arguments);
    }
    DefinedAndNotNan.prototype.isValueValid = function (value) {
        return value !== undefined && value === value;
    };
    return DefinedAndNotNan;
})(Rule_1.Rule);
exports.DefinedAndNotNan = DefinedAndNotNan;
