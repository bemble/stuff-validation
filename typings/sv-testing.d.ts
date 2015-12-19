/// <reference path="tsd.d.ts" />

// chai, sinon and assert are added as node globals with mocha requires, so tell to TS that they exist
declare var chai: Chai.ChaiStatic;
declare var assert: CustomAssertStatic;
declare var sinon: Sinon.SinonStatic;

// Hacky but prevent typescript to dislike messages that are not string
interface CustomAssertStatic extends Chai.AssertStatic {
  (expression: any, message?: string): void;

  fail(actual?: any, expected?: any, msg?: any, operator?: string): void;

  ok(val: any, msg?: any): void;
  isOk(val: any, msg?: any): void;
  notOk(val: any, msg?: any): void;
  isNotOk(val: any, msg?: any): void;

  equal(act: any, exp: any, msg?: any): void;
  notEqual(act: any, exp: any, msg?: any): void;

  strictEqual(act: any, exp: any, msg?: any): void;
  notStrictEqual(act: any, exp: any, msg?: any): void;

  deepEqual(act: any, exp: any, msg?: any): void;
  notDeepEqual(act: any, exp: any, msg?: any): void;

  isTrue(val: any, msg?: any): void;
  isFalse(val: any, msg?: any): void;

  isNull(val: any, msg?: any): void;
  isNotNull(val: any, msg?: any): void;

  isUndefined(val: any, msg?: any): void;
  isDefined(val: any, msg?: any): void;

  isNaN(val: any, msg?: any): void;
  isNotNaN(val: any, msg?: any): void;

  isAbove(val: number, abv: number, msg?: any): void;
  isBelow(val: number, blw: number, msg?: any): void;

  isFunction(val: any, msg?: any): void;
  isNotFunction(val: any, msg?: any): void;

  isObject(val: any, msg?: any): void;
  isNotObject(val: any, msg?: any): void;

  isArray(val: any, msg?: any): void;
  isNotArray(val: any, msg?: any): void;

  isString(val: any, msg?: any): void;
  isNotString(val: any, msg?: any): void;

  isNumber(val: any, msg?: any): void;
  isNotNumber(val: any, msg?: any): void;

  isBoolean(val: any, msg?: any): void;
  isNotBoolean(val: any, msg?: any): void;

  typeOf(val: any, type: string, msg?: any): void;
  notTypeOf(val: any, type: string, msg?: any): void;

  instanceOf(val: any, type: Function, msg?: any): void;
  notInstanceOf(val: any, type: Function, msg?: any): void;

  include(exp: string, inc: any, msg?: any): void;
  include(exp: any[], inc: any, msg?: any): void;

  notInclude(exp: string, inc: any, msg?: any): void;
  notInclude(exp: any[], inc: any, msg?: any): void;

  match(exp: any, re: RegExp, msg?: any): void;
  notMatch(exp: any, re: RegExp, msg?: any): void;

  property(obj: Object, prop: string, msg?: any): void;
  notProperty(obj: Object, prop: string, msg?: any): void;
  deepProperty(obj: Object, prop: string, msg?: any): void;
  notDeepProperty(obj: Object, prop: string, msg?: any): void;

  propertyVal(obj: Object, prop: string, val: any, msg?: any): void;
  propertyNotVal(obj: Object, prop: string, val: any, msg?: any): void;

  deepPropertyVal(obj: Object, prop: string, val: any, msg?: any): void;
  deepPropertyNotVal(obj: Object, prop: string, val: any, msg?: any): void;

  lengthOf(exp: any, len: number, msg?: any): void;
  //alias frenzy
  throw(fn: Function, msg?: any): void;
  throw(fn: Function, regExp: RegExp): void;
  throw(fn: Function, errType: Function, msg?: any): void;
  throw(fn: Function, errType: Function, regExp: RegExp): void;

  throws(fn: Function, msg?: any): void;
  throws(fn: Function, regExp: RegExp): void;
  throws(fn: Function, errType: Function, msg?: any): void;
  throws(fn: Function, errType: Function, regExp: RegExp): void;

  Throw(fn: Function, msg?: any): void;
  Throw(fn: Function, errType: Function, msg?: any): void;

  doesNotThrow(fn: Function, msg?: any): void;
  doesNotThrow(fn: Function, errType: Function, msg?: any): void;

  operator(val: any, operator: string, val2: any, msg?: any): void;
  closeTo(act: number, exp: number, delta: number, msg?: any): void;

  sameMembers(set1: any[], set2: any[], msg?: any): void;
  sameDeepMembers(set1: any[], set2: any[], msg?: any): void;
  includeMembers(superset: any[], subset: any[], msg?: any): void;
}