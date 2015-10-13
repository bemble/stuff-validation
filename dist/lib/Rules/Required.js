var Required = (function () {
    function Required() {
    }
    Required.prototype.isValueValid = function (value) {
        if (typeof value === 'object' && value === null) {
            return false;
        }
        var testedValue = (typeof value === 'object') ? Object.keys(value).toString() : ('' + value);
        return testedValue.length > 0;
    };
    return Required;
})();
exports.Required = Required;
