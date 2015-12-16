var Rules = require('./Rules');
var RulesCollection = (function () {
    function RulesCollection() {
    }
    RulesCollection.init = function () {
        RulesCollection.isInited = true;
        RulesCollection.reset();
    };
    RulesCollection.reset = function () {
        RulesCollection.collection = {};
        var RulesList = Rules;
        Object.keys(RulesList).forEach(function (ruleClassname) {
            var ruleName = ruleClassname[0].toLowerCase() + ruleClassname.substr(1);
            RulesCollection.collection[ruleName] = new RulesList[ruleClassname]();
        });
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
