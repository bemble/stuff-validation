/// <reference path="../typings/sv-testing.d.ts" />

import {FakeRule} from "./mock/FakeRule";
import {ValidationRule} from "../src/lib/ValidationRule";
import {RulesCollection} from "../src/lib/RulesCollection";

suite("ValidationRule", () => {
  suite("constructor", () => {
    test("throw an exception if a falsy value is given", () => {
      var falsyValues:any[] = [null, undefined, ''];

      falsyValues.forEach((falsyValue) => {
        assert.throws(() => {new ValidationRule(falsyValue);}, falsyValue);
      });
    });

    test("set its rule to the given Rule if instance of IRule", () => {
      var rule:FakeRule = new FakeRule();
      var validationRule:ValidationRule = new ValidationRule(rule);

      assert.equal(validationRule.rule, rule);
    });

    test("set its rule to the one found in the rule collection if a string is given", () => {
      var validationRule:ValidationRule = new ValidationRule('required');

      assert.equal(validationRule.rule, RulesCollection.getRule('required'));
    });
  });

  suite("getParametersValues function", () => {
    test("gives undefined if no parameters", () => {
      var rule:FakeRule = new FakeRule();
      var validationRule:ValidationRule = new ValidationRule(rule);
      var parametersValues = validationRule.getParametersValues();
      assert.isUndefined(parametersValues);
    });

    test("returns the values of the parameters", () => {
      var rule:FakeRule = new FakeRule();
      var validationRule:ValidationRule = new ValidationRule(rule, null);
      var parametersValues:any[] = [1, [1, 2], {a: 'b'}];

      parametersValues.forEach((params:any) => {
        validationRule.parameters = params;
        var parametersValues:any = validationRule.getParametersValues();
        assert.deepEqual(parametersValues, params);
      });
    });

    test('accepts function as parameters', () => {
      var tests:any[] = [
        {act: () => 'foo', exp: 'foo'},
        {act: {foo: () => 'bar'}, exp: {foo: 'bar'}},
        {act: [() => 'bar'], exp: ['bar']}
      ];

      var rule:FakeRule = new FakeRule();
      var validationRule:ValidationRule = new ValidationRule(rule, null);

      tests.forEach((params:any) => {
        validationRule.parameters = params.act;
        var parametersValues:any = validationRule.getParametersValues();
        assert.deepEqual(parametersValues, params.exp, params);
      });
    });
  });

  suite("shouldBeApplied function", () => {
    test("returns true if no applyCondition is set", () => {
      var rule:FakeRule = new FakeRule();
      var validationRule:ValidationRule = new ValidationRule(rule);

      var shouldBeApplied:boolean = validationRule.shouldBeApplied();
      assert.isTrue(shouldBeApplied);

      validationRule.applyCondition = null;
      shouldBeApplied = validationRule.shouldBeApplied();
      assert.isTrue(shouldBeApplied);
    });

    test('returns the boolean value of applyCondition', () => {
      var tests:any[] = [
        {act: true, exp: true},
        {act: 1, exp: true},
        {act: 'aze', exp: true},
        {act: () => true, exp: true},
        {act: false, exp: false},
        {act: 0, exp: false},
        {act: '', exp: false},
        {act: () => false, exp: false}
      ];
      var rule:FakeRule = new FakeRule();
      var validationRule:ValidationRule = new ValidationRule(rule);

      tests.forEach((conf:any) => {
        validationRule.applyCondition = conf.act;
        var shouldBeApplied:boolean = validationRule.shouldBeApplied();
        assert.equal(shouldBeApplied, conf.exp, conf);
      });
    });
  });

  suite("isValueValid function", () => {
    test("calls isValueValid", () => {
      var rule:FakeRule = new FakeRule();
      sinon.spy(rule, 'isValueValid');
      var validationRule:ValidationRule = new ValidationRule(rule);

      validationRule.isValueValid(null);
      sinon.assert.called(<Sinon.SinonSpy> rule.isValueValid);
    });

    test("calls isValueValid of rule with computed parameters", () => {
      var rule:FakeRule = new FakeRule();
      sinon.spy(rule, 'isValueValid');
      var validationRule:ValidationRule = new ValidationRule(rule, [1, 2, () => 'bar']);
      sinon.spy(validationRule, 'getParametersValues');

      validationRule.isValueValid(null);
      sinon.assert.called(<Sinon.SinonSpy> validationRule.getParametersValues);
      sinon.assert.calledWith(<Sinon.SinonSpy> rule.isValueValid, null, [1, 2, 'bar']);
    });

    test("does not call isValueValid of rule if shoudlBeApplied returns false", () => {
      var rule:FakeRule = new FakeRule();
      sinon.spy(rule, 'isValueValid');
      var validationRule:ValidationRule = new ValidationRule(rule, [], false);
      sinon.spy(validationRule, 'shouldBeApplied');

      validationRule.isValueValid(null);
      sinon.assert.called(<Sinon.SinonSpy> validationRule.shouldBeApplied);
      sinon.assert.notCalled(<Sinon.SinonSpy> rule.isValueValid);
    });
  });

  suite("asyncIsValueValid", () => {
    test("call isValueValid and returns a success promise if validation was successfull", (done:any) => {
      var rule:FakeRule = new FakeRule(Promise.resolve());
      sinon.spy(rule, 'isValueValid');
      var validationRule:ValidationRule = new ValidationRule(rule, [() => 'foo']);

      validationRule.asyncIsValueValid(null).then(() => {
        sinon.assert.calledWith(<Sinon.SinonSpy> rule.isValueValid, null, ['foo']);
      }).catch(() => {
        assert(false, 'The returned promise is rejected');
      }).then(done.bind(null, null), done);
    });

    test("returns an error promise with current validationRule if validation was not successfull", (done:any) => {
      var rule:FakeRule = new FakeRule(Promise.reject(true));
      var validationRule:ValidationRule = new ValidationRule(rule);

      validationRule.asyncIsValueValid(null).then(() => {
        assert(false, 'The returned promise is resolved');
      }, (reason) => {
        assert.equal(reason, validationRule);
      }).then(done.bind(null, null), done);
    });

    test("resolve directly the promise if the validation should not be applied", (done:any) => {
      var rule:FakeRule = new FakeRule();
      sinon.spy(rule, 'isValueValid');
      var validationRule:ValidationRule = new ValidationRule(rule, [], false);

      validationRule.asyncIsValueValid(null).then(() => {
        sinon.assert.notCalled(<Sinon.SinonSpy> rule.isValueValid);
      }, () => {
        assert(false, 'The returned promise is rejected');
      }).then(done.bind(null, null), done);
    });

    test("accepts other Promise library", (done:any) => {
      var bluebird = require('bluebird');

      var rule:FakeRule = new FakeRule();
      sinon.spy(rule, 'isValueValid');
      var validationRule:ValidationRule = new ValidationRule(rule, [], false);

      var ret:Promise<any> = validationRule.asyncIsValueValid(null, bluebird.Promise);
      assert.instanceOf(ret, bluebird.Promise);

      ret.then(done.bind(null, null), done);
    })
  });

  suite("getErrorMessage", () => {
    test("call rule.getErrorMessage with its parameters", () => {
      var tests:any[] = [
        {act: {foo: 'bar'}, exp: {foo: 'bar'}},
        {act: {foo: ():string => 'barafoo'}, exp: {foo: 'barafoo'}}
      ];

      tests.forEach((conf:any) => {
        var rule:FakeRule = new FakeRule();
        sinon.spy(rule, 'getErrorMessage');
        (new ValidationRule(rule, conf.act)).getErrorMessage();
        sinon.assert.calledWith(<Sinon.SinonSpy> rule.getErrorMessage, conf.exp);
      });
    });
  })
});
