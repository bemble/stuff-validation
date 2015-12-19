/// <reference path="../../typings/sv-testing.d.ts" />

import {Pattern} from "../../src/lib/Rules/Pattern";

suite('Pattern', () => {
  var rule:any = null;

  setup(() => {
    rule = new Pattern();
  });

  suite('isValueValid', () => {
    test("replies true when the value match the given regexp", () => {
      var tests:any[] = [{value: 'az123', pattern: /\d+/}, {value: {toString: () => 'az123'}, pattern: /\d+/}];

      tests.forEach((conf) => {
        var valid:boolean = rule.isValueValid(conf.value, conf.pattern);
        assert.isTrue(valid, conf);
      });
    });

    test("replies false given value does not match the given regexp", () => {
      var tests:any[] = [{value: 'az123', pattern: new RegExp("/^\d+/")}];

      tests.forEach((conf) => {
        var valid:boolean = rule.isValueValid(conf.value, conf.pattern);
        assert.isFalse(valid, conf);
      });
    });
  });

  suite('getErrorMessage', () => {
    test("gives a message for any value", () => {
      var message:string = rule.getErrorMessage(/^\d+/);
      assert.equal(message, "The value must match /^\\d+/ pattern.");

      message = rule.getErrorMessage({toString: () => 'bar'});
      assert.equal(message, "The value must match bar pattern.");
    });
  });
});
