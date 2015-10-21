import {Rule} from './Rule';
import {IValidationConfiguration} from './IValidationConfiguration';
import {RulesCollection} from './RulesCollection';
import {ValidationRule} from './ValidationRule';

export class Validator {
  /**
  * Validate a value according to given rules.
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
