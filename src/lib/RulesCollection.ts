import {Rule} from './Rule';
import {DefinedAndNotNan} from './Rules/DefinedAndNotNan';
import {Required} from './Rules/Required';
import {Equals} from './Rules/Equals';
import {GreaterThan} from './Rules/GreaterThan';
import {LowerThan} from './Rules/LowerThan';

/**
* Collection of rules, to get them by a string and reduce the number of instance of rules.
* There shouldn't be no need to create more than one instance of these rules.
*/
export class RulesCollection {
  private static isInited:boolean = false;
  private static collection:{[name: string]: Rule} = {};

  private static init() {
    RulesCollection.isInited = true;
    RulesCollection.reset();
  }

  /**
   * Reset the collection.
   * Mostly usefull when unit-testing.
   */
  public static reset () {
    RulesCollection.collection = {};
    RulesCollection.collection['definedAndNotNan'] = new DefinedAndNotNan();
    RulesCollection.collection['required'] = new Required();
    RulesCollection.collection['equals'] = new Equals();
    RulesCollection.collection['greaterThan'] = new GreaterThan();
    RulesCollection.collection['lowerThan'] = new LowerThan();
  }

  /**
  * Add a rule to the collection
  * @param ruleName Name of the rule
  * @param rule Rule to add
  * @throws Exception if ruleName already exists in the collection
  */
  static addRule(ruleName:string, rule:Rule) {
    !RulesCollection.isInited && RulesCollection.init();
    if(RulesCollection.collection[ruleName]) {
      throw "Rule "+ ruleName + " already exists!";
    }
    RulesCollection.collection[ruleName] = rule;
  }

  /**
   * Set a rule into the collection.
   * Should be used in special cases such as rule localization.
   * @param ruleName Name of the rule
   * @param rule Rule to add
   */
  static setRule(ruleName:string, rule:Rule) {
    !RulesCollection.isInited && RulesCollection.init();
    RulesCollection.collection[ruleName] = rule;
  }

  /**
  * Get a validation rule by its name.
  * @param ruleName Name of the rule
  * @returns
  */
  static getRule(ruleName:string):Rule {
    !RulesCollection.isInited && RulesCollection.init();
    return RulesCollection.collection[ruleName];
  }
}
