# data-validation

Node module that allows you to validate data according to rules.

## Installation

* `npm install stuff-validation --save`

## Documentation

Documentation can be read on the [wiki](https://github.com/pierrecle/data-validation/wiki/Documentation) or in the source code and tests directly.

### TL;DR

#### Basic validation

```javascript
// Dependencies stuff
var sv = require('stuff-validation');
var validator = new sv.Validator();
var ValidationRule = sv.ValidationRule;

// Basic validation
console.log(validator.isValueValid(undefined)); // failed: ValidationRule with an instance of DefinedOrNotNan as rule
console.log(validator.isValueValid(null)); // success: null
console.log(validator.isValueValid(null, ['required'])); // failed: ValidationRule with an instance of Required as rule

// Rules with parameters
var dateTest = new Date('2015-01-12');
var dateRef = new Date('2015-01-13');
var dateValidationRule = new ValidationRule('lowerThan', { reference: dateRef, orEqual: false });
console.log(validator.isValueValid(dateTest, [dateValidationRule])); // success: null
```

#### Object validation

```javascript
// Dependencies stuff
var sv = require('stuff-validation');
var validator = new sv.Validator();
var ValidationRule = sv.ValidationRule;

function MyModel() {
  this.date = dateTest;
  this.nullValue = null;
};

function MyModelValidationRules(model) {
  var dateValidationApplyCondition = function() {
    return model.nullValue === null;
  };
  var dateValidationRule = new ValidationRule('lowerThan', { reference: dateRef, orEqual: false }, dateValidationApplyCondition);
  
  this.date = ['required', dateValidationRule];
  this.nullValue = ['required'];
};

var model = new MyModel();
var modelValidationRules = new MyModelValidationRules(model);
validator.validateValue(model.date, modelValidationRules.date).then(function() {
  console.log('Yeay date is valid');
}, function(failingRule) {
  console.log(':( date is not valid because of '+failingValidationRule.rule);
}); // Yeay date is valid

validator.validateObject(model, modelValidationRules).then(function() {
  console.log('Yeay model is valid');
}, function(failingRule) {
  console.log(':( model is not valid because of ' + failingValidationRule.rule.constructor.name + ": " + failingValidationRule.getErrorMessage());
}); // :( model is not valid because of Required: This value is mandatory.
```

## Dev notes

### How to run tests?

`npm test` or `gulp tsd typescript test`

### TDD?

Run in a console: `gulp watch` or if your IDE transpiles Typescript files automatically, just run `gulp watch:tests`.
Alternatively, you can use any other way to run tests in you IDE.
