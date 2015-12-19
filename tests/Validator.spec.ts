/// <reference path="../typings/sv-testing.d.ts" />

import {FakeRule} from "./mock/FakeRule";
import {DefinedAndNotNan} from "../src/lib/Rules/DefinedAndNotNan";
import {ValidationRule} from "../src/lib/ValidationRule";
import {Validator} from "../src/lib/Validator";
import {RulesCollection} from "../src/lib/RulesCollection";
import {IValidationConfiguration} from "../src/lib/IValidationConfiguration";

suite('Validator', () => {
  var validator:Validator = null;

  setup(() => {
    validator = new Validator();
    RulesCollection.reset();
  });

  suite('isValueValid function', () => {
    test('calls isValueValid of the given validationRule rule when calling', () => {
      var rule:FakeRule = new FakeRule();
      sinon.spy(rule, 'isValueValid');
      var validationRule:ValidationRule = new ValidationRule(rule);

      validator.validateValue(123, [validationRule]);
      sinon.assert.called(<Sinon.SinonSpy> rule.isValueValid);
    });

    test('can create validationRules with the given rule', () => {
      var rule:FakeRule = new FakeRule();
      sinon.spy(rule, 'isValueValid');
      validator.validateValue(123, [rule]);
      sinon.assert.called(<Sinon.SinonSpy> rule.isValueValid);
    });

    test('can create rules object by their name', () => {
      var rule:FakeRule = new FakeRule();
      var ruleStub = sinon.stub(rule, 'isValueValid').returns(false);
      RulesCollection.addRule('fakeRule', rule);

      var invalidRule = validator.isValueValid(123, ['fakeRule']);
      assert.equal(invalidRule.rule, rule);

      ruleStub.returns(true);
      invalidRule = validator.isValueValid(123, ['fakeRule']);
      assert.isNull(invalidRule);
    });

    test('always add notUndefinedOrEmpty rule', () => {
      var invalidRule = validator.isValueValid(undefined);
      assert.instanceOf(invalidRule.rule, DefinedAndNotNan);
    });

    test('validates multiple rules', () => {
      var rule:FakeRule = new FakeRule();
      var rule2:FakeRule = new FakeRule();
      sinon.spy(rule, 'isValueValid');
      sinon.spy(rule2, 'isValueValid');

      validator.isValueValid(123, [rule, rule2]);
      sinon.assert.called(<Sinon.SinonSpy> rule.isValueValid);
      sinon.assert.called(<Sinon.SinonSpy> rule2.isValueValid);
    });

    test('gives the first rules where isValueValid failed', () => {
      var rule1:FakeRule = new FakeRule();
      var rule2:FakeRule = new FakeRule();
      var rule3:FakeRule = new FakeRule();
      var rule1Stub = sinon.stub(rule1, 'isValueValid').returns(true);
      sinon.spy(rule2, 'isValueValid');
      var rule3Stub = sinon.stub(rule3, 'isValueValid').returns(true);

      var failedRule = validator.isValueValid(123, [rule1, rule2, rule3]);
      assert.isNull(failedRule);

      rule1Stub.returns(false).reset();
      rule3Stub.returns(false).reset();

      failedRule = validator.isValueValid(123, [rule1, rule2, rule3]);
      assert.equal(failedRule.rule, rule1);
      sinon.assert.calledOnce(<Sinon.SinonSpy> rule2.isValueValid);
    });

    test('returns true if null is given and required is not set', () => {
      var rule:FakeRule = new FakeRule();
      sinon.stub(rule, 'isValueValid', () => false);

      var failedRule = validator.isValueValid(null, [rule]);
      assert.isNull(failedRule);
      sinon.assert.notCalled(<Sinon.SinonSpy> rule.isValueValid);
    });
  });

  suite('isValueAsyncValid function', () => {
    test('returns a promise', () => {
      var ret:any = validator.isValueAsyncValid(null, []);
      assert.isDefined(ret.then);
    });

    test('returns a resovled promise if called without rules', (done:any) => {
      var ret:any = validator.isValueAsyncValid(null);
      ret.then(() => {
      },() => {
        assert(false, 'The returned promise is rejected');
      }).then(done.bind(null, null), done);
    });

    test('returns a resolved promise if all rules are resolved', (done:any) => {
      var rule1:FakeRule = new FakeRule(Promise.resolve());
      var rule2:FakeRule = new FakeRule(Promise.resolve());

      var ret:any = validator.isValueAsyncValid(null, [rule1, rule2]);
      ret.then(() => {
      },() => {
        assert(false, 'The returned promise is rejected');
      }).then(done.bind(null, null), done);
    });

    test('returns a rejected promise with only one failing rule if a rule is rejected', (done:any) => {
      var rule1:FakeRule = new FakeRule(Promise.reject(null));
      var rule2:FakeRule = new FakeRule(Promise.reject(null));

      var ret:any = validator.isValueAsyncValid(null, [rule1, rule2]);
      ret.then(() => {
        assert(false, 'The returned promise is resolved');
      },(reason:any) => {
        assert.isDefined(reason);
        assert.instanceOf(reason, ValidationRule);
      }).then(done.bind(null, null), done);
    });
  });

  suite('setPromiseLibrary', () => {
    var bluebird:any;
    setup(() => {
      bluebird = require('bluebird');
    });

    test('can set another promise library', (done:any) => {
      validator.setPromiseLibrary(bluebird.Promise);
      sinon.spy(bluebird.Promise, 'all');

      var rule:FakeRule = new FakeRule(Promise.resolve(null));
      var validationRule:ValidationRule = new ValidationRule(rule);
      sinon.spy(validationRule, 'asyncIsValueValid');

      validator.isValueAsyncValid(null, [validationRule]).then(() => {
        sinon.assert.called(<Sinon.SinonSpy> bluebird.Promise.all);
        sinon.assert.calledWith(<Sinon.SinonSpy> validationRule.asyncIsValueValid, null, bluebird.Promise);
      }).then(done.bind(null, null), done);
    });
  });

  suite('validateValue function', () => {
    suite('synchronous validation', () => {
      test('calls validateValue', (done:any) => {
        var rule:FakeRule = new FakeRule();

        sinon.spy(validator, 'isValueValid');
        validator.validateValue(undefined, [rule]).then(() => {
          sinon.assert.calledWith(<Sinon.SinonSpy> validator.isValueValid, undefined, ['definedAndNotNan', rule]);
        }).then(done.bind(null, null), done);
      });

      test('returns resolved promise when value satisfy every rule', (done:any) => {
        var rule:FakeRule = new FakeRule();
        var rule2:FakeRule = new FakeRule();
        var rule3:FakeRule = new FakeRule();

        validator.validateValue(123, [rule, rule2, rule3]).then(() => {
        }, () => {
          assert(false, 'The returned promise is rejected');
        }).then(done.bind(null, null), done);
      });

      test('returns a rejected promise when value unsatisfy a rule', (done:any) => {
        var rule:FakeRule = new FakeRule();
        var rule2:FakeRule = new FakeRule(false);
        var rule3:FakeRule = new FakeRule();

        validator.validateValue(123, [rule, rule2, rule3]).then(() => {
          assert(false, 'The returned promise is resolved');
        }, () => {
        }).then(done.bind(null, null), done);
      });
    });

    suite('async validation', () => {
      test('calls asyncValidateValue', (done:any) => {
        var rule:FakeRule = new FakeRule();
        var asyncRule:FakeRule = new FakeRule(Promise.resolve(null));

        sinon.spy(validator, 'isValueAsyncValid');
        validator.validateValue(123, [rule], [asyncRule]).then(() => {
          sinon.assert.calledWith(<Sinon.SinonSpy> validator.isValueAsyncValid, 123, [asyncRule]);
        }).then(done.bind(null, null), done);
      });

      test('returns a rejected promise if async validation was unsuccessfull', (done:any) => {
        var rule:FakeRule = new FakeRule();
        var asyncRule:FakeRule = new FakeRule(Promise.reject(null));

        validator.validateValue(123, [rule], [asyncRule]).then(() => {
          assert(false, 'The promise returned is resolved');
        },() => {
        }).then(done.bind(null, null), done);
      });
    });
  });

  suite('validateObject function', () => {
    test('returns a resolved promise if no validationRules on the validated object', (done:any) => {
      var validatedObject:any = {
        value1: ''
      };
      validator.validateObject(validatedObject, <IValidationConfiguration>{}).then(() => {
      }, () => {
        assert(false, 'The promise returned is rejected');
      }).then(done.bind(null, null), done);
    });

    test('relies on validateValue', (done) => {
      var validatedObject:any = {
        value1: '',
      };
      var validationConfiguration:IValidationConfiguration = {
        rules: {
          value1: [new FakeRule()]
        }
      };
      sinon.spy(validator, 'validateValue');
      validator.validateObject(validatedObject, validationConfiguration).then(() => {
        sinon.assert.called(<Sinon.SinonSpy> validator.validateValue);
      }).then(done.bind(null, null), done);
    });

    test('calls validation once per property', (done) => {
      var validatedObject:any = {
        value1: '',
      };
      var validationConfiguration:IValidationConfiguration = {
        rules: {
          value1: [new FakeRule()]
        },
        asyncRules: {
          value1: [new FakeRule(Promise.resolve())]
        }
      };
      sinon.spy(validator, 'validateValue');
      validator.validateObject(validatedObject, validationConfiguration).then(() => {
        sinon.assert.calledOnce(<Sinon.SinonSpy> validator.validateValue);
      }).then(done.bind(null, null), done);
    });

    test('returns a rejected promise if one of the validated object properties is not a valid value', (done:any) => {
      var rule:FakeRule = new FakeRule(false);

      var validatedObject:any = {
        value1: ''
      };
      var validationConfiguration:IValidationConfiguration = {
        rules: {
          value1: [rule]
        }
      };
      validator.validateObject(validatedObject, validationConfiguration).then(() => {
        assert(false, 'The promise returned is resolved');
      }, () => {
      }).then(done.bind(null, null), done);
    });

    test('validates objects recursively', (done:any) => {
      var rule:FakeRule = new FakeRule(false);

      var validationConfiguration:IValidationConfiguration = {
        rules: {
          value3: [rule]
        }
      };

      var validatedObject:any = {
        value1: '',
        value2: {
          value3: '',
          validationConfiguration: validationConfiguration
        }
      };
      validator.validateObject(validatedObject).then(() => {
        assert(false, 'The promise returned is resolved');
      }, () => {
      }).then(done.bind(null, null), done);
    });

    test('validates arrays recursively', (done) => {
      var rule:FakeRule = new FakeRule(false);

      var validationConfiguration:IValidationConfiguration = {
        rules: {
          value3: [rule]
        }
      };

      var validatedObject:any = {
        value1: '',
        value2: [{
          value3: '',
          validationConfiguration: validationConfiguration
        }]
      };
      validator.validateObject(validatedObject).then(() => {
        assert(false, 'The promise returned is resolved');
      }, () => {
      }).then(done.bind(null, null), done);
    });
  });
});