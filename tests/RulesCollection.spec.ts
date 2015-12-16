/// <reference path="../typings/tsd.d.ts" />

import chai = require('chai');
import {FakeRule} from "./mock/FakeRule";
var expect:any = chai.expect;

import {Rule} from "../src/lib/Rule";
import {RulesCollection} from "../src/lib/RulesCollection"; 

describe('RulesCollection', () => {
  beforeEach(() => {
    RulesCollection.reset();
  });

  it('add a rule', () => {
    var rule:Rule = new FakeRule(true);
    RulesCollection.addRule('foobar', rule);
    var ruleGet = RulesCollection.getRule('foobar');
    expect(ruleGet).to.equal(rule);
  });

  it("reset the collection", () => {
    var rule:Rule = new FakeRule(true);
    RulesCollection.addRule('foobar', rule);
    RulesCollection.reset();
    var ruleGet = RulesCollection.getRule('foobar');
    expect(ruleGet).to.be.undefined;
  });

  it('cannot add rules with the same name', () => {
    try {
      var rule:Rule = new FakeRule(true);
      RulesCollection.addRule('foobar', rule);
      RulesCollection.addRule('foobar', rule);
      expect(undefined).to.not.be.undefined;
    }
    catch(e) {
      expect(e).to.not.be.undefined;
    }
  });

  it('can set a rule', () => {
    var rule:Rule = new FakeRule();
    RulesCollection.setRule('required', rule);
    var requiredRule = RulesCollection.getRule('required');
    expect(requiredRule).to.equal(rule);
  });

  describe('registred rules', () => {
    function itRule(ruleName:string) {
      it('contains ' + ruleName + ' rule', () => {
        var rule:Rule = RulesCollection.getRule(ruleName);
        expect(rule).to.not.be.undefined;
      });
    }

    ['definedAndNotNan', 'required', 'equals', 'greaterThan', 'lowerThan', 'is', 'pattern'].forEach(function(ruleName) {
      itRule(ruleName);
    });
  });
});
