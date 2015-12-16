import {Rule} from '../Rule';
import {IRangeParameters} from './../RuleParameters/IRangeParameters';

export class Range extends Rule {
  /**
   * Value is valid when greater than the reference value.
   * @param value Value to check
   * @param parameters Value taken as reference in comparison
   * @returns {boolean} True if valid, false otherwise
   */
  isValueValid(value:any, parameters:IRangeParameters):boolean {
    return parameters.min <= value && value <= parameters.max;
  }

  getErrorMessage(parameters:IRangeParameters):string {
    var messageStr:any = parameters.min instanceof Date || parameters.max instanceof Date ? "date" : "value";
    return "The "+ messageStr + " must be between " + parameters.min.toString() + " and " + parameters.max.toString() + ".";
  }
}
