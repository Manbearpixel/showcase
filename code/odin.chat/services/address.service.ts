import { Injectable } from '@angular/core';
import { Address, Wallet } from '~/app/shared/models/wallet';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService extends StorageService {
  //...

  constructor() {
    super('AddressService');
    //...
  }

  public async init() {
    return new Promise((resolve, reject) => {
      this.connect()
      .then(this.loadAddresses)
      .then(resolve)
      .catch(err => {
        this.log('Unable to init service');
        console.log(err);
        reject(err);
      });
    });
  }

  private async loadAddresses() {
    if (!await this.dbReady()) {
      return new Error('db_not_open');
    }

    return new Promise(async (resolve, reject) => {
      try {
        const addresses: Address[] = await this.odb.all('');
        this.addresses = addresses.map(address => {
          //...
        });

        this.log(`accounts loaded...${this.addresses.length}`);
        return resolve(this.addresses);
      } catch (err) {
        this.log('Unable to load addresses...');
        console.log(err);
        return reject(err);
      }
    });
  }

  public async createAddress(address: Address) {
    if (!await this.dbReady()) {
      return new Error('db_not_open');
    }

    return new Promise((resolve, reject) => {
      if (this.addresses.find(a => a.address === address.address)) {
        return reject(new Error(`Address (${address.address}) already exists`));
      }

      this.odb.execSQL('', [
        //...
      ])
      .then((id: number) => {
        //...
      })
      .catch(reject);
    });
  }

  public findAddress(address) {
    return this.addresses.find(a => a.address === address);
  }

  public async ___purge() {
    //...
  }
}
