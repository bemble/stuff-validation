/// <reference path="../../typings/tsd.d.ts" />

import chai = require('chai');
var expect:any = chai.expect;

import {Rule} from "../../src/lib/Rule";
import {Pattern} from "../../src/lib/Rules/Pattern";

describe('Pattern', () => {
  var rule:Rule = null;

  beforeEach(() => {
    rule = new Pattern();
  });

  describe('isValueValid', () => {
    it("replies true when the value match the given regexp", () => {
      [{value: 'az123', pattern: /\d+/}, {value: {toString: () => 'az123'}, pattern: /\d+/}].forEach((conf) => {
        var valid = rule.isValueValid(conf.value, conf.pattern);
        expect(valid).to.be.true;
      });
    });

    it("replies false given value does not match the given regexp", () => {
      [{value: 'az123', pattern: new RegExp("/^\d+/")}].forEach((conf) => {
        var valid = rule.isValueValid(conf.value, conf.pattern);
        expect(valid).to.be.false;
      });
    });
  });

  describe('getErrorMessage', () => {
    it("gives a message for any value", () => {
      var message:string = rule.getErrorMessage(/^\d+/);
      expect(message).to.equal("The value must match /^\\d+/ pattern.");

      message = rule.getErrorMessage({toString: () => 'bar'});
      expect(message).to.equal("The value must match bar pattern.");
    });
  });
});
