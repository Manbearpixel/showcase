import { Injectable } from '@angular/core';
import { Account } from '~/app/shared/models/identity';
import { StorageService } from '../storage.service';

//...

/**
 * Manages many `Accounts`. Will load `Accounts` from the database on initialization (`init()`)
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class AccountService extends StorageService {
  //...

  constructor(
    private osmClient: OSMClientService,
    private _Preferences: PreferencesService,
    private _Log: LogService
  ) {
    super('AccountService');
    //...
  }

  public async init() {
    return new Promise((resolve, reject) => {
      this.connect()
      .then(this.loadAccounts)
      .then(resolve)
      .catch(err => {
        this.log('Unable to init service');
        console.log(err);
        reject(err);
      });
    });
  }

  /**
   * Attempts to load all accounts available from the table `accounts`
   * and creates an internal list of active accounts.
   */
  public async loadAccounts() {
    if (!await this.dbReady()) {
      return new Error('db_not_open');
    }

    return new Promise(async (resolve, reject) => {
      try {
        const accounts: Account[] = await this.odb.all('');
        this.accounts = accounts.map(account => {
          //...
        });

        this.log(`accounts loaded...${this.accounts.length}`);
        this.emit('ready');
        return resolve(this.accounts);
      } catch (err) {
        this.log('Unable to load accounts...');
        console.log(err);
        return reject(err);
      }
    });
  }

  /**
   * Searches the internal list of `accounts` for a given `username`.
   * 
   * @param username The username of the account
   */
  public findAccount(username: string) {
    return this.accounts.find((a: Account) => a.username === username);
  }

  /**
   * Inserts an `account` into the database for storage and returns an active account.
   * Will first search locally to verify the given account exists.
   * 
   * @param account The account with a username and index
   */
  public async createAccount(account: Account): Promise<any> {
    if (!await this.dbReady()) {
      return false;
    }

    return new Promise((resolve, reject) => {
      if (this.accounts.find(a => a.username === account.username)) {
        return reject(new Error(`Account (${account.username}) already exists`));
      }

      this.odb.execSQL('', [
        //...
      ])
      .then((id: number) => {
        //...

        return resolve(account);
      })
      .catch(reject);
    });
  }

  /**
   * Creates an Account based on a given `mnemonic` and `bip44_index` combination.
   * //...
   */
  public async createAccountFromMnemonic(mnemonic: string, bip44_index: number): Promise<any> {
    if (!await this.dbReady()) {
      return false;
    }

    this.log('Creating from mnemonic...');
    //...

    return this.createAccount(new Account({
      //...
    }));
  }

  /**
   * //...
   */
  public async registerAccount(...): Promise<any> {
    this.log(`Attempt to register ${account.username}`);
    this.emit('onRegisterNewAccount');

    if (!account || !client) return false;
    if (!account.username.length) return false;
    if (account.registered) return true;

    return new Promise(async (resolve, reject) => {
      try {
        const registrationBundle = {
          //...
        };

        //...

        await account.save();
        await client.save();

        account.emit('registered');
        this.emit('registerNewAccountSuccess');
        return resolve(true);
      } catch (err) {
        //...
      }
    });
  }

  public async ___purge() {
    //...
  }
}
