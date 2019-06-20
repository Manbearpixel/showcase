import { Database } from '../database.model';
import { Unspent } from './unspent.model';
import { Coin } from '../identity';
import { ReplaySubject } from 'rxjs';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { Transaction } from './transaction.model';
import { fromObjectRecursive, Observable, fromObject } from 'tns-core-modules/data/observable/observable';
import { Address } from './address.model';
import { ElectrumxUnspent } from '../electrumx';

import { ODIN } from '~/app/bundle.odin';
import { Identity } from '../identity/identity.model';

class InvalidAddress extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidAddress';
  }
}

class BalanceLow extends Error {
  constructor(message) {
    super(message);
    this.name = 'BalanceLow';
  }
}

class TransactionFailed extends Error {
  constructor(message) {
    super(message);
    this.name = 'TransactionFailed';
  }
}

export class Wallet extends Database {
  // static
  //...

  // database
  public id: number;
  //...

  // runtime
  public electrumXClient: any;
  //...

  public addresses$: ObservableArray<Address>;
  private addressIds: any[];

  public transactions$: ObservableArray<Transaction>;
  private transactionTableIds: any[];

  public unspent$: ObservableArray<Unspent>;
  private unspentTableIds: any[];

  constructor(props?: any) {
    super('Wallet');
    
    //...

    this.deserialize(props);
  }

  deserialize(input?: any) {
    Object.assign(this, input);
    return this;
  }

  public get transactionsStream$() {
    return this.transactionStream.asObservable();
  }

  public serialize() {
    return {
      id: this.id,
      //...
    };
  }

  public async storeUnspentArr(input: Unspent[]): Promise<Unspent[]> {
    if (!await this.dbReady()) {
      this.log(`failed to store unspent transactions for wallet#${this.id} – db not active`);
      return input;
    }

    try {
      let unspentArr: Unspent[] = [];
      while (input.length) {
        unspentArr.push(await this.upsertUnspent(input.shift()));
      }

      return unspentArr;
    } catch (err) {
      console.log(err);
      return input;
    }
  }

  public async upsertUnspent(unspent: Unspent): Promise<Unspent> {
    if (!await this.dbReady()) {
      this.log(`failed to upsert unspent for wallet#${this.id} – db not active`);
      return unspent;
    }

    const exists = await this.db.get('', [
      //...
    ]);

    try {
      if (exists) {
        const updated = await this.db.execSQL('', [
          //...
        ]);

        if (!updated) this.log(`failed to update unspent: ${unspent.txid}`);
        else this.log(`updated unspent ${unspent.txid}`);
        return unspent;
      } else {
        const unspentId = await this.db.execSQL('', [
          //...
        ]);

        unspent.id = unspentId;
        this.log(`inserted unspent @${unspentId} ${unspent.txid}`);

        return unspent;
      }
    } catch (err) {
      console.log(`Unable to upsert unspent txid(${unspent.txid}) into wallet(${this.id})`);
      console.log(err);
      return unspent;
    }
  }

  public async loadCoinDetails() {
    if (!await this.dbReady()) {
      this.log(`wallet [${this.id}] – db not active`);
      return false;
    }

    this.coin = await this.db.get('', [this.coin_name]);
  }

  public async loadTransactions() {
    this.transactionStream = new ReplaySubject();
    this.transactions$ = new ObservableArray();
    this.transactionTableIds = [];

    const transactions = await this.getTransactions();
    while (transactions.length > 0) {
      //...
    }

    this.log('LoadedTransactions');
    this.log(`loaded transactions for wallet#${this.id}`);
    return this;
  }

  public async getTransactions() {
    if (!await this.dbReady()) {
      this.log(`failed to pull transactions for wallet#${this.id} – db not active`);
      return [];
    }

    return await this.db.all('', 
      //...
    );
  }

  public async getUnspent() {
    if (!await this.dbReady()) {
      this.log(`failed to pull transactions for wallet#${this.id} – db not active`);
      return [];
    }
    
    return await this.db.all('', 
      //...
    );
  }

  public async loadUnspent() {
    this.unspent$ = new ObservableArray();
    this.unspentTableIds = [];

    const unspentArr = await this.getUnspent();
    while (unspentArr.length > 0) {
      //...
    }

    this.emit('LoadedUnspent');
    this.log(`loaded unspent for wallet#${this.id}`);
    return this;
  }

  public async removeUnspent(id: number) {
    if (!await this.dbReady()) {
      this.log(`failed to remove unspent id#${id} for wallet#${this.id} – db not active`);
      return false;
    }

    const deleted = await this.db.execSQL(`DELETE FROM unspent WHERE id=?`, id);
    this.log(`Deleted Unspent ID#${id} (${deleted})`);
    return deleted;
  }

  public async loadAddresses() {
    this.addresses$ = new ObservableArray();
    this.addressIds = [];

    const addresses = await this.getAddresses();
    while (addresses.length > 0) {
      //...
    }

    this.emit('LoadedAddresses');
    this.log(`loaded addresses for wallet#${this.id}`);
    return this;
  }

  public async getAddresses() {
    if (!await this.dbReady()) {
      this.log(`failed to pull transactions for wallet#${this.id} – db not active`);
      return [];
    }

    return await this.db.all('', 
      //...
    );
  }

  public async fetchLastAddress() {
    if (!await this.dbReady()) {
      this.log(`failed to pull transactions for wallet#${this.id} – db not active`);
      return [];
    }

    return await this.db.get('',
      //...
    );
  }

  /**
   * Executes a SQL `UPDATE` on the current Wallet saving the current wallet state
   */
  public async save(): Promise<any> {
    if (!await this.dbReady()) {
      this.log(`wallet [${this.id}] for [${this.coin_name}] not saved – db not active`);
      return false;
    }

    this.log(`saving wallet#${this.id}...`);

    const updated = await this.db.execSQL('', [
      //...
    ]);

    this.log(`wallet [${this.id}] updated (${updated})`);
    return updated;
  }

  /**
   * Returns the internal "change" address for a given `Address.id`.
   * @param addressId 
   */
  public async getChangeAddress(addressId: number) {
    if (!await this.dbReady()) {
      this.log(`failed to get change address for ${addressId} – db not active`);
      throw new Error('bad_connection');
    }

    const externalAddress = await this.db.get('', 
      //...
    );

    const internalAddress = await this.db.get('', 
      //...
    );

    return internalAddress.address;
  }

  /**
   * Inserts a new transaction marked as "Pending" and associates it to this wallet.
   * @param addressId 
   * @param txid 
   * @param value 
   */
  public async insertPendingTransaction(addressId: number, txid: string, value?: number) {
    if (!await this.dbReady()) {
      this.log(`failed to insert pending tx for ${addressId} – db not active`);
      throw new Error('bad_connection');
    }

    const transaction = await Transaction.Create({
      //...
    });

    return transaction;
  }

  public async sendTransaction(electrumXClient: any, address: string, amount: number) {
    try {
      address = address.trim();
      ODIN.address.toOutputScript(address);
    } catch (e) {
      this.emit('TransactionFailed');
      throw new InvalidAddress('failed to build script');
    }

    // make sure known spendables are loaded
    await this.loadUnspent();

    const fee     = (Wallet.TX_FEE * 1e8);
    const value   = parseInt((amount * 1e8).toFixed(0));
    const inputs  = await this.findInputs(value);

    const inputSum    = inputs.reduce((sum, tx) => sum += Number(tx.value), 0);
    const valueTotal  = (fee + value);

    inputs.forEach(input => console.log('Input:', JSON.stringify(input)));

    if (inputSum < valueTotal) {
      this.emit('TransactionFailed');
      throw new BalanceLow(`Wallet balance does not cover total amount to send, balance is short ${(valueTotal- inputSum)/1e8}`);
    }

    const transaction = new ODIN.TransactionBuilder();
    transaction.setVersion(1);

    // add inputs
    // add outputs
    // add change (if any)
    // sign inputs

    //...
  }

  /**
   * Private methods
   */

  /**
   //...
   */
  private unspentPreferredSort(txA: Unspent, txB: Unspent) {
    //...
  };

  /**
   //...
   */
  private async appendMatchingWIF(unspent: Unspent): Promise<Unspent> {
    if (!await this.dbReady()) {
      this.log(`failed to build input package for ${unspent.txid} – db not active`);
      throw new Error('bad_connection');
    }

    const address = await this.db.get('',
      //...
    );

    return (unspent.wif = address.wif) && unspent;
  }

  /**
   * Used for reducing an array of `Unspent` objects to determine the sum
   * of their `value`.
   * @param sum 
   * @param tx 
   */
  private sumUnspentValue(sum: number, tx: Unspent) {
    return sum += tx.value
  }


  /**
   * This will return an array of `Unspent` objects associated to this wallet that
   * is equal to or greater than the provided `amount`.
   * 
   * The `amount` provided should be a "high precision whole number" meaning a value
   * of 1.5 would equal 150000000. (1.5 * 1e8);
   * 
   * @param amount
   */
  private findInputs = async (amount: number) => {
    //...
  }

  /**
   * Static methods
   */

  /**
   //...
   */
  static async FindById(id: number = 0): Promise<Wallet|null> {
    //...
  }

  /**
   * Searches internally for a matching wallet and returns it as a new `Wallet` instance.
   * Returns `null` otherwise.
   * 
   //...
   */
  static async FindByBip44(bip44: number = 0, account_bip44?: number): Promise<Wallet|null> {
    //...
  }

  /**
   * Attempts to insert a new `Wallet` internally. Requires `input` have at least a `coin_name`, `account_bip44`,
   * and `bip44_index`.
   * 
   * After validation, it will check if the provided wallet already exists. If it does,
   * it will merge the existing wallet with the provided `input` and then execute a `save()`.
   * 
   * If it does not exist, a new one will be inserted.
   * 
   * @async
   * @function Create
   * @static
   * @param input (optional) The wallet input, should match properties of a `Wallet`
   * @returns {Promise<Wallet>}
   */
  static async Create(input?: any): Promise<Wallet> {
    const wallet = new Wallet(input);
    if (!await wallet.dbReady()) {
      throw new Error('Unable to connect to db');
    }

    const matchingWallet = await Wallet.FindByBip44(wallet.bip44_index, wallet.account_bip44);
    if (matchingWallet) {
      //...
    }
    else {
      //...
    }

    return wallet;
  }
}
