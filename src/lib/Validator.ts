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

    for(var i = 0; i < usedRules.length && !isNullValid; i++) {
      var validationRule:ValidationRule = Validator.getValidationRule(usedRules[i]);
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
  * @returns Resolved promise if the value is valid, rejected promise with the first failed rule otherwise.
  */
  asyncValidateValue(value:any, rules?:(ValidationRule|Rule|string)[]):Promise<ValidationRule|void> {
    var usedRules = rules ? rules : [];
    var promises:Promise<ValidationRule|void>[] = usedRules.map((rule:Rule) => {
      var validationRule:ValidationRule = Validator.getValidationRule(rule);
      return <Promise<ValidationRule|void>> validationRule.asyncIsValueValid(value, this.Promise);
    });
    return <Promise<any>> this.Promise.all(promises);
  }

  /**
  * Check if the value fulfills all the validation rules.
  * @param value Value to check
  * @param rules Rules that the value must pass
  * @param asyncRules Asynchronous rules that the value must pass
  * @returns Resolved promise if the value is valid, rejected promise otherwise.
  */
  isValueValid(value:any, rules?:(ValidationRule|Rule|string)[], asyncRules?:(ValidationRule|Rule|string)[]):Promise<any> {
    var syncPromise:Promise<any> = new this.Promise((resolve:Function, reject:Function) => {
      (this.validateValue(value, rules) === null) ? resolve() : reject();
    });
    var asyncPromise:Promise<any> = this.asyncValidateValue(value, asyncRules);
    return this.Promise.all([syncPromise, asyncPromise]);
  }

  /**
  * Check if the object fulfills all the validation rules set in validation or in it.
  * Validation configuration, if set in the object to validate, must be a property named "validationConfiguration".
  * @param objectToValidate Object to check
  * @param validationConfig Configuration of the validation
  * @returns Resolved promise if the object is valid, rejected promise otherwise.
  */
  isObjectValid(objectToValidate:any, validationConfig?:IValidationConfiguration):Promise<any> {
    var promises:Promise<any>[] = this.getObjectValidationPromise(objectToValidate, validationConfig).concat(this.getSubObjectsValidationPromises(objectToValidate));
    return this.Promise.all(promises);
  }

  private isNullValid(value:any, rules?:(ValidationRule|Rule|string)[]):boolean {
    if(value !== null) {
      return false;
    }

    return !rules.some((rule:ValidationRule|Rule|string) => {
      var validationRule:ValidationRule = Validator.getValidationRule(rule);
      return validationRule.rule === RulesCollection.getRule('required');
    });
  }

  private static getValidationRule(rawRule:ValidationRule|Rule|string):ValidationRule {
    return rawRule instanceof ValidationRule ? rawRule : new ValidationRule(rawRule);
  }

  private getObjectValidationPromise(objectToValidate:any, validationConfig?:IValidationConfiguration):Promise<any>[] {
    var config:IValidationConfiguration = Validator.getValidationConfiguration(objectToValidate, validationConfig) || {};
    var propertiesWithValidation:string[] = (<Array<string>>(config.rules ? Object.keys(config.rules) : [])).concat(config.asyncRules ? Object.keys(config.asyncRules) : []);

    // Delete doubles
    propertiesWithValidation = propertiesWithValidation.filter((value, index, currentArray) => {
      return currentArray.indexOf(value) === index;
    });
    return this.getPropertiesValidationPromise(propertiesWithValidation, objectToValidate, config);
  }

  private getSubObjectsValidationPromises(objectToValidate:any):Promise<any>[] {
    return this.getObjectProperties(objectToValidate).map((propertyName:string) => {
      return this.isObjectValid(objectToValidate[propertyName]);
    });
  }

  private getPropertiesValidationPromise(propertiesName:string[], objectToValidate:any, config?:IValidationConfiguration):Promise<any>[] {
    return propertiesName.map((propertyName) => {
      var rules = config && config.rules && config.rules[propertyName];
      var asyncRules = config && config.asyncRules && config.asyncRules[propertyName];
      return this.isValueValid(objectToValidate[propertyName], rules, asyncRules);
    });
  }

  private static getValidationConfiguration(objectToValidate:any, validationConfig?:IValidationConfiguration):IValidationConfiguration {
    return validationConfig || (typeof objectToValidate === "object" && objectToValidate.validationConfiguration);
  }

  private getObjectProperties(object:any):string[] {
    var objectProperties = Object.keys(object);
    return objectProperties.filter((propertyName:string) => {
      var property = object[propertyName];
      return propertyName !== 'validationConfiguration' && typeof property === 'object' && property !== null;
    });
  }
}
