/// <reference path="../../typings/tsd.d.ts" />

import chai = require('chai');
var expect:any = chai.expect;

import {Rule} from "../../src/lib/Rule";
import {Required} from "../../src/lib/Rules/Required";

describe('Required', () => {
  var rule:Rule = null;

  beforeEach(() => {
    rule = new Required();
  });

  it("replies false when null, empty string, empty array or empty object is given", () => {
    [null, '', [], {}].forEach((value) => {
      var valid = rule.isValueValid(value);
      expect(valid).to.be.false;
    });
  });

  it("replies true when 0, azerty, a not empty object, a not empty array or a boolean is given", () => {
    [0, 'azerty', {test:'value'}, [12], true, false].forEach((value) => {
      var valid = rule.isValueValid(value);
      expect(valid).to.be.true;
    });
  });
});
