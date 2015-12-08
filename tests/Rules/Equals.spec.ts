/// <reference path="../../typings/tsd.d.ts" />

import chai = require('chai');
var expect:any = chai.expect;

import {Rule} from "../../src/lib/Rule";
import {Equals} from "../../src/lib/Rules/Equals";

describe('Equals', () => {
  var rule:Rule = null;

  beforeEach(() => {
    rule = new Equals();
  });

  describe('isValueValid', () => {
    it("replies true when values are equals", () => {
      var valueDate:Date = new Date('2015-02-23');
      var refDate:Date = new Date('2015-02-23');
      var valueObj:Object = {valueOf: () => "foo"};
      var refObj:Object = {toString: () => "foo"};

      [{value: 2, reference: 2}, {value: "foo", reference: "foo"}, {value: valueDate, reference: refDate}, {value: valueObj, reference: refObj}].forEach((valueRef) => {
        var valid = rule.isValueValid(valueRef.value, valueRef.reference);
        expect(valid).to.be.true;
      });
    });

    it("replies values when values are not equals", () => {
      var valueDate:Date = new Date('2015-02-23');
      var refDate:Date = new Date('2015-02-21');
      var valueObj:Object = {valueOf: () => "foo"};
      var refObj:Object = {toString: () => "bar"};

      [{value: 2, reference: 3}, {value: "foo", reference: "bar"}, {value: valueDate, reference: refDate}, {value: valueObj, reference: refObj}].forEach((valueRef) => {
        var valid = rule.isValueValid(valueRef.value, valueRef.reference);
        expect(valid).to.be.false;
      });
    });
  });

  describe('getErrorMessage', () => {
    it("gives a message for any value", () => {
      var message:string = rule.getErrorMessage(3);
      expect(message).to.equal("The value must equal 3.");

      message = rule.getErrorMessage('foo');
      expect(message).to.equal("The value must equal foo.");

      message = rule.getErrorMessage({});
      expect(message).to.equal("The value must equal [object Object].");

      message = rule.getErrorMessage({toString: () => 'bar'});
      expect(message).to.equal("The value must equal bar.");
    });

    it("handles dates", () => {
      var date:Date = new Date(1970, 0);
      date.toString = () => {
        return  ("00" + (date.getMonth() + 1)).slice(-2) + '/' + ("00" + date.getDate()).slice(-2) + '/' + date.getFullYear();
      };
      var message:string = rule.getErrorMessage(date);
      expect(message).to.equal("The date must be 01/01/1970.");
    });
  });
});
