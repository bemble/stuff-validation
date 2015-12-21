/// <reference path="../../typings/sv-testing.d.ts" />

import {LowerThan} from "../../src/lib/Rules/LowerThan";

suite('LowerThan', () => {
  var rule:any = null;

  setup(() => {
      rule = new LowerThan();
  });

  suite('isValueValid', () => {
    test("replies false when the given value is greater or equals the reference", () => {
      var curDate:Date = new Date();
      var pastDate:Date = new Date('1970-01-01');
      var tests:any[] = [
        {value: 2, reference: 2},
        {value: "foo", reference: "bar"},
        {value: curDate, reference: curDate},
        {value: curDate, reference: pastDate}
      ];

      tests.forEach((valueRef) => {
        var params:any = {reference: valueRef.reference};
        var valid:boolean = rule.isValueValid(valueRef.value, params);
        assert.isFalse(valid, valueRef);
      });
    });

    test("replies true when the given value is lower than the reference", () => {
      var curDate:Date = new Date();
      var pastDate:Date = new Date(1970, 0);
      var tests:any[] = [{value: 1, reference: 2}, {value: "bar", reference: "foo"}, {value: pastDate, reference: curDate}];

      tests.forEach((valueRef) => {
        var params:any = {reference: valueRef.reference};
        var valid:boolean = rule.isValueValid(valueRef.value, params);
        assert.isTrue(valid, valueRef);
      });
    });

    test("replies true when values are equals and orEqual flag is set in parameters", () => {
      var curDate:Date = new Date();
      var tests:any[] = [{value: 2, reference: 2}, {value: "foo", reference: "foo"}, {value: curDate, reference: curDate}];

      tests.forEach((valueRef) => {
        var params:any = {reference: valueRef.reference, orEqual: true};
        var valid:boolean = rule.isValueValid(valueRef.value, params);
        assert.isTrue(valid, valueRef);
      });
    });
  });

  suite("getErrorMessage", () => {
    test("gives a message for any value", () => {
      var tests:any[] = [3, 'foo', {}, {toString: () => 'bar'}];
      var params:any = {reference: null};

      tests.forEach((valueRef:any) => {
        params.reference = valueRef;
        var message:string = rule.getErrorMessage(params);
        assert.equal(message, "The value must be lower than " + params.reference + ".", params);
      });

      params.reference = 'bar';
      params.orEqual = true;
      var message:string = rule.getErrorMessage(params);
      assert.equal(message, "The value must be lower or equal to bar.", params);
    });

    test("handles dates", () => {
      var date:Date = new Date(1970, 10);
      date.toString = () => {
        return  ("00" + (date.getMonth() + 1)).slice(-2) + '/' + ("00" + date.getDate()).slice(-2) + '/' + date.getFullYear();
      };
      var params:any = {reference: date};
      var message:string = rule.getErrorMessage(params);
      assert.equal(message, "The date must be earlier than 11/01/1970.", params);

      params.orEqual = true;
      message = rule.getErrorMessage(params);
      assert.equal(message, "The date must be earlier or equal to 11/01/1970.", params);
    });
  });
});
