/// <reference path="../../typings/tsd.d.ts" />

import chai = require('chai');
var expect:any = chai.expect;

import {Rule} from "../../src/lib/Rule";
import {IArithmeticComparisonParameters} from "../../src/lib/Rules/IArithmeticComparisonParameters";
import {GreaterThan} from "../../src/lib/Rules/GreaterThan";

describe('GreaterThan', () => {
    var rule:Rule = null;

    beforeEach(() => {
        rule = new GreaterThan();
    });

    describe('isValueValid', () => {
        it("replies false when the given value is lower or equals the reference", () => {
            var curDate:Date = new Date();
            var pastDate:Date = new Date(1970, 0);
            [{value: 2, reference: 2}, {value: "bar", reference: "foo"}, {value: curDate, reference: curDate}, {value: pastDate, reference: curDate}].forEach((valueRef) => {
                var params:IArithmeticComparisonParameters = {reference: valueRef.reference};
                var valid = rule.isValueValid(valueRef.value, params);
                expect(valid).to.be.false;
            });
        });

        it("replies true when the given value is greater than the reference", () => {
            var curDate:Date = new Date();
            var pastDate:Date = new Date(1970, 0);
            [{value: 2, reference: 1}, {value: "foo", reference: "bar"}, {value: curDate, reference: pastDate}].forEach((valueRef) => {
                var params:IArithmeticComparisonParameters = {reference: valueRef.reference};
                var valid = rule.isValueValid(valueRef.value, params);
                expect(valid).to.be.true;
            });
        });

        it("replies true when values are equals and orEqual flag is set in parameters", () => {
            var curDate:Date = new Date();
            [{value: 2, reference: 2}, {value: "foo", reference: "foo"}, {value: curDate, reference: curDate}].forEach((valueRef) => {
                var params:IArithmeticComparisonParameters = {reference: valueRef.reference, orEqual: true};
                var valid = rule.isValueValid(valueRef.value, params);
                expect(valid).to.be.true;
            });
        });
    });

    describe("getErrorMessage", () => {
        it("gives a message for any value", () => {
            var params:IArithmeticComparisonParameters = {reference: 3};
            var message:string = rule.getErrorMessage(params);
            expect(message).to.equal("The value must be greater than 3.");

            params.reference = 'foo';
            message = rule.getErrorMessage(params);
            expect(message).to.equal("The value must be greater than foo.");

            params.reference = {};
            message = rule.getErrorMessage(params);
            expect(message).to.equal("The value must be greater than [object Object].");

            params.reference = {toString: () => 'bar'};
            message = rule.getErrorMessage(params);
            expect(message).to.equal("The value must be greater than bar.");

            params.orEqual = true;
            message = rule.getErrorMessage(params);
            expect(message).to.equal("The value must be greater or equal to bar.");
        });

        it("handles dates", () => {
            var date:Date = new Date(1970, 10);
            date.toString = () => {
                return  ("00" + (date.getMonth() + 1)).slice(-2) + '/' + ("00" + date.getDate()).slice(-2) + '/' + date.getFullYear();
            };
            var params:IArithmeticComparisonParameters = {reference: date};
            var message:string = rule.getErrorMessage(params);
            expect(message).to.equal("The date must be later than 11/01/1970.");

            params.orEqual = true;
            message = rule.getErrorMessage(params);
            expect(message).to.equal("The date must be later or equal to 11/01/1970.");
        });
    });
});
