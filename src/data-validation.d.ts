declare module dataValidation {
  interface Rule {
    isValueValid(value: any, parameters?: any): boolean;
  }

  interface RulesCollection {
  }

  interface IValidationConfiguration {
    groups?: {
      [name: string]: string[];
    };
    rules?: {
      [propertyName: string]: (ValidationRule | Rule | string)[];
    };
  }

  interface ValidationRule {
    parameters: any[] | any;
    applyCondition: any;
    rule: Rule;
    shouldBeApplied(): boolean;
    getParametersValues(): any[] | any;
    isValueValid(value: any): boolean;
  }

  interface Validator {
    setPromiseLibrary(newPromiseLibrary: any);
    validateValue(value: any, rules?: (ValidationRule | Rule | string)[]): ValidationRule;
    isValueValid(value: any, rules?: (ValidationRule | Rule | string)[]): boolean;
    isObjectValid(objectToValidate: any, validationConfig?: IValidationConfiguration): boolean;
    isGroupValid(objectToValidate: any, groupName: string, validationConfig?: IValidationConfiguration): boolean;
  }

  interface DataValidationModule {
    Rule: {
      prototype: Rule;
    };
    Validator: {
      new (): Validator;
      prototype: Validator;
    };
    ValidationRule: {
      new (rawRule: Rule | string, parameters?: any[] | any, applyCondition?: any): ValidationRule;
      prototype: ValidationRule;
    };
    RulesCollection: {
      reset(): void;
      addRule(ruleName: string, rule: Rule): void;
      getRule(ruleName: string): Rule;
    };
    IValidationConfiguration:{
      prototype: IValidationConfiguration;
    }
  }
}
