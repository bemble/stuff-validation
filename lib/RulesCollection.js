var NotUndefinedOrNan_1 = require('./Rules/NotUndefinedOrNan');
var Required_1 = require('./Rules/Required');
var RulesCollection = (function () {
    function RulesCollection() {
    }
    RulesCollection.init = function () {
        RulesCollection.isInited = true;
        RulesCollection.collection['notUndefinedOrNan'] = new NotUndefinedOrNan_1.NotUndefinedOrNan();
        RulesCollection.collection['required'] = new Required_1.Required();
    };
    RulesCollection.addRule = function (ruleName, rule) {
        !RulesCollection.isInited && RulesCollection.init();
        if (RulesCollection.collection[ruleName]) {
            throw "Rule " + ruleName + " already exists!";
        }
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
