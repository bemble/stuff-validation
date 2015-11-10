import {Rule} from '../Rule';
import {IArithmeticComparisonParameters} from './IArithmeticComparisonParameters';

export class LowerThan extends Rule {

    /**
     * Value is valid when lower than the reference value.
     * @param value Value to check
     * @param parameters Parameters given to the rule
     * @returns {boolean} True if valid, false otherwise
     */
    isValueValid(value:any, parameters:IArithmeticComparisonParameters):boolean {
        var ref:any = parameters.reference;
        return !parameters.orEqual ? value < ref : value <= ref;
    }

    getErrorMessage(parameters:IArithmeticComparisonParameters):string {
        var messageStr = "The value must be lower";
        if(parameters.reference instanceof Date) {
            messageStr = "The date must be earlier";
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
