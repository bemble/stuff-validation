/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="IEs6PromiseLibrary.d.ts" />
var RulesCollection_1 = require('./RulesCollection');
var ValidationRule_1 = require('./ValidationRule');
var Validator = (function () {
    function Validator() {
        this.Promise = Promise;
    }
    Validator.prototype.setPromiseLibrary = function (newPromiseLibrary) {
        this.Promise = newPromiseLibrary;
    };
    Validator.prototype.validateValue = function (value, rules) {
        var usedRules = rules ? rules : [];
        usedRules.unshift('definedAndNotNan');
        var isNullValid = this.isNullValid(value, usedRules);
        for (var i = 0; i < usedRules.length && !isNullValid; i++) {
            var validationRule = Validator.getValidationRule(usedRules[i]);
            if (!validationRule.isValueValid(value)) {
                return validationRule;
            }
        }
        return null;
    };
    Validator.prototype.asyncValidateValue = function (value, rules) {
        var _this = this;
        var usedRules = rules ? rules : [];
        var promises = usedRules.map(function (rule) {
            var validationRule = Validator.getValidationRule(rule);
            return validationRule.asyncIsValueValid(value, _this.Promise);
        });
        return this.Promise.all(promises);
    };
    Validator.prototype.isValueValid = function (value, rules, asyncRules) {
        var _this = this;
        var syncPromise = new this.Promise(function (resolve, reject) {
            (_this.validateValue(value, rules) === null) ? resolve() : reject();
        });
        var asyncPromise = this.asyncValidateValue(value, asyncRules);
        return this.Promise.all([syncPromise, asyncPromise]);
    };
    Validator.prototype.isObjectValid = function (objectToValidate, validationConfig) {
        var promises = this.getObjectValidationPromise(objectToValidate, validationConfig).concat(this.getSubObjectsValidationPromises(objectToValidate));
        return this.Promise.all(promises);
    };
    Validator.prototype.isNullValid = function (value, rules) {
        if (value !== null) {
            return false;
        }
        return !rules.some(function (rule) {
            var validationRule = Validator.getValidationRule(rule);
            return validationRule.rule === RulesCollection_1.RulesCollection.getRule('required');
        });
    };
    Validator.getValidationRule = function (rawRule) {
        return rawRule instanceof ValidationRule_1.ValidationRule ? rawRule : new ValidationRule_1.ValidationRule(rawRule);
    };
    Validator.prototype.getObjectValidationPromise = function (objectToValidate, validationConfig) {
        var config = Validator.getValidationConfiguration(objectToValidate, validationConfig) || {};
        var propertiesWithValidation = (config.rules ? Object.keys(config.rules) : []).concat(config.asyncRules ? Object.keys(config.asyncRules) : []);
        propertiesWithValidation = propertiesWithValidation.filter(function (value, index, currentArray) {
            return currentArray.indexOf(value) === index;
        });
        return this.getPropertiesValidationPromise(propertiesWithValidation, objectToValidate, config);
    };
    Validator.prototype.getSubObjectsValidationPromises = function (objectToValidate) {
        var _this = this;
        return this.getObjectProperties(objectToValidate).map(function (propertyName) {
            return _this.isObjectValid(objectToValidate[propertyName]);
        });
    };
    Validator.prototype.getPropertiesValidationPromise = function (propertiesName, objectToValidate, config) {
        var _this = this;
        return propertiesName.map(function (propertyName) {
            var rules = config && config.rules && config.rules[propertyName];
            var asyncRules = config && config.asyncRules && config.asyncRules[propertyName];
            return _this.isValueValid(objectToValidate[propertyName], rules, asyncRules);
        });
    };
    Validator.getValidationConfiguration = function (objectToValidate, validationConfig) {
        return validationConfig || (typeof objectToValidate === "object" && objectToValidate.validationConfiguration);
    };
    Validator.prototype.getObjectProperties = function (object) {
        var objectProperties = Object.keys(object);
        return objectProperties.filter(function (propertyName) {
            var property = object[propertyName];
            return propertyName !== 'validationConfiguration' && typeof property === 'object' && property !== null;
        });
    };
    return Validator;
})();
exports.Validator = Validator;
