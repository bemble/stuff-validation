/// <reference path="../../typings/tsd.d.ts" />

import chai = require('chai');
var expect:any = chai.expect;

import {IRule} from "../../src/lib/IRule";
import {NotUndefinedOrNan} from "../../src/lib/Rules/NotUndefinedOrNan";

describe('NotUndefinedOrNan', () => {
    var rule:IRule = null;

    beforeEach(() => {
        rule = new NotUndefinedOrNan();
    });

    it("replies false when undefined or NaN is given", () => {
        [undefined, NaN].forEach((value) => {
            var valid = rule.isValueValid(value);
            expect(valid).to.be.false;
        });
    });

    it("replies true when 0, azerty, a not empty object is given", () => {
        [0, 'azerty', {test:'value'}, null, [], false].forEach((value) => {
            var valid = rule.isValueValid(value);
            expect(valid).to.be.true;
        });
    });
});
