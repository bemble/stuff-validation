/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />

// Give the shape of an ES6 compliant promise library used in the validator.
declare interface IEs6PromiseLibrary {
  new<T>(callback: (resolve : (value?: T | Thenable<T>) => void, reject: (error?: any) => void) => void): Promise<T>;

  all<R>(promises: (R | Thenable<R>)[]): Promise<R[]>;
}
