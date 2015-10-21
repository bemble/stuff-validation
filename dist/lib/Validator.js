var RulesCollection_1 = require('./RulesCollection');
var ValidationRule_1 = require('./ValidationRule');
var Validator = (function () {
    function Validator() {
    }
    Validator.prototype.validateValue = function (value, rules) {
        var usedRules = rules ? rules : [];
        usedRules.unshift('definedAndNotNan');
        var isNullValid = this.isNullValid(value, usedRules);
        for (var i = 0; i < usedRules.length && !isNullValid; i++) {
            var validationRule = this.getValidationRule(usedRules[i]);
            if (!validationRule.isValueValid(value)) {
                return validationRule;
            }
        }
        return null;
    };
    Validator.prototype.isNullValid = function (value, rules) {
        var _this = this;
        if (value !== null) {
            return false;
        }
        return !rules.some(function (rule) {
            var validationRule = _this.getValidationRule(rule);
            return validationRule.rule === RulesCollection_1.RulesCollection.getRule('required');
        });
    };
    Validator.prototype.getValidationRule = function (rawRule) {
        return rawRule instanceof ValidationRule_1.ValidationRule ? rawRule : new ValidationRule_1.ValidationRule(rawRule);
    };
    Validator.prototype.isValueValid = function (value, rules) {
        return this.validateValue(value, rules) === null;
    };
    Validator.prototype.isObjectValid = function (objectToValidate, validationConfig) {
        var config = this.getValidationConfiguration(objectToValidate, validationConfig);
        if (config && config.rules) {
            var validatedProperties = Object.keys(config.rules);
            if (this.hasInvalidProperty(validatedProperties, objectToValidate, config.rules)) {
                return false;
            }
        }
        return this.applyValidationOnObjectProperties('isObjectValid', objectToValidate);
    };
    Validator.prototype.isGroupValid = function (objectToValidate, groupName, validationConfig) {
        var config = this.getValidationConfiguration(objectToValidate, validationConfig);
        if (config.groups && config.groups[groupName] && config.rules) {
            var validatedProperties = config.groups[groupName];
            if (this.hasInvalidProperty(validatedProperties, objectToValidate, config.rules)) {
                return false;
            }
        }
        return this.applyValidationOnObjectProperties('isGroupValid', objectToValidate, [groupName]);
    };
    Validator.prototype.getValidationConfiguration = function (objectToValidate, validationConfig) {
        return validationConfig || (typeof objectToValidate === "object" && objectToValidate.validationConfiguration);
    };
    Validator.prototype.applyValidationOnObjectProperties = function (functionName, object, params) {
        var _this = this;
        var objectProperties = this.getObjectProperties(object);
        return objectProperties.length === 0 || !objectProperties.some(function (propertyName) {
            var property = object[propertyName];
            var callArgs = [property].concat(params);
            return !_this[functionName].apply(_this, callArgs);
        });
    };
    Validator.prototype.getObjectProperties = function (object) {
        var objectProperties = Object.keys(object);
        return objectProperties.filter(function (propertyName) {
            if (propertyName !== 'validationConfiguration') {
                var property = object[propertyName];
                return typeof property === 'object' && property !== null;
            }
            return false;
        });
    };
    Validator.prototype.hasInvalidProperty = function (propertiesName, objectToValidate, rules) {
        var _this = this;
        return propertiesName.some(function (propertyName) {
            if (!rules[propertyName]) {
                return false;
            }
            var value = objectToValidate[propertyName];
            return !_this.isValueValid(value, rules[propertyName]);
        });
    };
    return Validator;
})();
exports.Validator = Validator;
