import { Injectable } from '@angular/core';
import { Coin } from '~/app/shared/models/identity';
import { StorageService } from '../storage.service';
const SqlLite = require('nativescript-sqlite');

@Injectable({
  providedIn: 'root'
})
export class CoinService extends StorageService {
  //...

  constructor() {
    super('CoinService');
    //...
  }

  public async init() {
    return new Promise((resolve, reject) => {
      this.connect()
      .then(this.loadCoins)
      .then(resolve)
      .catch(err => {
        this.log('Unable to init service');
        console.log(err);
        reject(err);
      });
    });
  }

  private async loadCoins() {
    if (!await this.dbReady()) {
      return new Error('db_not_open');
    }

    return new Promise(async (resolve, reject) => {
      try {
        const coins: Coin[] = await this.odb.all('');
        this.coins = coins.map(coin => {
          //...
        });

        this.log(`coins loaded...${this.coins.length}`);
        return resolve(this.coins);
      } catch (err) {
        this.log('Unable to load coins...');
        console.log(err);
        return reject(err);
      }
    });
  }

  public async createCoin(coin: Coin) {
    if (!await this.dbReady()) {
      return new Error('db_not_open');
    }

    return new Promise((resolve, reject) => {
      if (this.coins.find(c => c.name === coin.name)) {
        return reject(new Error(`Coin (${coin.name}) already exists`));
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

  public defaultCoinDetails() {
    return this.coins.find(c => !!(c.is_default === true));
  }
}
