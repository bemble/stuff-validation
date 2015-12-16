import {Rule} from '../Rule';

export class Is extends Rule {

  /**
   * Value is valid when the value is the reference.
   * @param value Value to check
   * @param reference Value taken as reference in comparison
   * @returns {boolean} True if valid, false otherwise
   */
  isValueValid(value:any, reference:any):boolean {
    return value === reference;
  }

  getErrorMessage(reference:any):string {
    return "The value must be " + reference.toString() + ".";
  }
}
