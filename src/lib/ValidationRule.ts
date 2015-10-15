import {Rule} from './Rule';
import {RulesCollection} from './RulesCollection';

/**
* Rules used by the validator.
*/
export class ValidationRule {
  rule:Rule;

  /**
  * @param rawRule Rule that will be applied by the validator
  * @param parameters Parameters that will be interpreted and given to the rule when isValueValid will be called
  */
  constructor(rawRule:Rule|string, public parameters?:any[]|any, public applyCondition?:any) {
    if (!rawRule) {
      throw "RawRule must be a instance of Rule or a not-empty string";
    }
    this.rule = rawRule instanceof Rule ? rawRule : RulesCollection.getRule(rawRule.toString());
  }

  /**
  * Interpret the application condition.
  * @return The boolean value of applyCondition interpretation if set, true otherwise.
  */
  shouldBeApplied():boolean {
    return this.applyCondition === undefined || this.applyCondition === null || !!this.getValueFromFunctionOrItself(this.applyCondition);
  }

  /**
  * Interprets and return the value of the parameters.
  * @return The interpreted values of the parameters.
  */
  getParametersValues():any[]|any {
    if(typeof this.parameters === 'object') {
      var parametersValues:any = this.parameters instanceof Array ? [] : {};
      Object.keys(this.parameters).forEach((parameterName) => {
        parametersValues[parameterName] = this.getValueFromFunctionOrItself(this.parameters[parameterName]);
      });
      return parametersValues;
    }
    return this.getValueFromFunctionOrItself(this.parameters);
  }

  /**
   * Check if the value is valid according to the object's rule.
   * @param value Value to validate
   */
  isValueValid(value:any):boolean {
    return this.shouldBeApplied() ? this.rule.isValueValid(value, this.getParametersValues()) : true;
  }

  private getValueFromFunctionOrItself(rawValue:any):any {
    if (typeof rawValue === 'function') {
      return rawValue();
    }
    return rawValue;
  }
}
