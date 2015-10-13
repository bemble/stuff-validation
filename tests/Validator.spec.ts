/// <reference path="../typings/tsd.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

import {IRule} from "../lib/IRule";
import {Validator} from "../lib/Validator";
import {RulesCollection} from "../lib/RulesCollection";

describe('Validator', () => {
  var validator:Validator = null;

  beforeEach(() => {
    validator = new Validator();
  });

  describe('validateValue function', () => {
    it('calls isValueValid of the given rule when calling', () => {
      var rule:IRule = {isValueValid: sinon.spy()};

      validator.validateValue(123, rule);
      expect(rule.isValueValid).to.have.been.called;
    });

    it('can create rules object by their name', () => {
      var requiredRule = RulesCollection.getRule('required');

      var invalidRule = validator.validateValue(null, 'required');
      expect(invalidRule).to.equal(requiredRule);

      invalidRule = validator.validateValue(123, 'required');
      expect(invalidRule).not.to.be.null;
    });

    it('always add notUndefinedOrEmpty rule', () => {
      var invalidRules = validator.validateValue(undefined);
      expect((<any>invalidRules.constructor).name).to.equal('NotUndefinedOrNan');
    });

    it('accepts literal object with rule property to get the rule', () => {
      var rule:IRule = {isValueValid: () => false};

      var invalidRule = validator.validateValue(123, {rule: rule});
      expect(invalidRule).to.equal(rule);
    });

    it('accepts literal object with name property to find the rule', () => {
      var requiredRule = RulesCollection.getRule('required');

      var invalidRule = validator.validateValue(null, {name: 'required'});
      expect(invalidRule).to.equal(requiredRule);
    });

    it('passes parameters of the rules', () => {
      var rule:IRule = {isValueValid: sinon.spy()};

      validator.validateValue(123, {rule: rule});
      expect(rule.isValueValid).to.have.been.calledWith(123, undefined);

      validator.validateValue(123, {rule: rule, parameters: 'foo'});
      expect(rule.isValueValid).to.have.been.calledWith(123, 'foo');

      validator.validateValue(123, {rule: rule, parameters: {foo: 'bar'}});
      expect(rule.isValueValid).to.have.been.calledWith(123, {foo: 'bar'});

      validator.validateValue(123, {rule: rule, parameters: ['azerty']});
      expect(rule.isValueValid).to.have.been.calledWith(123, ['azerty']);
    });

    it('accepts function as parameters', () => {
      var rule:IRule = {isValueValid: sinon.spy()};

      validator.validateValue(123, {rule: rule, parameters: () => 'foo'});
      expect(rule.isValueValid).to.have.been.calledWith(123, 'foo');

      validator.validateValue(123, {rule: rule, parameters: {foo: () => 'bar'}});
      expect(rule.isValueValid).to.have.been.calledWith(123, {foo: 'bar'});

      validator.validateValue(123, {rule: rule, parameters: [() => 'bar']});
      expect(rule.isValueValid).to.have.been.calledWith(123, ['bar']);
    });

    it('call the rule if the onlyIf condition is satisfied', () => {
      var rule:IRule = {isValueValid: sinon.spy()};

      validator.validateValue(123, {rule: rule, onlyIf: false});
      expect(rule.isValueValid).to.not.have.been.called;

      validator.validateValue(123, {rule: rule, onlyIf: () => {return false;}});
      expect(rule.isValueValid).to.not.have.been.called;

      validator.validateValue(123, {rule: rule, onlyIf: true});
      expect(rule.isValueValid).to.have.been.called;
    });

    it('validates multiple rules', () => {
      var rule:IRule = {isValueValid: sinon.spy()};
      var rule2:IRule = {isValueValid: sinon.spy()};

      validator.validateValue(123, [rule, rule2]);
      expect(rule.isValueValid).to.have.been.called;
      expect(rule2.isValueValid).to.have.been.called;
    });

    it('gives the first rules where isValueValid failed', () => {
      var rule:IRule = {isValueValid: () => true};
      var rule2:IRule = {isValueValid: () => true};
      var rule3:IRule = {isValueValid: () => true};

      var failedRule = validator.validateValue(123, [rule, rule2, rule3]);
      expect(failedRule).to.be.null;

      rule.isValueValid = () => false;
      rule3.isValueValid = () => false;
      sinon.spy(rule2, 'isValueValid');

      failedRule = validator.validateValue(123, [rule, rule2, rule3]);
      expect(failedRule).to.equal(rule);
      expect(rule2.isValueValid).to.not.have.been.called;
    });

    it('returns true if null is given and required is not set', () => {
      var rule:IRule = {isValueValid: () => false};
      sinon.spy(rule, 'isValueValid');

      var failedRule = validator.validateValue(null, rule);
      expect(failedRule).to.be.null;
      expect(rule.isValueValid).to.not.have.been.called;
    });
  });

  describe('isValueValid', () => {
    it('calls validateValue', () => {
      var rule:IRule = {isValueValid: () => true};

      sinon.spy(validator, 'validateValue');
      validator.isValueValid(undefined, rule);
      expect(validator.validateValue).to.have.been.calledWith(undefined, rule);
    });

    it('returns true when value satisfy every rule', () => {
      var rule = {isValueValid: () => true};
      var rule2 = {isValueValid: () => true};
      var rule3 = {isValueValid: () => true};

      var isValid = validator.isValueValid(123, [rule, rule2, rule3]);
      expect(isValid).to.be.true;

      rule2.isValueValid = () => false;

      isValid = validator.isValueValid(123, [rule, rule2, rule3]);
      expect(isValid).to.be.false;
    });
  });

  describe('isObjectValid function', () => {
    it('returns true if no validationRules on the validated object', () => {
      var validatedObject:any = {
        value1: ''
      };
      var isValid = validator.isObjectValid(validatedObject);
      expect(isValid).to.be.true;
    });

    it('returns false if one of the validated object properties is not a valid value', () => {
      var rule:IRule = {isValueValid: () => false};

      var validatedObject:any = {
        value1: '',
        validationRules: {
          value1: [rule]
        }
      };
      var isValid = validator.isObjectValid(validatedObject);
      expect(isValid).to.be.false;
    });

    it('validates objects recursively', () => {
      var rule = {isValueValid: () => false};;

      var validatedObject:any = {
        value1: '',
        value2: {
          value3: '',
          validationRules: {
            value3: [rule]
          }
        }
      };
      var isValid = validator.isObjectValid(validatedObject);
      expect(isValid).to.be.false;

      validatedObject = {
        value1: '',
        value2: [{
          value3: '',
          validationRules: {
            value3: [rule]
          }
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
      var isValid = validator.isGroupValid(validatedObject, 'groupNotFound');
      expect(isValid).to.be.true;

      validatedObject.validationGroups = {
        group1: ['value1', 'value2']
      };
      isValid = validator.isGroupValid(validatedObject, 'groupNotFound');
      expect(isValid).to.be.true;
    });

    it("returns true if no validation rules", () => {
      var validatedObject:any = {
        value1: '',
        value2: '',
        value3: '',
        validationGroups: {
          group1: ['value1', 'value2']
        }
      };
      var isValid = validator.isGroupValid(validatedObject, 'group1');
      expect(isValid).to.be.true;
    });

    it("validates group given by name", () => {
      var rule1:IRule = {isValueValid: () => false};
      var rule2:IRule = {isValueValid: sinon.spy()};
      sinon.spy(rule1, 'isValueValid');

      var validatedObject:any = {
        value1: '',
        value2: '',
        validationGroups: {
          group1: ['value1']
        },
        validationRules: {
          value1: rule1,
          value2: rule2
        }
      };
      var isValid = validator.isGroupValid(validatedObject, 'group1');
      expect(isValid).to.be.false;
      expect(rule1.isValueValid).to.have.been.called;
      expect(rule2.isValueValid).to.not.have.been.called;
    });

    it('search for group recursively', () => {
      var rule1:IRule = {isValueValid: sinon.spy()};
      var rule2:IRule = {isValueValid: () => false};
      sinon.spy(rule2, 'isValueValid');

      var validatedObject:any = {
        value1: '',
        valueObject: {
          value2: '',
          validationGroups: {
            group2: ['value2']
          },
          validationRules: {
            value2: rule2
          }
        },
        validationRules: {
          value1: rule1
        }
      };
      var isValid = validator.isGroupValid(validatedObject, 'group2');
      expect(isValid).to.be.false;
      expect(rule1.isValueValid).to.not.have.been.called;
      expect(rule2.isValueValid).to.have.been.called;
    });

    it('validates group at different depth of the object', () => {
      var rule1:IRule = {isValueValid: () => false};
      var rule2:IRule = {isValueValid: sinon.spy()};
      sinon.spy(rule1, 'isValueValid');

      var validatedObject:any = {
        value1: '',
        valueObject: {
          value2: '',
          validationGroups: {
            group1: ['value2']
          },
          validationRules: {
            value2: rule2
          }
        },
        validationGroups: {
          group1: ['value1']
        },
        validationRules: {
          value1: rule1
        }
      };
      var isValid = validator.isGroupValid(validatedObject, 'group1');
      expect(isValid).to.be.false;
      expect(rule1.isValueValid).to.have.been.called;
      expect(rule2.isValueValid).to.not.have.been.called;
    });
  });
});
