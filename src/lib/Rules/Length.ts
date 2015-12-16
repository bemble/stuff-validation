import {Rule} from '../Rule';
import {ILengthParameters} from './ILengthParameters';

export class Length extends Rule {

  /**
   * Value is valid when its length is lower or equal to given value reference.
   * @param value Value to check
   * @param parameters Parameters
   * @returns {boolean} True if valid, false otherwise
   */
  isValueValid(value:any, parameters:ILengthParameters):boolean {
    var length:number = value instanceof Array ? value.length : value.toString().length;

    if(parameters.equals !== undefined && length !== parameters.equals) {
      return false;
    }
    var minLength:number = parameters.min !== undefined ? parameters.min : -Infinity;
    var maxLength:number = parameters.max !== undefined ? parameters.max : Infinity;

    return minLength <= length && length <= maxLength;
  }

  getErrorMessage(maxLength:number):string {
    return "The value length must be lower or equal to " + maxLength + ".";
  }
}
