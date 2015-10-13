import {IRule} from './IRule';
import {NotUndefinedOrNan} from './Rules/NotUndefinedOrNan';
import {Required} from './Rules/Required';

/**
 * Collection of rules, to get them by a string and reduce the number of instance of rules.
 * There shouldn't be no need to create more than one instance of these rules.
 */
export class RulesCollection {
    private static isInited:boolean = false;
    private static collection:{[name: string]: IRule} = {};

    private static init() {
        RulesCollection.isInited = true;
        RulesCollection.collection['notUndefinedOrNan'] = new NotUndefinedOrNan();
        RulesCollection.collection['required'] = new Required();
    }

    /**
     * Add a rule to the collection
     * @param ruleName Name of the rule
     * @param rule Rule to add
     * @throws Exception if ruleName already exists in the collection
     */
    static addRule(ruleName:string, rule:IRule) {
        !RulesCollection.isInited && RulesCollection.init();
        if(RulesCollection.collection[ruleName]) {
            throw "Rule "+ ruleName + " already exists!";
        }
        RulesCollection.collection[ruleName] = rule;
    }

    /**
     * Get a validation rule by its name.
     * @param ruleName Name of the rule
     * @returns {IRule}
     */
    static getRule(ruleName:string):IRule {
        !RulesCollection.isInited && RulesCollection.init();
        return RulesCollection.collection[ruleName];
    }
}
