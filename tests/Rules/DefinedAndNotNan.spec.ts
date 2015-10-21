/// <reference path="../../typings/tsd.d.ts" />

import chai = require('chai');
var expect:any = chai.expect;

import {Rule} from "../../src/lib/Rule";
import {DefinedAndNotNan} from "../../src/lib/Rules/DefinedAndNotNan";

describe('NotUndefinedOrNan', () => {
  var rule:Rule = null;

  beforeEach(() => {
    rule = new DefinedAndNotNan();
  });

  it("replies false when undefined or NaN is given", () => {
    [undefined, NaN].forEach((value) => {
      var valid = rule.isValueValid(value);
      expect(valid).to.be.false;
    });
  });

  it("replies true when 0, azerty, a not empty object is given", () => {
    [0, 'azerty', {test:'value'}, null, [], false].forEach((value) => {
      var valid = rule.isValueValid(value);
      expect(valid).to.be.true;
    });
  });
});
