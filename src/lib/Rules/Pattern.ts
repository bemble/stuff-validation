import {Rule} from '../Rule';

export class Pattern extends Rule {

  /**
   * Value is valid when the value is the reference.
   * @param value Value to check
   * @param reference Value taken as reference in comparison
   * @returns {boolean} True if valid, false otherwise
   */
  isValueValid(value:any, reference:RegExp):boolean {
    return reference.test(value.toString());
  }

  getErrorMessage(reference:RegExp):string {
    return "The value must match " + reference.toString() + " pattern.";
  }
}
