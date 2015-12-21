/// <reference path="../../typings/sv-testing.d.ts" />

import {DefinedAndNotNan} from "../../src/lib/Rules/DefinedAndNotNan";

suite('DefinedAndNotNan', () => {
  var rule:any = null;

  setup(() => {
    rule = new DefinedAndNotNan();
  });

  suite("isValueValid", () => {
    test("error values", () => {
      var tests:any[] = [undefined, NaN];

      tests.forEach((value) => {
        var valid:boolean = rule.isValueValid(value);
        assert.isFalse(valid, [value]);
      });
    });

    test("success values", () => {
      var tests:any[] = [0, 'azerty', {test: 'value'}, null, [], false];

      tests.forEach((value) => {
        var valid:boolean = rule.isValueValid(value);
        assert.isTrue(valid, [value]);
      });
    });
  });
});
