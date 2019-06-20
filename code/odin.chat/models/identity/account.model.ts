import { Database } from '../database.model';
import { Message } from '../messenger/message.model';
import { Contact } from '../messenger';
import { SignalAddress, SignedPreKey, PublicPreKey, PreKeyBundle, SignalClientContact } from '../signal';
import { Client } from '../messenger/client.model';
//...
export interface IRemoteContact {
  address: SignalAddress;
  //...
}

export class RemoteMessagePayload {
  //...
  timestamp: number;
}

export class RemoteMessage {
  //...
}

export class RemoteMessages {
  //...
}

export class RemoteKeyCount {
  //...
}

class ProcessError extends Error {
  constructor(message: string) {
    super(message); // (1)
    this.name = "ProcessError"; // (2)
  }
}

/**
 * The Account is the primary parent of the ODIN Application modules. There can be
 * many accounts under one identity, and every account has related contacts, messages,
 * wallets, and transactions.
 */
export class Account extends Database {
  // database
  //...

  // runtime
  //...

  constructor(props?: any) {
    super('Account');
  }

  deserialize(input: any) {
    if (!input) return this;

    //...
    
    Object.assign(this, input);
    return this;
  }

  serialize() {
    return {
      //...
      registered: this.registered
    };
  }

  public async loadContacts() {
    return new Promise(async (resolve, reject) => {
      if (!this.dbReady()) {
        this.log(`db not ready, can't load contacts for account ${this.username}`);
        return resolve([]);
      }

      const contacts: Contact[] = await this.db.all('',
        //...
      );
    
      while (contacts.length > 0) {
        const contact: Contact = new Contact(contacts.shift());
        //...
      }
      
      return resolve(this.contacts);
    });
  }

  /**
   * Checks for the existence of `contactIdentity` within locally stored friend cache.
   * 
   * @param contactIdentity 
   */
  hasFriend(username: string): boolean {
    let index = this.contacts.findIndex((c: Contact) => c.username === username);
    return !!(index >= 0);
  }

  /**
   * Adds a `remoteContact` to the local client's friend list. Will check if contact
   * exists already.
   * 
   * @param remoteContact 
   * @param displayName 
   */
  public async addFriend(newContact: any, remoteContact: IRemoteContact): Promise<boolean> {
    this.log(`Add friend [${newContact.username}]`);

    if (this.hasFriend(newContact.username)) {
      throw new Error('ContactExists');
    }

    if (typeof newContact.displayName === 'undefined') newContact.displayName = '';

    const contact: Contact = new Contact({
      //...
    })

    try {
      await this.client.storeContact(remoteContact);

      if (this.client.signalClient.hasSession(contact.username)) {
        await this.storeContact(contact);

        contact.db = this.db;
        await contact.loadMessages();
        this.contacts.push(contact);
        return true;
      } else {
        this.log(`Failed Signal Store Contact check`);
        return false;
      }
    } catch (err) {
      this.log(`Failed to store contact [${newContact.username}]`);
      console.log(err);
      return false;
    }
  }

  public findContact(username: string) {
    return this.contacts.find((c: Contact) => c.username === username);
  }

  /**
   * @todo Compare with Client.Model.StoreContact
   * 
   * @param contact 
   */
  public async storeContact(contact: Contact) {
    if (!await this.dbReady()) {
      return false;
    }

    return await this.db.execSQL('', [
      //...
    ]);
  }

  public async countTotalMessages() {
    if (!await this.dbReady()) {
      return 0;
    }

    const query = await this.db.get('',
      //...
    );
    return query["count(message)"];
  }

  public async getMessages() {
    if (!await this.dbReady()) {
      return [];
    }
    
    return await this.db.all('',
      //...
    );
  }

  /**
   * Executes a SQL `UPDATE` on the current Account user saving the current account back to the table.
   */
  public async save(): Promise<any> {
    if (!await this.dbReady()) {
      return false;
    }

    this.log('ATTEMPTING TO SAVE');
    this.dir(this.serialize());

    const updated = await this.db.execSQL('', [
      //...
    ]);

    this.log(`account [${this.username}] updated (${updated})`);
    return updated;
  }

  public async fetchRemoteKeyCount(): Promise<any> {
    //...
  }

  public async publishFcmToken(fcmToken: string): Promise<boolean> {
    //...
  }

  public async publishRemoteKeyBundle(): Promise<boolean> {
    //...
  }

  /**
   * Request all available messages from the message server and handle each one
   * individually
   */
  public async fetchRemoteMessages(): Promise<any> {
    //...
  }

  public async sendRemoteMessage(contact: Contact, messageStr: string): Promise<any> {
    //...
  }

  private async publishMessage(messageBundle: any) {
    //...
  }

  private async fetchRemoteBundle(contact: Contact): Promise<IRemoteContact|any> {
    //...
  }

  /**
   * Process a provided `RemoteMessage`. Will make an attempt to decipher it through `decipherMessage()`.
   * After a message is processed (whether successful or not) a request will be made to remove it from
   * the server.
   * 
   * @param remoteMessage The remote message to decipher and handle
   */
  private async handleRemoteMessage(remoteMessage: RemoteMessage) {
    //...
  }

  /**
   * Makes an attempt to decipher a provided `Message` instance. Will first verify the remote sender's
   * details both as a stored contact and a stored session.
   * 
   * In order to verify a remote sender and decipher their message, a call must be made to the server
   * to grab a fresh identity package.
   * 
   * @param message The Message instance that has an encrypted message body
   */
  private async decipherMessage(message: Message): Promise<string> {
    //...
  }

  /**
   * Checks internally if `remoteContact` is a stored friend locally. If not, store their
   * information and save it.
   * 
   * In the future, work could be inserted here to create a list of "unverified contacts" and
   * "verified".
   * 
   * @param remoteContact The remote contact that should be verified within the active account
   */
  private async verifyRemoteContact(remoteContact: IRemoteContact) {
    //...
  }

  /**
   * Checks the `signalClient` if it has an active session or not with the `remoteContact`.
   * In either case, their information is stored and a new session is added. This is due
   * to a known issue where on app reload, their details are not saved properly.
   * 
   * @param remoteContact The remote contact that should be verified though the `signalClient`
   */
  private async verifyRemoteSession(remoteContact: IRemoteContact): Promise<boolean> {
    //...
  }

  /**
   * Attempts to delete a message that is currently stored on the server.
   * 
   * @param message The message to attempt to delete
   */
  private async deleteRemoteMessage(message: Message) {
    //...
  }
}
