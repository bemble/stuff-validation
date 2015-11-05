/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />

export abstract class Rule {
  /**
   * Check if the given value is valid.
   * @param value Value to check.
   * @param parameters Parameters given to the rule.
   * @returns A promise if the rule is async (rejected or resolved depending of the validaty of the value), a boolean otherwise.
   */
  abstract isValueValid(value:any, parameters?:any):Promise<any>|boolean;

  /**
   * Get the human readable error message of the rule.
   * @param paremeters parameters when isValueValid was called
   * @returns The error message associated to the rule
   */
  abstract getErrorMessage(paremeters?:any):string;
}
