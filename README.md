# data-validation
Node module that allows you to validate data according to rules.

### Default test
The validator always check if the given value is not `undefined` or `NaN`.
The motivation of this behavior is that `undefined` is value that should not be settable by user/developer (use `null` instead)
and `NaN` which is by definition an unvalid value: a number was expected and not a number was got.

### Null
If `null` is the value to test and the rules don't contain `required`, the value will be valid and no validation rule will be called.
The reason is that if the value is not required, `null` is valid and there is no need to do any test on an "empty value".

## Compatibility
* `ECMAScript 5 +`

## Async validation
Because this library is here to give a quick feedback to the user about the validity of its data, handle async validation is not a priority.

## Dev notes

### How to run tests?

`gulp typescript test`

### TDD?

Run in a console: `gulp watch` or if your IDE transpiles Typescript files automatically, just run `gulp watch:tests`
