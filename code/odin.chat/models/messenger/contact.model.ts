import { Database } from '../database.model';
import { Message } from './message.model';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { fromObjectRecursive, Observable, fromObject } from 'tns-core-modules/data/observable/observable';

export class Contact extends Database {
  // db
  //...

  // local
  //...

  constructor(props?: any) {
    super('Contact');
    //...
  }

  deserialize(input?: any) {
    Object.assign(this, input);
    return this;
  }

  public async loadMessages() {
    //...

    const messages = await this.getMessages();
    while (messages.length > 0) {
      const message = messages.shift();
      this.messageStream.next(new Message(message));
      this.oMessages$.push(fromObject(message));
      this.msgKeys.push(message.key);
    }

    this.log(`loaded messages for [${this.username}] ... Total [${this.msgKeys.length}]`);
    return this;
  }

  public get messages$() {
    return this.messageStream.asObservable();
  }

  public async getMessages() {
    if (!await this.dbReady()) {
      this.log(`failed to pull messages for [${this.username}] – db not active`);
      return [];
    }

    return await this.db.all('', this.username);
  }

  public async saveMessage(message: Message): Promise<Message> {
    if (!await this.dbReady()) {
      this.log(`db not active – Unable to store message`);
      return message;
    }

    this.log(`add message ${message.message} ${message.status}`);
    //...

    const messageId = await this.db.execSQL('', [
      //...
    ]);

    //...

    await this.save();
    message.db = this.db;
    return message;
  }

  public async updateMessage(message: Message): Promise<Message> {
    if (!await this.dbReady()) {
      this.log(`db not active – Unable to update message`);
      return message;
    }

    this.log(`update message [key=${message.key}]`);

    // close any previous db connections, add ours
    message.dbClose();
    message.db = this.db;

    const msgIndex = this.msgKeys.findIndex(k => message.key === k);
    if (msgIndex >= 0) {
      this.oMessages$.setItem(msgIndex, fromObject(message));

      await message.save();
      return message;
    } else {
      return message;
    }
  }

  /**
   * 
   * @param {boolean} status Sets whether or not there is a new message for this contact
   */
  public async setUnread(status): Promise<Contact> {
    this.unread = status;
    return this;
  }

  /**
   * 
   * @param {number} lastContacted Sets the last contacted (timestamp) for a contact
   */
  public async setLastContacted(lastContacted): Promise<Contact> {
    this.last_contacted = lastContacted;
    return this;
  }

  /**
   * Executes a SQL `UPDATE` on the current Account user saving the current account back to the table.
   */
  public async save(): Promise<any> {
    if (!await this.dbReady()) {
      this.log(`contact [${this.username}] not saved – db not active`);
      return false;
    }

    return new Promise((resolve, reject) => {
      this.db.execSQL('', [
        //...
      ])
      .then((updated: number) => {
        if (updated) {
          this.log(`#${this.username} UPDATED`);
        } else {
          this.log(`#${this.username} NOT UPDATED`);
        }

        return resolve(updated);
      })
      .catch(reject);
    });
  }
}
