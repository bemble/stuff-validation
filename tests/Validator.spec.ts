/// <reference path="../typings/tsd.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

import {FakeRule} from "./mock/FakeRule";
import {DefinedAndNotNan} from "../src/lib/Rules/DefinedAndNotNan";
import {ValidationRule} from "../src/lib/ValidationRule";
import {Validator} from "../src/lib/Validator";
import {RulesCollection} from "../src/lib/RulesCollection";
import {IValidationConfiguration} from "../src/lib/IValidationConfiguration";

describe('Validator', () => {
  var validator:Validator = null;

  beforeEach(() => {
    validator = new Validator();
    RulesCollection.reset();
  });

  describe('validateValue function', () => {
    it('calls isValueValid of the given validationRule rule when calling', () => {
      var rule:FakeRule = new FakeRule();
      sinon.spy(rule, 'isValueValid');
      var validationRule:ValidationRule = new ValidationRule(rule);

      validator.validateValue(123, [validationRule]);
      expect(rule.isValueValid).to.have.been.called;
    });

    it('can create validationRules with the given rule', () => {
      var rule:FakeRule = new FakeRule();
      sinon.spy(rule, 'isValueValid');
      validator.validateValue(123, [rule]);
      expect(rule.isValueValid).to.have.been.called;
    });

    it('can create rules object by their name', () => {
      var rule:FakeRule = new FakeRule();
      var ruleStub = sinon.stub(rule, 'isValueValid').returns(false);
      RulesCollection.addRule('fakeRule', rule);

      var invalidRule = validator.validateValue(123, ['fakeRule']);
      expect(invalidRule.rule).to.equal(rule);

      ruleStub.returns(true);
      invalidRule = validator.validateValue(123, ['fakeRule']);
      expect(invalidRule).to.be.null;
    });

    it('always add notUndefinedOrEmpty rule', () => {
      var invalidRule = validator.validateValue(undefined);
      expect(invalidRule.rule instanceof DefinedAndNotNan).to.be.true;
    });

    it('validates multiple rules', () => {
      var rule:FakeRule = new FakeRule();
      var rule2:FakeRule = new FakeRule();
      sinon.spy(rule, 'isValueValid');
      sinon.spy(rule2, 'isValueValid');

      validator.validateValue(123, [rule, rule2]);
      expect(rule.isValueValid).to.have.been.called;
      expect(rule2.isValueValid).to.have.been.called;
    });

    it('gives the first rules where isValueValid failed', () => {
      var rule1:FakeRule = new FakeRule();
      var rule2:FakeRule = new FakeRule();
      var rule3:FakeRule = new FakeRule();
      var rule1Stub = sinon.stub(rule1, 'isValueValid').returns(true);
      sinon.spy(rule2, 'isValueValid');
      var rule3Stub = sinon.stub(rule3, 'isValueValid').returns(true);

      var failedRule = validator.validateValue(123, [rule1, rule2, rule3]);
      expect(failedRule).to.be.null;

      rule1Stub.returns(false).reset();
      rule3Stub.returns(false).reset();

      failedRule = validator.validateValue(123, [rule1, rule2, rule3]);
      expect(failedRule.rule).to.equal(rule1);
      expect(rule2.isValueValid).to.calledOnce;
    });

    it('returns true if null is given and required is not set', () => {
      var rule:FakeRule = new FakeRule();
      sinon.stub(rule, 'isValueValid', () => false);

      var failedRule = validator.validateValue(null, [rule]);
      expect(failedRule).to.be.null;
      expect(rule.isValueValid).to.not.have.been.called;
    });
  });

  describe('asyncValidateValue function', () => {
    it('returns a promise', () => {
      var ret:any = validator.asyncValidateValue(null, []);
      expect(ret.then).to.not.be.undefined;
    });

    it('returns a resovled promise if called without rules', (done:any) => {
      var ret:any = validator.asyncValidateValue(null);
      ret.then(() => {
        expect(true).to.be.true;
      },() => {
        expect(false).to.be.true;
      }).then(done.bind(null, null), done);
    });

    it('returns a resolved promise if all rules are resolved', (done:any) => {
      var rule1:FakeRule = new FakeRule(Promise.resolve());
      var rule2:FakeRule = new FakeRule(Promise.resolve());

      var ret:any = validator.asyncValidateValue(null, [rule1, rule2]);
      ret.then(() => {
        expect(true).to.be.true;
      },() => {
        expect(false).to.be.true;
      }).then(done.bind(null, null), done);
    });

    it('returns a rejected promise with only one failing rule if a rule is rejected', (done:any) => {
      var rule1:FakeRule = new FakeRule(Promise.reject(null));
      var rule2:FakeRule = new FakeRule(Promise.reject(null));

      var ret:any = validator.asyncValidateValue(null, [rule1, rule2]);
      ret.then(() => {
        expect(true).to.be.false;
      },(reason:ValidationRule) => {
        expect(reason).to.not.be.undefined;
        expect(reason instanceof ValidationRule).to.be.true;
      }).then(done.bind(null, null), done);
    });
  });

  describe('setPromiseLibrary', () => {
    var bluebird:any;
    beforeEach(() => {
      bluebird = require('bluebird');
    });

    it('can set another promise library', (done:any) => {
      validator.setPromiseLibrary(bluebird.Promise);
      sinon.spy(bluebird.Promise, 'all');

      var rule:FakeRule = new FakeRule(Promise.resolve(null));
      var validationRule:ValidationRule = new ValidationRule(rule);
      sinon.spy(validationRule, 'asyncIsValueValid');

      validator.asyncValidateValue(null, [validationRule]).then(() => {
        expect(bluebird.Promise.all).to.have.been.called;
        expect(validationRule.asyncIsValueValid).to.have.been.calledWith(null, bluebird.Promise);
      }).then(done.bind(null, null), done);
    });
  });

  describe('isValueValid function', () => {
    describe('synchronous validation', () => {
      it('calls validateValue', (done:any) => {
        var rule:FakeRule = new FakeRule();

        sinon.spy(validator, 'validateValue');
        validator.isValueValid(undefined, [rule]).then(() => {
          expect(validator.validateValue).to.have.been.calledWith(undefined, ['definedAndNotNan', rule]);
        }).then(done.bind(null, null), done);
      });

      it('returns resolved promise when value satisfy every rule', (done:any) => {
        var rule:FakeRule = new FakeRule();
        var rule2:FakeRule = new FakeRule();
        var rule3:FakeRule = new FakeRule();

        validator.isValueValid(123, [rule, rule2, rule3]).then(() => {
          expect(true).to.be.true;
        }, () => {
          expect(true).to.be.true;
        }).then(done.bind(null, null), done);
      });

      it('returns a rejected promise when value unsatisfy a rule', (done:any) => {
        var rule:FakeRule = new FakeRule();
        var rule2:FakeRule = new FakeRule(false);
        var rule3:FakeRule = new FakeRule();

        validator.isValueValid(123, [rule, rule2, rule3]).then(() => {
          expect(true).to.be.false;
        }, () => {
          expect(true).to.be.true;
        }).then(done.bind(null, null), done);
      });
    });

    describe('async validation', () => {
      it('calls asyncValidateValue', (done:any) => {
        var rule:FakeRule = new FakeRule();
        var asyncRule:FakeRule = new FakeRule(Promise.resolve(null));

        sinon.spy(validator, 'asyncValidateValue');
        validator.isValueValid(123, [rule], [asyncRule]).then(() => {
          expect(validator.asyncValidateValue).to.have.been.calledWith(123, [asyncRule]);
        }).then(done.bind(null, null), done);
      });

      it('returns a rejected promise if async validation was successfull', (done:any) => {
        var rule:FakeRule = new FakeRule();
        var asyncRule:FakeRule = new FakeRule(Promise.reject(null));

        sinon.spy(validator, 'asyncValidateValue');
        validator.isValueValid(123, [rule], [asyncRule]).then(() => {
          expect(true).to.be.false;
        },() => {
          expect(true).to.be.true;
        }).then(done.bind(null, null), done);
      });
    });
  });

  describe('isObjectValid function', () => {
    it('returns a resolved promise if no validationRules on the validated object', (done:any) => {
      var validatedObject:any = {
        value1: ''
      };
      validator.isObjectValid(validatedObject, <IValidationConfiguration>{}).then(() => {
        expect(true).to.be.true;
      }).then(done.bind(null, null), done);
    });

    it('relies on isValueValid', (done) => {
      var validatedObject:any = {
        value1: '',
      };
      var validationConfiguration:IValidationConfiguration = {
        rules: {
          value1: [new FakeRule()]
        }
      };
      sinon.spy(validator, 'isValueValid');
      validator.isObjectValid(validatedObject, validationConfiguration).then(() => {
        expect(validator.isValueValid).to.have.been.called;
      }).then(done.bind(null, null), done);
    });

    it('calls validation once per property', (done) => {
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
      sinon.spy(validator, 'isValueValid');
      validator.isObjectValid(validatedObject, validationConfiguration).then(() => {
        expect(validator.isValueValid).to.have.been.calledOnce;
      }).then(done.bind(null, null), done);
    });

    it('returns false if one of the validated object properties is not a valid value', (done:any) => {
      var rule:FakeRule = new FakeRule(false);

      var validatedObject:any = {
        value1: ''
      };
      var validationConfiguration:IValidationConfiguration = {
        rules: {
          value1: [rule]
        }
      };
      validator.isObjectValid(validatedObject, validationConfiguration).then(() => {
        expect(true).to.be.false;
      }, () => {
        expect(true).to.be.true;
      }).then(done.bind(null, null), done);
    });

    it('validates objects recursively', (done:any) => {
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
      validator.isObjectValid(validatedObject).then(() => {
        expect(false).to.be.true;
      }, () => {
        expect(true).to.be.true;
      }).then(done.bind(null, null), done);
    });

    it('validates arrays recursively', (done) => {
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
      validator.isObjectValid(validatedObject).then(() => {
        expect(false).to.be.true;
      }, () => {
        expect(true).to.be.true;
      }).then(done.bind(null, null), done);
    });
  });

  describe('isGroupValid function', () => {
    it("returns a resolved promise if no group given", (done) => {
      var validatedObject:any = {
        value1: '',
        value2: '',
        value3: ''
      };
      validator.isGroupValid(validatedObject, 'groupNotFound', <IValidationConfiguration>{}).then(() => {
        expect(true).to.be.true;
      }, () => {
        expect(false).to.be.true;
      }).then(done.bind(null, null), done);
    });


    it("returns a resolved promise if the group is not found", (done:any) => {
      var validatedObject:any = {
        value1: '',
        value2: '',
        value3: ''
      };
      var validationConfiguration:IValidationConfiguration = {
        groups: {group1: ['value1', 'value2']}
      };
      validator.isGroupValid(validatedObject, 'groupNotFound', validationConfiguration).then(() => {
        expect(true).to.be.true;
      }, () => {
        expect(false).to.be.true;
      }).then(done.bind(null, null), done);
    });

    it("returns a resolved promise if no validation rules", (done:any) => {
      var validatedObject:any = {
        value1: '',
        value2: '',
        value3: ''
      };
      var validationConfiguration:IValidationConfiguration = {
        groups: {group1: ['value1', 'value2']}
      };
      validator.isGroupValid(validatedObject, 'group1', validationConfiguration).then(() => {
        expect(true).to.be.true;
      }, () => {
        expect(false).to.be.true;
      }).then(done.bind(null, null), done);
    });

    it("validates group given by name", (done) => {
      var rule1:FakeRule = new FakeRule(false);
      var rule2:FakeRule = new FakeRule();
      sinon.spy(rule1, 'isValueValid');
      sinon.spy(rule2, 'isValueValid');

      var validatedObject:any = {
        value1: '',
        value2: ''
      };
      var validationConfiguration:IValidationConfiguration = {
        rules: {value1: [rule1], value2: [rule2]},
        groups: {group1: ['value1']}
      };
      validator.isGroupValid(validatedObject, 'group1', validationConfiguration).then(() => {
        expect(false).to.be.true;
      }, () => {
        expect(rule1.isValueValid).to.have.been.called;
        expect(rule2.isValueValid).to.not.have.been.called;
      }).then(done.bind(null, null), done);
    });

    it('search for group recursively', (done:any) => {
      var rule1:FakeRule = new FakeRule();
      var rule2:FakeRule = new FakeRule(false);
      sinon.spy(rule1, 'isValueValid');
      sinon.spy(rule2, 'isValueValid');

      var validatedObject:any = {
        value1: '',
        valueObject: {
          value2: '',
          validationConfiguration: {
            rules: {value2:[rule2]},
            groups: {group2: ['value2']}
          }
        },
        validationConfiguration: {
          rules: {value1: [rule1]}
        }
      };
      validator.isGroupValid(validatedObject, 'group2').then(() => {
        expect(false).to.be.true;
      }, () => {
        expect(rule1.isValueValid).to.not.have.been.called;
        expect(rule2.isValueValid).to.have.been.called;
      }).then(done.bind(null, null), done);
    });

    it('validates group at different depth of the object', (done:any) => {
      var rule1:FakeRule = new FakeRule(false);
      var rule2:FakeRule = new FakeRule(false);
      sinon.spy(rule1, 'isValueValid');
      sinon.spy(rule2, 'isValueValid');

      var validatedObject:any = {
        value1: '',
        validationConfiguration: {
          groups: { group1: ['value1'] },
          rules: { value1: [rule1] }
        },
        valueObject: {
          value2: '',
          validationConfiguration: {
            groups: { group1: ['value2'] },
            rules: { value2: [rule2] }
          }
        }
      };
      var isValid = validator.isGroupValid(validatedObject, 'group1').then(() => {
        expect(false).to.be.true;
      }, () => {
        expect(rule1.isValueValid).to.have.been.called;
        expect(rule2.isValueValid).to.have.been.called;
      }).then(done.bind(null, null), done);
    });
  });
});
