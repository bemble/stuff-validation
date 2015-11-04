import {Rule} from './Rule';
import {ValidationRule} from './ValidationRule';

/**
 * Interface to give the shape of a validation configuration.
 */
export interface IValidationConfiguration {
    rules?:{[propertyName:string]: (ValidationRule|Rule|string)[]};
    asyncRules?:{[propertyName:string]: (ValidationRule|Rule|string)[]};
}
