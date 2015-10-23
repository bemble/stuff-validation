/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="IEs6PromiseLibrary.d.ts" />

import {Rule} from './Rule';
import {IValidationConfiguration} from './IValidationConfiguration';
import {RulesCollection} from './RulesCollection';
import {ValidationRule} from './ValidationRule';

export class Validator {
  private Promise:IEs6PromiseLibrary = Promise;

  /**
  * Lets you change the promise library.
  * The library used must be an ES6 promise compliant library, with at least Promise.all (which should fail-first) and constructor ES6 compliant.
  * @param  newPromiseLibrary The new Promise library you want to use
  */
  setPromiseLibrary(newPromiseLibrary:IEs6PromiseLibrary) {
    this.Promise = newPromiseLibrary;
  }

  /**
  * Validate a value according to given synchronous rules.
  * @param value Value to validate
  * @param rules Rules that the value must pass
  * @returns The first rule that fail, null if object is valid.
  */
  validateValue(value:any, rules?:(ValidationRule|Rule|string)[]):ValidationRule {
    var usedRules = rules ? rules : [];
    usedRules.unshift('definedAndNotNan');
    var isNullValid = this.isNullValid(value, usedRules);

    for(var i = 0; i< usedRules.length && !isNullValid; i++) {
      var validationRule:ValidationRule = this.getValidationRule(usedRules[i]);
      if(!validationRule.isValueValid(value)) {
        return validationRule;
      }
    }
    return null;
  }

  /**
  * Validate a value according to given asynchronous rules.
  * @param value Value to validate
  * @param rules Rules that the value must pass
  * @returns An error promise with the first rule that fail, a success promise if object is valid.
  */
  asyncValidateValue(value:any, rules?:Rule[]):Promise<ValidationRule|void> {
    var rulesPromises:Promise<ValidationRule|void>[] = rules.map((rule:Rule) => {
      var validationRule:ValidationRule = this.getValidationRule(rule);
      return <Promise<ValidationRule|void>> validationRule.asyncIsValueValid(value, this.Promise);
    });
    return <Promise<any>> this.Promise.all(rulesPromises);
  }

  private isNullValid(value:any, rules?:(ValidationRule|Rule|string)[]):boolean {
    if(value !== null) {
      return false;
    }

    return !rules.some((rule:ValidationRule|Rule|string) => {
      var validationRule:ValidationRule = this.getValidationRule(rule);
      return validationRule.rule === RulesCollection.getRule('required');
    });
  }

  private getValidationRule(rawRule:ValidationRule|Rule|string):ValidationRule {
    return rawRule instanceof ValidationRule ? rawRule : new ValidationRule(rawRule);
  }

  /**
  * Check if the value fulfills all the validation rules.
  * @param value Value to check
  * @param rules Rules that the value must pass
  * @returns {boolean} True if the value is valid, false otherwise.
  * TODO: async
  */
  isValueValid(value:any, rules?:(ValidationRule|Rule|string)[]):boolean {
    return this.validateValue(value, rules) === null;
  }

  /**
  * Check if the object fulfills all the validation rules set in validation or in it.
  * Validation configuration, if set in the object to validate, must be a property named "validationConfiguration".
  * @param objectToValidate Object to check
  * @param validationConfig Configuration of the validation
  * @returns True if object is valid, false otherwise.
  * TODO: async
  */
  isObjectValid(objectToValidate:any, validationConfig?:IValidationConfiguration):boolean {
    var config:IValidationConfiguration = this.getValidationConfiguration(objectToValidate, validationConfig)
    if (config && config.rules) {
      var validatedProperties = Object.keys(config.rules);
      if (this.hasInvalidProperty(validatedProperties, objectToValidate, config.rules)) {
        return false;
      }
    }
    return this.applyValidationOnObjectProperties('isObjectValid', objectToValidate);
  }

  /**
  * Check if the group properties fulfills their validation rules.
  * Stops at first fail.
  * Validation groups property name must be "validationGroups".
  * @param objectToValidate Object to check
  * @param groupName Name of the group
  * @param validationConfig Configuration of the validation
  * @returns True if object is valid, false otherwise.
  * TODO: async
  */
  isGroupValid(objectToValidate:any, groupName:string, validationConfig?:IValidationConfiguration):boolean {
    var config:IValidationConfiguration = this.getValidationConfiguration(objectToValidate, validationConfig)
    if (config.groups && config.groups[groupName] &&  config.rules) {
      var validatedProperties = config.groups[groupName];
      if (this.hasInvalidProperty(validatedProperties, objectToValidate, config.rules)) {
        return false;
      }
    }
    return this.applyValidationOnObjectProperties('isGroupValid', objectToValidate, [groupName]);
  }

  private getValidationConfiguration(objectToValidate:any, validationConfig?:IValidationConfiguration):IValidationConfiguration {
    return validationConfig || (typeof objectToValidate === "object" && objectToValidate.validationConfiguration);
  }

  private applyValidationOnObjectProperties(functionName:string, object:any, params?:any[]):boolean {
    var objectProperties:string[] = this.getObjectProperties(object);
    return objectProperties.length === 0 || !objectProperties.some((propertyName:string):boolean => {
      var property:any = object[propertyName];
      var callArgs:any[] = [property].concat(params);
      return !(<any> this)[functionName].apply(this, callArgs);
    });
  }

  private getObjectProperties(object:any):string[] {
    var objectProperties = Object.keys(object);
    return objectProperties.filter((propertyName) => {
      if (propertyName !== 'validationConfiguration') {
        var property = object[propertyName];
        return typeof property === 'object' && property !== null;
      }
      return false;
    });
  }

  private hasInvalidProperty(propertiesName:string[], objectToValidate:any, rules:{[propertyName:string]: (ValidationRule|Rule|string)[]}):boolean {
    return propertiesName.some((propertyName:string) => {
      if (!rules[propertyName]) {
        return false;
      }
      var value:any = (<any> objectToValidate)[propertyName];
      return !this.isValueValid(value, rules[propertyName]);
    });
  }
}
