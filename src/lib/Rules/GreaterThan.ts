import {Rule} from '../Rule';
import {IArithmeticComparisonParameters} from './../RuleParameters/IArithmeticComparisonParameters';

export class GreaterThan extends Rule {
    /**
     * Value is valid when greater than the reference value.
     * @param value Value to check
     * @param parameters Value taken as reference in comparison
     * @returns {boolean} True if valid, false otherwise
     */
    isValueValid(value:any, parameters:IArithmeticComparisonParameters):boolean {
        var ref:any = parameters.reference;
        return !parameters.orEqual ? value > ref : value >= ref;
    }

    getErrorMessage(parameters:IArithmeticComparisonParameters):string {
        var messageStr = "The value must be greater";
        if(parameters.reference instanceof Date) {
            messageStr = "The date must be later";
        }

        if(!parameters.orEqual) {
            messageStr += " than ";
        }
        else {
            messageStr += " or equal to "
        }
        return messageStr + parameters.reference.toString() + ".";
    }
}
