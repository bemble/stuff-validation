/**
 * Interface to give the shape of a validation rule.
 */
export interface IRule {
    /**
     * Check if the given value is valid.
     * @param value
     * @param params
     * @returns {boolean}
     */
    isValueValid(value:any, parameters?:any): boolean;
}