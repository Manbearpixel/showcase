import { Deserializable } from '../deserializable.model';
import { Database } from '../database.model';

export class RemoteMessagePayload {
  //...
}

export class RemoteMessage {
  key: string;
  value: RemoteMessagePayload;
}

export class RemoteMessages {
  status: string;
  messages: RemoteMessage[];
}

export class Message extends Database {
  // database
  //...

  /**
   * Message
   * @property {string} key
   //...
   */
  constructor(props: any) {
    super('Message');

    //...
    this.deserialize(props);
  }
  
  deserialize(input: any) {
    if (!input || typeof input !== 'object') return this;
    
    //...

    Object.assign(this, input);
    return this;
  }

  getMessage() {
    return //...
  }

  isUnread() {
    return //...
  }

  setMessage(message: string) {
    if (!message) return;
    this.message = message;
  }

  static importRemoteMessage(accountBip44Index: number, messageKey: string, payload: RemoteMessagePayload) {
    return new this({
      //...
    });
  }

  /**
   * Executes a SQL `UPDATE` on the current Account user saving the current account back to the table.
   */
  public async save(): Promise<any> {
    if (!await this.dbReady()) {
      this.log(`message [${this.message}] not saved – db not active`);
      return false;
    } else if (!this.id) {
      this.log(`message [${this.message}] not saved - id missing`);
      return false;
    }

    return new Promise((resolve, reject) => {
      this.db.execSQL('', [
        //...
      ])
      .then((updated: number) => {
        if (updated) {
          this.log(`#${this.message} UPDATED`);
        } else {
          this.log(`#${this.message} NOT UPDATED`);
        }

        return resolve(updated);
      }).catch(reject);
    });
  }
}
