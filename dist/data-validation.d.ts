declare module dataValidation {
  interface Rule {
    isValueValid(value:any, parameters?:any): boolean;
    getErrorMessage(parameters?:any): string;
  }

  interface RulesCollection {
  }

  interface IValidationConfiguration {
    rules?: {
      [propertyName: string]: (ValidationRule | Rule | string)[];
    };
  }

  interface ValidationRule {
    parameters: any[] | any;
    applyCondition: any;
    rule: Rule;
    shouldBeApplied():boolean;
    getParametersValues(): any[] | any;
    isValueValid(value:any): boolean;
    getErrorMessage():string;
  }

  interface Validator {
    setPromiseLibrary(newPromiseLibrary:any): void;
    isValueValid(value:any, rules?:(ValidationRule | Rule | string)[]): ValidationRule;
    isValueAsyncValid(value:any, rules?:(ValidationRule|Rule|string)[]): Promise<ValidationRule|void>;
    validateValue(value:any, rules?:(ValidationRule | Rule | string)[]): Promise<any>;
    valiateObject(objectToValidate:any, validationConfig?:IValidationConfiguration): Promise<any>;
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
      new (rawRule:Rule | string, parameters?:any[] | any, applyCondition?:Function|any): ValidationRule;
      prototype: ValidationRule;
    };
    RulesCollection: {
      reset(): void;
      addRule(ruleName:string, rule:Rule): void;
      setRule(ruleName:string, rule:Rule): void;
      getRule(ruleName:string): Rule;
    };
    IValidationConfiguration:{
      prototype: IValidationConfiguration;
    }
  }
}
