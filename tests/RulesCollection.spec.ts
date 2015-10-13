/// <reference path="../typings/tsd.d.ts" />

import chai = require('chai');
var expect:any = chai.expect;

import {IRule} from "../src/lib/IRule";
import {RulesCollection} from "../src/lib/RulesCollection";

describe('RulesCollection', () => {
    it('add a rule', () => {
        var rule:IRule = {isValueValid: () => true};
        RulesCollection.addRule('foobar', rule);
        var ruleGet = RulesCollection.getRule('foobar');
        expect(ruleGet).to.equal(rule);
    });

    it('cannot add rules with the same name', () => {
        try {
            var rule:IRule = {isValueValid: () => true};
            RulesCollection.addRule('foobar', rule);
            RulesCollection.addRule('foobar', rule);
            expect(undefined).to.not.be.undefined;
        }
        catch(e) {
            expect(e).to.not.be.undefined;
        }
    });

    it('contains notUndefinedOrNan rule', () => {
        var rule = RulesCollection.getRule('notUndefinedOrNan');
        expect(rule);
    });

    it('contains required rule', () => {
        var rule = RulesCollection.getRule('required');
        expect(rule).to.not.be.undefined;
    });
});
