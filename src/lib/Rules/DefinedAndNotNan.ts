import {Rule} from '../Rule';

export class DefinedAndNotNan extends Rule {
  /**
  * Value is valid when not undefined or NaN.
  * @param value Value to check
  * @returns {boolean} True if valid, false otherwise
  */
  isValueValid(value:any):boolean {
    return value !== undefined && value === value;
  }

  getErrorMessage():string {
    return "The entered value is invalid."
  }
}
