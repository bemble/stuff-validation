import {Rule} from '../../src/lib/Rule';

export class FakeRule extends Rule {
  constructor(public isValid?:Promise<any>|boolean) {
    super();
  }

  isValueValid(value:any):Promise<any>|boolean{
    return this.isValid !== undefined ? this.isValid : true;
  }
}
