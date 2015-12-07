import {Rule} from '../Rule';

export class Required extends Rule {
  /**
  * Value is valid when not null, undefined, empty object, empty string, empty array or NaN.
  * @param value Value to check
  * @returns {boolean} True if valid, false otherwise
  */
  isValueValid(value:any):boolean {
    if (typeof value === 'object' && value === null) {
      return false;
    }
    var testedValue:string = (typeof value === 'object') ? Object.keys(value).toString() : ('' + value);
    return testedValue.length > 0;
  }

  getErrorMessage():string {
    return "This value is mandatory.";
  }
}
