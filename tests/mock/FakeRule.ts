import {Rule} from '../../src/lib/Rule';

export class FakeRule extends Rule {
  isValueValid(value:any): boolean {
    return true;
  }
}
