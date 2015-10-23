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

    it('returns an success promise if all promise are in success', (done:any) => {
      var rule1:FakeRule = new FakeRule();
      var rule2:FakeRule = new FakeRule();
      var p1:Promise<any> = Promise.resolve();
      var p2:Promise<any> = Promise.resolve();

      sinon.stub(rule1, 'isValueValid', () => p1);
      sinon.stub(rule2, 'isValueValid', () => p2);

      var ret:any = validator.asyncValidateValue(null, [rule1, rule2]);
      ret.then(() => {
        expect(true).to.be.true;
      },() => {
        expect(false).to.be.true;
      }).then(done.bind(null, null), done);
    });
  });

  describe('isValueValid function', () => {
    it('calls validateValue', () => {
      var rule:FakeRule = new FakeRule();

      sinon.spy(validator, 'validateValue');
      validator.isValueValid(undefined, [rule]);
      expect(validator.validateValue).to.have.been.calledWith(undefined, ['definedAndNotNan', rule]);
    });

    it('returns true when value satisfy every rule', () => {
      var rule:FakeRule = new FakeRule();
      var rule2:FakeRule = new FakeRule();
      var rule3:FakeRule = new FakeRule();

      var isValid = validator.isValueValid(123, [rule, rule2, rule3]);
      expect(isValid).to.be.true;

      sinon.stub(rule2, 'isValueValid', () => false);

      isValid = validator.isValueValid(123, [rule, rule2, rule3]);
      expect(isValid).to.be.false;
    });
  });

  describe('isObjectValid function', () => {
    it('returns true if no validationRules on the validated object', () => {
      var validatedObject:any = {
        value1: ''
      };
      var isValid = validator.isObjectValid(validatedObject, <IValidationConfiguration>{});
      expect(isValid).to.be.true;
    });

    it('returns false if one of the validated object properties is not a valid value', () => {
      var rule:FakeRule = new FakeRule();
      sinon.stub(rule, 'isValueValid', () => false);

      var validatedObject:any = {
        value1: ''
      };
      var validationConfiguration:IValidationConfiguration = {
        rules: {
          value1: [rule]
        }
      };
      var isValid = validator.isObjectValid(validatedObject, validationConfiguration);
      expect(isValid).to.be.false;
    });

    it('validates objects recursively', () => {
      var rule:FakeRule = new FakeRule();
      sinon.stub(rule, 'isValueValid', () => false);

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
      var isValid = validator.isObjectValid(validatedObject);
      expect(isValid).to.be.false;

      validatedObject = {
        value1: '',
        value2: [{
          value3: '',
          validationConfiguration: validationConfiguration
        }]
      };
      var isValid = validator.isObjectValid(validatedObject);
      expect(isValid).to.be.false;
    });
  });

  describe('isGroupValid function', () => {
    it("returns true if the group is not found", () => {
      var validatedObject:any = {
        value1: '',
        value2: '',
        value3: ''
      };
      var isValid = validator.isGroupValid('groupNotFound', validatedObject, <IValidationConfiguration>{});
      expect(isValid).to.be.true;

      var validationConfiguration:IValidationConfiguration = {
        groups: {group1: ['value1', 'value2']}
      };
      isValid = validator.isGroupValid(validatedObject, 'groupNotFound', validationConfiguration);
      expect(isValid).to.be.true;
    });

    it("returns true if no validation rules", () => {
      var validatedObject:any = {
        value1: '',
        value2: '',
        value3: ''
      };
      var validationConfiguration:IValidationConfiguration = {
        groups: {group1: ['value1', 'value2']}
      };
      var isValid = validator.isGroupValid(validatedObject, 'group1', validationConfiguration);
      expect(isValid).to.be.true;
    });

    it("validates group given by name", () => {
      var rule1:FakeRule = new FakeRule();
      var rule2:FakeRule = new FakeRule();
      sinon.stub(rule1, 'isValueValid', () => false);
      sinon.spy(rule2, 'isValueValid');

      var validatedObject:any = {
        value1: '',
        value2: ''
      };
      var validationConfiguration:IValidationConfiguration = {
        rules: {value1: [rule1], value2: [rule2]},
        groups: {group1: ['value1']}
      };
      var isValid = validator.isGroupValid(validatedObject, 'group1', validationConfiguration);
      expect(isValid).to.be.false;
      expect(rule1.isValueValid).to.have.been.called;
      expect(rule2.isValueValid).to.not.have.been.called;

      validatedObject.validationConfiguration = validationConfiguration;
      isValid = validator.isGroupValid(validatedObject, 'group1');
      expect(isValid).to.be.false;
      expect(rule1.isValueValid).to.have.been.called;
      expect(rule2.isValueValid).to.not.have.been.called;
    });

    it('search for group recursively', () => {
      var rule1:FakeRule = new FakeRule();
      var rule2:FakeRule = new FakeRule();
      sinon.spy(rule1, 'isValueValid');
      sinon.stub(rule2, 'isValueValid', () => false);

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
      var isValid = validator.isGroupValid(validatedObject, 'group2');
      expect(isValid).to.be.false;
      expect(rule1.isValueValid).to.not.have.been.called;
      expect(rule2.isValueValid).to.have.been.called;
    });

    it('validates group at different depth of the object', () => {
      var rule1:FakeRule = new FakeRule();
      var rule2:FakeRule = new FakeRule();
      var stubRule1 = sinon.stub(rule1, 'isValueValid').returns(false);
      sinon.stub(rule2, 'isValueValid').returns(false);

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
      var isValid = validator.isGroupValid(validatedObject, 'group1');
      expect(isValid).to.be.false;
      expect(rule1.isValueValid).to.have.been.called;
      expect(rule2.isValueValid).to.not.have.been.called;

      stubRule1.returns(true);

      isValid = validator.isGroupValid(validatedObject, 'group1');
      expect(isValid).to.be.false;
      expect(rule2.isValueValid).to.have.been.called;
    });
  });
});
