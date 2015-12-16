/// <reference path="../../typings/tsd.d.ts" />

import chai = require('chai');
var expect:any = chai.expect;

import {Rule} from "../../src/lib/Rule";
import {Length} from "../../src/lib/Rules/Length";

describe('MaxLength', () => {
  var rule:Rule = null;

  beforeEach(() => {
    rule = new Length();
  });

  describe('isValueValid', () => {
    it("replies true when the length satisfy the parametrized conditions", () => {
      var tests:any = [
        {value: 'foo', parameters: {min: 1}},
        {value: 'foo', parameters: {max: 5}},
        {value: 'foo', parameters: {min: 3}},
        {value: 'foo', parameters: {max: 3}},
        {value: 'foo', parameters: {equals: 3}},
        {value: 'foo', parameters: {min: 2, max: 4}}
      ];

      tests.forEach((conf:any) => {
        var valid = rule.isValueValid(conf.value, conf.parameters);
        expect(valid).to.be.true;
      });
    });

    it("replies false when the length does not satisfy the parametrized conditions", () => {
      var tests:any = [
        {value: 'foo', parameters: {min: 4}},
        {value: 'foo', parameters: {max: 2}},
        {value: 'foo', parameters: {equals: 1}},
        {value: 'foo', parameters: {min: 1, max: 2}},
        {value: 'foo', parameters: {min: 4, max: 5}}
      ];

      tests.forEach((conf:any) => {
        var valid:any = rule.isValueValid(conf.value, conf.parameters);
        expect(valid).to.be.false;
      });
    });

    it("imply a priorty of equals parameter", () => {
      var valid:any = rule.isValueValid('foo', {min: 1, max: 4, equals: 5});
      expect(valid).to.be.false;
    });

    it("handle arrays", () => {
      var valid:any = rule.isValueValid([1,2,3], {min:0, max:4});
      expect(valid).to.be.true;

      valid = rule.isValueValid([1,2,3], {equals: 3});
      expect(valid).to.be.true;
    });
  });

  xdescribe('getErrorMessage', () => {
    it("gives a message for any value", () => {
      var message:string = rule.getErrorMessage(3);
      expect(message).to.equal("The value length must be lower or equal to 3.");
    });
  });
});
