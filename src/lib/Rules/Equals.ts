import {Rule} from '../Rule';

export class Equals extends Rule {

  /**
   * Value is valid when equals the reference value.
   * When working with objects, valueOf or toString are used, not their reference.
   * @param value Value to check
   * @param reference Value taken as reference in comparison
   * @returns {boolean} True if valid, false otherwise
   */
  isValueValid(value:any, reference:any):boolean {
    var compValue = Equals.getValueOf(value);
    var compRef = Equals.getValueOf(reference);

    return compValue === compRef;
  }

  private static getValueOf(value:any):any {
    if (typeof value !== 'object') {
      return value;
    }
    return value.valueOf && typeof value.valueOf() !== 'object' ? value.valueOf() : value.toString();
  }

  getErrorMessage(reference:any):string {
    var messageStr = "The value must equal";
    if(reference instanceof Date) {
      messageStr = "The date must be";
    }
    return messageStr + " " + reference.toString() + ".";
  }
}
