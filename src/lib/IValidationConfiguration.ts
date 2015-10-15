import {Rule} from './Rule';
import {ValidationRule} from './ValidationRule';

/**
 * Interface to give the shape of a validation configuration.
 */
export interface IValidationConfiguration {
    groups?:{[name:string]: string[]};
    rules?:{[propertyName:string]: (ValidationRule|Rule|string)[]};
}
