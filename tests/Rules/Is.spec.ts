/// <reference path="../../typings/sv-testing.d.ts" />

import {Is} from "../../src/lib/Rules/Is";

suite('Is', () => {
  var rule:any = null;

  setup(() => {
    rule = new Is();
  });

  suite('isValueValid', () => {
    test("replies true when the value is the reference", () => {
      var valueDate:Date = new Date('2015-02-23');
      var valueObj:Object = {valueOf: () => "foo"};
      var tests:any[] = [
        {value: 2, reference: 2},
        {value: "foo", reference: "foo"},
        {value: valueDate, reference: valueDate},
        {value: valueObj, reference: valueObj}
      ];

      tests.forEach((valueRef) => {
        var valid:boolean = rule.isValueValid(valueRef.value, valueRef.reference);
        assert.isTrue(valid, valueRef);
      });
    });

    test("replies false values when the value is the reference", () => {
      var valueDate:Date = new Date('2015-02-23');
      var refDate:Date = new Date('2015-02-23');
      var valueObj:String = new String("foo");
      var refObj:String = new String("foo");

      var tests:any[] = [
        {value: 2, reference: 3},
        {value: "foo", reference: "bar"},
        {value: valueDate, reference: refDate},
        {value: valueObj, reference: refObj}
      ];

      tests.forEach((valueRef) => {
        var valid:boolean = rule.isValueValid(valueRef.value, valueRef.reference);
        assert.isFalse(valid, valueRef);
      });
    });
  });

  suite('getErrorMessage', () => {
    test("gives a message for any value", () => {
      var tests:any = [3, 'foo', {}, {toString: () => 'bar'}];

      tests.forEach((valueRef:any) => {
        var message:string = rule.getErrorMessage(valueRef);
        assert.equal(message, "The value must be " + valueRef + ".", valueRef);
      });
    });

    test("handles dates", () => {
      var date:Date = new Date(1970, 0);
      date.toString = () => {
        return ("00" + (date.getMonth() + 1)).slice(-2) + '/' + ("00" + date.getDate()).slice(-2) + '/' + date.getFullYear();
      };
      var message:string = rule.getErrorMessage(date);
      assert.equal(message, "The value must be 01/01/1970.", date);
    });
  });
});
