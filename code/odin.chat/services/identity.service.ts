import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { Identity } from '../models/identity/identity.model';
import { ODIN } from '~/app/bundle.odin';
import { identity } from 'rxjs';
import { AccountService } from './account.service';
import { Account } from '../models/identity';
import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdentityService extends StorageService {
  // init
  //...
  
  // runtime
  //...
  constructor(
    private Account: AccountService
  ) {
    super('IdentityService');

    //...
  }

  /**
   * Initializes the `IdentityService` singleton by loading
   * the application identity stored within ApplicationSettings.
   */
  public async init() {
    return new Promise((resolve, reject) => {
      this.loadIdentity()
      .then(resolve)
      .catch(err => {
        this.log('Unable to init service');
        console.log(err);
        reject(err);
      });
    });
  }

  /**
   * //...
   */
  private async loadIdentity() {
    return new Promise(async (resolve, reject) => {
      //...
    });
  }

  /**
   * //...
   */
  public async setActiveAccount(accountIndex?: number) {
    if (typeof accountIndex === 'undefined' || isNaN(Number(accountIndex))) {
      accountIndex = this.identity.activeAccountIndex;
    } else {
      accountIndex = Number(accountIndex);
    }

    this.log(`setActiveAccount (${accountIndex})`);
    
    if (this.Account.accounts[accountIndex]) {
      //...
    } else {
      this.log(`Account #${accountIndex} not found, activeAccount not set`);
    }
  }

  public getActiveAccount(): Account {
    if (!this.activeAccount) {
      this.setActiveAccount(0);
    }

    return this.activeAccount;
  }

  /**
   * //...
   */
  storeIdentity(identity: Identity) {
    //...
  }

  /**
   * //...
   */
  fetchIdentity() {
    //...
  }

  /**
   * //...
   */
  async saveMasterseed(masterSeed: any) {
    this.log('save masterseed');

    return new Promise((resolve, reject) => {
      //...
    });
  }

  public async ___purge() {
    //...
  }
}
