import { Database } from '../database.model';
import { LibsignalProtocol } from 'nativescript-libsignal-protocol';
import { SignalClientSerialized, SignalClientContact, PreKeyBundle, LocalContact, SignalAddress, SignalClientPreKey, SignalClient } from '../signal';
import { IRemoteContact } from '../identity';

export class Client extends Database {
  // database
  id: number;
  account_username: string; // foreign_key accounts(username)
  //...
  
  // runtime
  signalClient: LibsignalProtocol.Client;

  constructor(props?: any) {
    super('Client');
    //...
  }

  deserialize(input: any) {
    try {
      input.pre_keys = (input.pre_keys && typeof input.pre_keys === 'string')
        ? JSON.parse(input.pre_keys)
        : [];
    } catch (e) { }
    
    Object.assign(this, input);
    return this;
  }

  serialize() {
    return {
      id: this.id,
      //...
    };
  }

  async storePreKeys(preKeys: SignalClientPreKey[]) {
    //...
  }

  /**
   * Creates a new LibsignalProtocol Client. Uses `saveData` to preload the 
   * `hashAccount`, `registrationId`, and `deviceId`.
   * 
   * Additionally, you can pass three optional parameters to restore a previously
   * used Client instance.
   * 
   * @param identityKeyPair 
   * @param signedPreKey 
   * @param preKeys 
   */
  async loadSignalClient(): Promise<SignalClient> {
    //...
  }

  private stringify(value) {
    if (!value || value.length === 0) return '';
    try {
      return  (typeof value === 'string')
                ? value
                : JSON.stringify(value);
    } catch (e) {
      return '';
    }
  }

  /**
   * Executes a SQL `UPDATE` on the current Account user saving the current account back to the table.
   */
  public async save(): Promise<any> {
    if (!await this.dbReady()) {
      return false;
    }

    return new Promise((resolve, reject) => {
      this.db.execSQL('', [
        //...
      ])
      .then((updated: number) => {
        if (updated) {
          this.log(`#${this.id} UPDATED`);
        } else {
          this.log(`#${this.id} NOT UPDATED`);
        }

        return resolve(updated);
      })
      .catch(reject);
    });
  }

  /**
   * @todo Compare with Account.Model.StoreContact
   * 
   * Stores a contact locally by adding a session to the `SignalClient` instance
   * and adding them to the local cache of friends (it non-existent).
   * 
   * @param contact 
   * @param preKeyBundle 
   */
  public async storeContact(remoteContact: IRemoteContact): Promise<boolean> {
    //...
  }



  /**
   * Converts a RemoteContact package into a `PreKeyBundle` which will be used
   * throughout the `SignalClient` session.
   * 
   * @param remoteContact 
   */
  public buildBundlePackage(remoteContact: IRemoteContact): PreKeyBundle {
    return {
      //...
    }
  }
}
