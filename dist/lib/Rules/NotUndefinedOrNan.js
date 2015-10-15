var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rule_1 = require('../Rule');
var NotUndefinedOrNan = (function (_super) {
    __extends(NotUndefinedOrNan, _super);
    function NotUndefinedOrNan() {
        _super.apply(this, arguments);
    }
    NotUndefinedOrNan.prototype.isValueValid = function (value) {
        return value !== undefined && value === value;
    };
    return NotUndefinedOrNan;
})(Rule_1.Rule);
exports.NotUndefinedOrNan = NotUndefinedOrNan;
