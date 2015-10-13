var NotUndefinedOrNan = (function () {
    function NotUndefinedOrNan() {
    }
    NotUndefinedOrNan.prototype.isValueValid = function (value) {
        return value !== undefined && value === value;
    };
    return NotUndefinedOrNan;
})();
exports.NotUndefinedOrNan = NotUndefinedOrNan;
