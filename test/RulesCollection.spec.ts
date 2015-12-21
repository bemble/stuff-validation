/// <reference path="../typings/sv-testing.d.ts" />

import {FakeRule} from "./mock/FakeRule";

import {Rule} from "../src/lib/Rule";
import {RulesCollection} from "../src/lib/RulesCollection"; 

suite('RulesCollection', () => {
  setup(() => {
    RulesCollection.reset();
  });

  test('add a rule', () => {
    var rule:Rule = new FakeRule(true);
    RulesCollection.addRule('foobar', rule);
    var ruleGet = RulesCollection.getRule('foobar');
    assert.equal(ruleGet, rule);
  });

  test("reset the collection", () => {
    var rule:Rule = new FakeRule(true);
    RulesCollection.addRule('foobar', rule);
    RulesCollection.reset();
    var ruleGet = RulesCollection.getRule('foobar');
    assert.isUndefined(ruleGet);
  });

  test('cannot add rules with the same name', () => {
    var rule:Rule = new FakeRule(true);
    RulesCollection.addRule('foobar', rule);
    assert.throws(() => { RulesCollection.addRule('foobar', rule)});
  });

  test('can set a rule', () => {
    var rule:Rule = new FakeRule();
    RulesCollection.setRule('required', rule);
    var requiredRule = RulesCollection.getRule('required');
    assert.equal(requiredRule, rule);
  });

  test('registred rules', () => {
    var rulesName:string[] = [
      'definedAndNotNan',
      'required',
      'equals',
      'greaterThan',
      'lowerThan',
      'is',
      'pattern',
      'length',
      'range'
    ];

    rulesName.forEach((ruleName:string) => {
      var rule:Rule = RulesCollection.getRule(ruleName);
      assert.isDefined(rule, ruleName);
    });
  });
});
