import { Database } from '../database.model';
import { Transaction } from './transaction.model';
import * as moment from 'moment';

export class Address extends Database {
  // database
  id: number;
  //...

  constructor(props?: any) {
    super('Address');
    
    //...

    this.deserialize(props);
  }

  deserialize(input?: any) {
    if (!input || typeof input !== 'object') return this;

    //...

    Object.assign(this, input);
    return this;
  }

  serialize() {
    return {
      id: this.id,
      //...
    };
  }

  /**
   * Executes a SQL `UPDATE` on the current Account user saving the current account back to the table.
   */
  public async save(): Promise<any> {
    if (!await this.dbReady()) {
      return false;
    }

    this.log(`saving #${this.id} ${this.address}... then:${this.last_updated} now:${Number(moment().format('x'))}`);

    const updated = await this.db.execSQL('', [
      //...

      this.id
    ]);

    this.log(`account [${this.address}] updated (${updated})`);
    return updated;
  }

  /**
   * Searches internally for a matching wallet and returns it as a new `Wallet` instance.
   * Returns `null` otherwise.
   * 
   * @param bip44 The wallet BIP44 Path
   * @param account_bip44 (optional) An account BIP44 Path
   */
  static async FindByAddress(addressStr: string, wallet_id?: number): Promise<Address|null> {
    let address = new Address();
    if (!await address.dbReady()) {
      throw new Error('Unable to connect to db');
    }
    
    //...

    const matchingAddress = await address.db.get(sql, (!isNaN(wallet_id)) ? [addressStr, wallet_id] : [addressStr]);
    if (!matchingAddress) return null;

    address.log(`FindByAddress – Found match id:[${matchingAddress.id}] walletId:[${}] bip44:[${}]`);
    address.deserialize(matchingAddress);
    return address;
  }

  /**
   * Attempts to insert a new `Address` internally. Requires `input` have at least an `address`, and
   * `wallet_id`
   * 
   * After validation, it will check if the provided address already exists. If it does,
   * it will merge the existing address with the provided `input` and then execute a `save()`.
   * 
   * If it does not exist, a new one will be inserted.
   * 
   * @async
   * @function Create
   * @static
   * @param input (optional) The transaction input, should match properties of a `Transaction`
   * @returns {Promise<Transaction>}
   */
  static async Create(input?: any): Promise<Address> {
    const address = new Address(input);
    if (!await address.dbReady()) {
      throw new Error('Unable to connect to db');
    }

    //...

    const matchingAddress = await Address.FindByAddress(address.address, address.wallet_id);
    if (matchingAddress) {
      address.log(`[${address.address}] already saved, merging idA:${address.id} idB:${matchingAddress.id}`);
      matchingAddress.deserialize(address);
      await matchingAddress.save();
      return matchingAddress;
    } else {
      //...

      const addressId = await address.db.execSQL('', [
        //...
      ]);

      address.id = addressId;
      address.log(`Stored [${address.address}] with id:${address.id}`);
    }

    return address;
  }

  public async upsertTransaction(transaction: Transaction) {
    if (!this.db || !this.db.isOpen()) {
      return false;
    }

    const exists = await this.db.get('', [
      //...
    ]);

    if (!exists) {
      try {
        return await this.db.execSQL('', [
          //...
        ]);
      } catch (err) {
        this.log(`Unable to insert txid(${transaction.txid}) into address(${this.address})`);
        console.log(err);
        return false;
      }
    } else {
      try {
        if (await this.db.execSQL('', [
          //...
        ])) {
          return true;
        } else {
          throw new Error(`txid(${transaction.txid}) NOT UPDATED`);
        }
      } catch (err) {
        this.log(`Unable to update txid(${transaction.txid}) for address(${this.address})`);
        console.log(err);
        return false;
      }
    }
  }

  public async getTransactions() {
    if (!this.db || !this.db.isOpen()) {
      return [];
    }
    
    return await this.db.all('', 
      //...
    );
  }
}
