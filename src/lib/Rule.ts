export abstract class Rule {
    /**
     * Check if the given value is valid.
     * @param value
     * @param params
     * @returns {boolean}
     */
    abstract isValueValid(value:any, parameters?:any): boolean;
}
