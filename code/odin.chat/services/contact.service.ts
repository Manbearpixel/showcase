import { Injectable } from '@angular/core';
import { Contact } from '~/app/shared/models/messenger/';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends StorageService {
  //...

  constructor() {
    super('ContactService');
    //...
  }

  public async init() {
    return new Promise((resolve, reject) => {
      this.connect()
      .then(this.loadContacts)
      .then(resolve)
      .catch(err => {
        this.log('Unable to init service');
        console.log(err);
        reject(err);
      });
    });
  }

  private async loadContacts() {
    if (!await this.dbReady()) {
      return new Error('db_not_open');
    }

    return new Promise(async (resolve, reject) => {
      try {
        // this.contacts = [];

        const contacts: Contact[] = await this.odb.all('');
        while (contacts.length > 0) {
          //...
        }

        this.log(`contacts loaded...${this.contacts.length}`);
        return resolve(this.contacts);
      } catch (err) {
        this.log('Unable to load contacts...');
        console.log(err);
        return reject(err);
      }
    });
  }

  public async createContact(contact: Contact) {
    if (!await this.dbReady()) {
      return new Error('db_not_open');
    }

    return new Promise((resolve, reject) => {
      if (this.contacts.find(c => c.username === contact.username)) {
        return reject(new Error(`Contact (${contact.username}) already exists`));
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

  public findContact(username: string, account_bip44?: number) {
    //...
  }

  public async ___purge() {
    //...
  }
}
