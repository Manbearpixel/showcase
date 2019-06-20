import { Deserializable } from '../deserializable.model';
import { Database } from '../database.model';

export class Transaction extends Database {
  // static
  static TRANSACTION_RECEIVED = 'received';
  //...

  // database
  id: number;
  //...

  constructor(props?: any) {
    super('Transaction');
    
    //...
    
    this.deserialize(props);
  }

  deserialize(input?: any) {
    Object.assign(this, input);
    return this;
  }

  serialize() {
    return {
      id: this.id,
      //...
    };
  }

  public isTypePending() {
    return this.type === Transaction//...
  }

  public isTypeReceived() {
    return this.type === Transaction//...
  }

  public isTypeSent() {
    return this.type === Transaction//...
  }

  public isTypeSelf() {
    return this.type === Transaction//...
  }

  /**
   * Executes a SQL `UPDATE` on the current Account user saving the current account back to the table.
   */
  public async save(): Promise<any> {
    if (!await this.dbReady()) {
      return false;
    }

    // this.log('ATTEMPTING TO SAVE');
    this.log(`saving id:[${this.id}] tx:[${this.txid}]...`);
    this.dir(this.serialize());

    const updated = await this.db.execSQL('', [
      //...
    ]);

    this.log(`transaction id:[${this.id}] tx:[${this.txid}] – updated (${updated})`);
    return updated;
  }

  /**
   * Checks if the provided `type` is a valid internal transaction type
   * @param type The type of transaction to validate
   */
  static IsValidType(type: string) {
    if (!type || !type.length) return false;
    return [Transaction,//...
            Transaction,//...
            Transaction,//...
            Transaction,//...
            Transaction].includes(type);
  }

  /**
   * Searches internally for a matching transaction and returns it as a new `Transaction` instance.
   * Returns `null` otherwise.
   * 
   * //...
   */
  static async Find(txid: string, address_id: number): Promise<Transaction|null> {
    let transaction = new Transaction();
    if (!await transaction.dbReady()) {
      throw new Error('Unable to connect to db');
    }
    
    const matchingTransaction = await transaction.db.get('', [
      //...
    ]);

    if (!matchingTransaction) return null;

    transaction.log(`Found match for [${matchingTransaction.txid}]`);
    transaction.deserialize(matchingTransaction);
    return transaction;
  }

  /**
   * Attempts to insert a new `Transaction` internally. Requires `input` have at least a `txid`, `address_id`,
   * and `type`. The `type` will be validated against `IsValidType()`.
   * 
   * After validation, it will check if the provided transaction already exists. If it does,
   * it will merge the existing transaction with the provided `input` and then execute a `save()`.
   * 
   * If it does not exist, a new one will be inserted.
   * 
   * @async
   * @function Create
   * @static
   * @param input (optional) The transaction input, should match properties of a `Transaction`
   * @returns {Promise<Transaction>}
   */
  static async Create(input?: any): Promise<Transaction> {
    const transaction = new Transaction(input);
    if (!await transaction.dbReady()) {
      throw new Error('Unable to connect to db');
    }

    if (!Transaction.IsValidType(transaction.type)) {
      throw new Error('Unable to create address, missing transaction type!');
    } else if (!transaction.address_id) {
      throw new Error('Unable to create address, missing address id!');
    } else if (!transaction.txid) {
      throw new Error('Unable to create address, missing txid!');
    }

    const matchingTransaction = await Transaction.Find(transaction.txid, transaction.address_id);
    if (matchingTransaction) {
      //...
    }
    else {
      const transactionId = await transaction.db.execSQL('', [
        //...
      ]);

      transaction.id = transactionId;
      transaction.log(`Stored [${transaction.txid}] with id:${transaction.id}`);
    }

    return transaction;
  }
}
