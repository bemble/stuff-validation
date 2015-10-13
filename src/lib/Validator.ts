import {IRule} from './IRule';
import {IValidatableObject} from './IValidatableObject';
import {RulesCollection} from './RulesCollection';

export class Validator {
    /**
     * Validate a value according to given rules.
     * @param value Value to validate
     * @param rules Rules that the value must pass
     * @returns {IRule} The first rule that fail, null if object is valid.
     */
    validateValue(value:any, rules?:any):IRule {
        var validationRules = this.getValidationRules(rules);
        var isNullValid = this.isNullValid(value, validationRules);

        for(var i = 0; i< validationRules.length && !isNullValid; i++) {
            var validatorRule:any = this.getRule(validationRules[i]);
            if(validatorRule.onlyIf && validatorRule.rule.isValueValid(value, validatorRule.parameters) === false) {
                return validatorRule.rule;
            }
        }
        return null;
    }

    private isNullValid(value:any, validationRules:any[]):boolean {
        if(value !== null) {
            return false;
        }
        return !validationRules.some((rule) => {
            var validatorRule:any = this.getRule(rule);
            return validatorRule.rule === RulesCollection.getRule('required');
        });
    }

    private getValidationRules(rawRules:any[]):any[] {
        var rules = rawRules instanceof Array ? rawRules : [];
        if(rawRules && rules.length === 0) {
            rules.push(rawRules);
        }
        rules.unshift('notUndefinedOrNan');
        return rules;
    }

    private getRule(rawRule:any):any {
        var rule:any = null;
        if(typeof rawRule === 'object' && rawRule.rule) {
            rule = rawRule.rule;
        }
        else {
            rule = this.getRuleObject(rawRule);
        }

        return {
            rule: rule,
            parameters: this.getRuleParameters(rawRule),
            onlyIf: this.getRuleOnlyIf(rawRule)
        };
    }

    private getRuleObject(rawRule:any):IRule {
        if(rawRule.isValueValid) {
            return rawRule;
        }

        var ruleName:any = null
        if(typeof rawRule === 'string') {
            ruleName = rawRule;
        }
        else if(typeof rawRule === 'object') {
            ruleName = rawRule.name ? rawRule.name : null;
        }
        return RulesCollection.getRule(ruleName);
    }

    private getRuleParameters(rawRule:any):any {
        if(typeof rawRule === 'object' && rawRule.parameters !== undefined) {
            if(typeof rawRule.parameters === 'object') {
                var parameters:any = rawRule.parameters instanceof Array ? [] : {};
                Object.keys(rawRule.parameters).forEach((parameterName) => {
                    parameters[parameterName] = this.getValue(rawRule.parameters[parameterName]);
                });
                return parameters;
            }
            return this.getValue(rawRule.parameters);
        }
    }

    private getRuleOnlyIf(rawRule:any):boolean {
        if(typeof rawRule === 'object' && rawRule.onlyIf !== undefined) {
            return this.getValue(rawRule.onlyIf);
        }
        return true;
    }

    private getValue(rawValue:any):any {
        if(typeof rawValue === 'function') {
            return rawValue();
        }
        return rawValue;
    }

    /**
     * Check if the value fulfills all the validation rules.
     * @param value Value to check
     * @param rules Rules that the value must pass
     * @returns {boolean} True if the value is valid, false otherwise.
     */
    isValueValid(value:any, rules?:any):boolean {
        return this.validateValue(value, rules) === null;
    }

    /**
     * Check if the object fulfills all the validation rules set in it.
     * Validation rules property name must be "validationRules".
     * @param objectToValidate Object to check
     * @returns {boolean} True if object is valid, false otherwise.
     */
    isObjectValid(objectToValidate:IValidatableObject):boolean {
        if (objectToValidate.validationRules) {
            var validatedProperties = Object.keys(objectToValidate.validationRules);
            if (this.hasInvalidProperty(validatedProperties, objectToValidate)) {
                return false;
            }
        }
        return this.isValidOnObjectProperties('isObjectValid', objectToValidate);
    }

    /**
     * Check if the group properties fulfills their validation rules.
     * Stops at first fail.
     * Validation groups property name must be "validationGroups".
     * @param objectToValidate
     * @param groupName
     * @returns {boolean}
     */
    isGroupValid(objectToValidate:IValidatableObject, groupName:string):boolean {
        if (objectToValidate.validationGroups && objectToValidate.validationGroups[groupName] && objectToValidate.validationRules) {
            var validatedProperties = objectToValidate.validationGroups[groupName];
            if (this.hasInvalidProperty(validatedProperties, objectToValidate)) {
                return false;
            }
        }
        return this.isValidOnObjectProperties('isGroupValid', objectToValidate, [groupName]);
    }

    private isValidOnObjectProperties(functionName:string, object:any, params?:any[]):boolean {
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
            if (!(propertyName == 'validationRules' || propertyName === 'validationGroups')) {
                var property = object[propertyName];
                return typeof property === 'object' && property !== null;
            }
            return false;
        });
    }

    private hasInvalidProperty(propertiesName:string[], objectToValidate:IValidatableObject):boolean {
        return propertiesName.some((propertyName:string) => {
            if (!objectToValidate.validationRules[propertyName]) {
                return false;
            }
            var value:any = (<any> objectToValidate)[propertyName];
            var rules:any = objectToValidate.validationRules[propertyName];
            return !this.isValueValid(value, rules);
        });
    }
}
