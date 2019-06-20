import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { Client } from '../models/messenger/client.model';
import { LibsignalProtocol } from 'nativescript-libsignal-protocol';
import { SignalClient } from '../models/signal';
import { device } from 'tns-core-modules/platform';
import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends StorageService {
  //...

  constructor() {
    super('ClientService');
    //...
  }

  public async init() {
    return new Promise((resolve, reject) => {
      this.connect()
      .then(this.loadClients)
      .then(resolve)
      .catch(err => {
        this.log('Unable to init service');
        console.log(err);
        reject(err);
      });
    });
  }

  private async loadClients() {
    if (!this.dbReady()) return new Error('db_not_open');
    return new Promise(async (resolve, reject) => {
      try {
        const clients: Client[] = await this.odb.all('');
        this.clients = clients.map(client => {
          //...
        });

        this.log(`clients loaded...${this.clients.length}`);
        return resolve(this.clients);
      } catch (err) {
        this.log('Unable to load clients...');
        console.log(err);
        return reject(err);
      }
    });
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
   * //...
   */
  public async createClient(client: Client): Promise<any> {
    if (!this.dbReady()) return false;

    return new Promise((resolve, reject) => {
      if (this.findClient(client.account_username)) {
        return reject(new Error(`Client (${client.account_username}) already exists`));
      }

      if (environment.mockIdentity === true) {
        //...
      } else {
        //...
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

  public findClient(username: string) {
    return this.clients.find((c: Client) => c.account_username === username);
  }

  public findClientById(id: number) {
    return this.clients.find((c: Client) => c.id === id);
  }

  public fetchClient(username: string) {
    if (!this.dbReady()) return false;
    return this.odb.get('',
      //...
    );
  }

  public async ___purge() {
    //...
  }
}
