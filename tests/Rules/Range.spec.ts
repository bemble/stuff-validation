/// <reference path="../../typings/tsd.d.ts" />

import chai = require('chai');
var expect:any = chai.expect;

import {Rule} from "../../src/lib/Rule";
import {Range} from "../../src/lib/Rules/Range";

describe('MaxLength', () => {
  var rule:Rule = null;

  beforeEach(() => {
    rule = new Range();
  });

  describe('isValueValid', () => {
    it("replies true when the length satisfy the parametrized conditions", () => {
      var tests:any = [
        {value: 2, parameters: {min: 1, max: 3}},
        {value: 2, parameters: {min: 2, max: 3}},
        {value: 2, parameters: {min: 1, max: 2}},
        {value: 'abc', parameters: {min: 'a', max: 'z'}},
        {value: new Date('2015-05-05'), parameters: {min: new Date('2015-05-04'), max: new Date('2015-05-06')}},
        {value: new Date('2015-05-05'), parameters: {min: new Date('2015-05-05'), max: new Date('2015-05-06')}},
        {value: new Date('2015-05-05'), parameters: {min: new Date('2015-05-04'), max: new Date('2015-05-05')}}
      ];

      tests.forEach((conf:any) => {
        var valid = rule.isValueValid(conf.value, conf.parameters);
        expect(valid).to.be.true;
      });
    });

    it("replies false when the length does not satisfy the parametrized conditions", () => {
      var tests:any = [
        {value: 2, parameters: {min: 3, max: 4}},
        {value: 'abc', parameters: {min: 'b', max: 'c'}},
        {value: new Date('2015-05-05'), parameters: {min: new Date('2015-05-06'), max: new Date('2015-05-07')}}
      ];

      tests.forEach((conf:any) => {
        var valid:any = rule.isValueValid(conf.value, conf.parameters);
        expect(valid).to.be.false;
      });
    });
  });

  describe('getErrorMessage', () => {
    it("gives a message for any value", () => {
      var message:string = rule.getErrorMessage({min: 3, max: 4});
      expect(message).to.equal("The value must be between 3 and 4.");

      var date:Date = new Date();
      date.toString = () => "3";
      message = rule.getErrorMessage({min: date, max: 4});
      expect(message).to.equal("The date must be between 3 and 4.");
    });
  });
});
