var RulesCollection_1 = require('./RulesCollection');
var Validator = (function () {
    function Validator() {
    }
    Validator.prototype.validateValue = function (value, rules) {
        var validationRules = this.getValidationRules(rules);
        var isNullValid = this.isNullValid(value, validationRules);
        for (var i = 0; i < validationRules.length && !isNullValid; i++) {
            var validatorRule = this.getRule(validationRules[i]);
            if (validatorRule.onlyIf && validatorRule.rule.isValueValid(value, validatorRule.parameters) === false) {
                return validatorRule.rule;
            }
        }
        return null;
    };
    Validator.prototype.isNullValid = function (value, validationRules) {
        var _this = this;
        if (value !== null) {
            return false;
        }
        return !validationRules.some(function (rule) {
            var validatorRule = _this.getRule(rule);
            return validatorRule.rule === RulesCollection_1.RulesCollection.getRule('required');
        });
    };
    Validator.prototype.getValidationRules = function (rawRules) {
        var rules = rawRules instanceof Array ? rawRules : [];
        if (rawRules && rules.length === 0) {
            rules.push(rawRules);
        }
        rules.unshift('notUndefinedOrNan');
        return rules;
    };
    Validator.prototype.getRule = function (rawRule) {
        var rule = null;
        if (typeof rawRule === 'object' && rawRule.rule) {
            rule = rawRule.rule;
        }
        else {
            rule = this.getRuleObject(rawRule);
        }
        return {
            rule: rule,
            parameters: this.getRuleParameters(rawRule),
            onlyIf: this.getRuleOnlyIf(rawRule)
        };
    };
    Validator.prototype.getRuleObject = function (rawRule) {
        if (rawRule.isValueValid) {
            return rawRule;
        }
        var ruleName = null;
        if (typeof rawRule === 'string') {
            ruleName = rawRule;
        }
        else if (typeof rawRule === 'object') {
            ruleName = rawRule.name ? rawRule.name : null;
        }
        return RulesCollection_1.RulesCollection.getRule(ruleName);
    };
    Validator.prototype.getRuleParameters = function (rawRule) {
        var _this = this;
        if (typeof rawRule === 'object' && rawRule.parameters !== undefined) {
            if (typeof rawRule.parameters === 'object') {
                var parameters = rawRule.parameters instanceof Array ? [] : {};
                Object.keys(rawRule.parameters).forEach(function (parameterName) {
                    parameters[parameterName] = _this.getValue(rawRule.parameters[parameterName]);
                });
                return parameters;
            }
            return this.getValue(rawRule.parameters);
        }
    };
    Validator.prototype.getRuleOnlyIf = function (rawRule) {
        if (typeof rawRule === 'object' && rawRule.onlyIf !== undefined) {
            return this.getValue(rawRule.onlyIf);
        }
        return true;
    };
    Validator.prototype.getValue = function (rawValue) {
        if (typeof rawValue === 'function') {
            return rawValue();
        }
        return rawValue;
    };
    Validator.prototype.isValueValid = function (value, rules) {
        return this.validateValue(value, rules) === null;
    };
    Validator.prototype.isObjectValid = function (objectToValidate) {
        if (objectToValidate.validationRules) {
            var validatedProperties = Object.keys(objectToValidate.validationRules);
            if (this.hasInvalidProperty(validatedProperties, objectToValidate)) {
                return false;
            }
        }
        return this.isValidOnObjectProperties('isObjectValid', objectToValidate);
    };
    Validator.prototype.isGroupValid = function (objectToValidate, groupName) {
        if (objectToValidate.validationGroups && objectToValidate.validationGroups[groupName] && objectToValidate.validationRules) {
            var validatedProperties = objectToValidate.validationGroups[groupName];
            if (this.hasInvalidProperty(validatedProperties, objectToValidate)) {
                return false;
            }
        }
        return this.isValidOnObjectProperties('isGroupValid', objectToValidate, [groupName]);
    };
    Validator.prototype.isValidOnObjectProperties = function (functionName, object, params) {
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
            if (!(propertyName == 'validationRules' || propertyName === 'validationGroups')) {
                var property = object[propertyName];
                return typeof property === 'object' && property !== null;
            }
            return false;
        });
    };
    Validator.prototype.hasInvalidProperty = function (propertiesName, objectToValidate) {
        var _this = this;
        return propertiesName.some(function (propertyName) {
            if (!objectToValidate.validationRules[propertyName]) {
                return false;
            }
            var value = objectToValidate[propertyName];
            var rules = objectToValidate.validationRules[propertyName];
            return !_this.isValueValid(value, rules);
        });
    };
    return Validator;
})();
exports.Validator = Validator;
