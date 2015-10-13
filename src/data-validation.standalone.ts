import {Validator,RulesCollection} from './data-validation';

(<any>window).DataValidation = {
  validator: new Validator(),
  RulesCollection: RulesCollection
};
