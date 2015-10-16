function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./lib/Validator'));
__export(require('./lib/RulesCollection'));
__export(require('./lib/ValidationRule'));
__export(require('./lib/Rule'));
__export(require('./lib/IValidationConfiguration'));
