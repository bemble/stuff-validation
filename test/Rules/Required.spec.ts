/// <reference path="../../typings/sv-testing.d.ts" />

import {Required} from "../../src/lib/Rules/Required";

suite('Required', () => {
  var rule:any = null;

  setup(() => {
    rule = new Required();
  });

  test("replies false when null, empty string, empty array or empty object is given", () => {
    var tests:any[] = [null, '', [], {}];

    tests.forEach((value) => {
      var valid = rule.isValueValid(value);
      assert.isFalse(valid, value);
    });
  });

  test("replies true when 0, azerty, a not empty object, a not empty array or a boolean is given", () => {
    var tests:any[] = [0, 'azerty', {test:'value'}, [12], true, false];

    tests.forEach((value) => {
      var valid = rule.isValueValid(value);
      assert.isTrue(valid, value);
    });
  });
});
