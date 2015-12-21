/// <reference path="../../typings/sv-testing.d.ts" />

import {Length} from "../../src/lib/Rules/Length";

suite('Length', () => {
  var rule:any = null;

  setup(() => {
    rule = new Length();
  });

  suite('isValueValid', () => {
    test("replies true when the length satisfy the parametrized conditions", () => {
      var tests:any = [
        {value: 'foo', parameters: {min: 1}},
        {value: 'foo', parameters: {max: 5}},
        {value: 'foo', parameters: {min: 3}},
        {value: 'foo', parameters: {max: 3}},
        {value: 'foo', parameters: {equals: 3}},
        {value: 'foo', parameters: {min: 2, max: 4}}
      ];

      tests.forEach((conf:any) => {
        var valid:boolean = rule.isValueValid(conf.value, conf.parameters);
        assert.isTrue(valid, conf);
      });
    });

    test("replies false when the length does not satisfy the parametrized conditions", () => {
      var tests:any = [
        {value: 'foo', parameters: {min: 4}},
        {value: 'foo', parameters: {max: 2}},
        {value: 'foo', parameters: {equals: 1}},
        {value: 'foo', parameters: {min: 1, max: 2}},
        {value: 'foo', parameters: {min: 4, max: 5}}
      ];

      tests.forEach((conf:any) => {
        var valid:any = rule.isValueValid(conf.value, conf.parameters);
        assert.isFalse(valid, conf);
      });
    });

    test("imply a priorty of equals parameter", () => {
      var conf:any = {min: 1, max: 4, equals: 5};
      var valid:any = rule.isValueValid('foo', conf);
      assert.isFalse(valid, conf);
    });

    test("handle arrays", () => {
      var tests:any[] = [{min:0, max:4}, {equals: 3}];
      tests.forEach((conf:any) => {
        var valid:any = rule.isValueValid([1,2,3], conf);
        assert.isTrue(valid, conf);
      });
    });
  });

  suite('getErrorMessage', () => {
    test("gives a message for any value", () => {
      var message:string = rule.getErrorMessage(3);
      assert.equal(message, "The value length must be lower or equal to 3.");
    });
  });
});
