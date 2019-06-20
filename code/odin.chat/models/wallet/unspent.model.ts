import { Deserializable } from '../deserializable.model';
import { Database } from '../database.model';

export class Unspent extends Database {
  // database
  id: number;
  //...

  // runtime
  //...

  constructor(props: any) {
    super('Unspent');
    this.deserialize(props);
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
