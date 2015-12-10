var DefinedAndNotNan_1 = require('./Rules/DefinedAndNotNan');
var Required_1 = require('./Rules/Required');
var Equals_1 = require('./Rules/Equals');
var GreaterThan_1 = require('./Rules/GreaterThan');
var LowerThan_1 = require('./Rules/LowerThan');
var RulesCollection = (function () {
    function RulesCollection() {
    }
    RulesCollection.init = function () {
        RulesCollection.isInited = true;
        RulesCollection.reset();
    };
    RulesCollection.reset = function () {
        RulesCollection.collection = {};
        RulesCollection.collection['definedAndNotNan'] = new DefinedAndNotNan_1.DefinedAndNotNan();
        RulesCollection.collection['required'] = new Required_1.Required();
        RulesCollection.collection['equals'] = new Equals_1.Equals();
        RulesCollection.collection['greaterThan'] = new GreaterThan_1.GreaterThan();
        RulesCollection.collection['lowerThan'] = new LowerThan_1.LowerThan();
    };
    RulesCollection.addRule = function (ruleName, rule) {
        !RulesCollection.isInited && RulesCollection.init();
        if (RulesCollection.collection[ruleName]) {
            throw "Rule " + ruleName + " already exists!";
        }
        RulesCollection.collection[ruleName] = rule;
    };
    RulesCollection.setRule = function (ruleName, rule) {
        !RulesCollection.isInited && RulesCollection.init();
        RulesCollection.collection[ruleName] = rule;
    };
    RulesCollection.getRule = function (ruleName) {
        !RulesCollection.isInited && RulesCollection.init();
        return RulesCollection.collection[ruleName];
    };
    RulesCollection.isInited = false;
    RulesCollection.collection = {};
    return RulesCollection;
})();
exports.RulesCollection = RulesCollection;
