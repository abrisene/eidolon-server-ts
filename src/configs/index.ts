/*
 * configs/index.ts
 * Configuration Index
 */

/**
 * Module Dependencies
 */

import dotenv from 'dotenv';
import EventEmitter from 'events';
import fs from 'fs';
import utilities from '../utilities';

dotenv.config();
const { asyncForEach, jsonTryParse } = utilities;

/*
 * Interfaces
 */

interface IKeyStore {
  [propName: string]: string | number;
}

interface IConfigStore {
  [propName: string]: IConfig;
}

interface IConfig {
  [propName: string]: any;
}

/*
 * Constants
 */

// This is not currently used for anything.
const configMap = {
  // jwt: './config.auth.jwt',
  mongodb: './config.db.mongodb',
  neo4j: './config.db.neo4j',
  redis: './config.db.redis',
  // sql: './config.db.sql',
  mailgun: './config.mail.mailgun',
  stripe: './config.payment.stripe',
  ably: './config.pubsub.ably',
  pubnub: './config.pubsub.pubnub',
  twilio: './config.sms.twilio',
  // google: './config.social.google',
  // facebook: './config.social.facebook',
  airtable: './config.spreadsheet.airtable',
};

/*
 * Module Exports
 */

class Config extends EventEmitter {
  protected _status: string;
  protected _publicKeys: IKeyStore;
  protected _privateKeys: IKeyStore;
  protected _configs: IConfigStore;
  constructor() {
    super();
    this._status = 'uninitialized';

    this._publicKeys = {};
    this._privateKeys = {};

    this._configs = {
      environment: {
        appName: process.env.APP_NAME || '',
        env: process.env.NODE_ENV || 'production',
      },
      server : {
        corsUrls: jsonTryParse(process.env.CORS_URLS), // TODO: Need to properly configure CORS
        port: process.env.PORT || 8000,
      },
    };
  }

  get status() {
    return this._status;
  }

  get publicKeys() {
    return this._publicKeys;
  }

  get privateKeys() {
    return this._privateKeys;
  }

  public async init() {
    const configs = fs.readdirSync(__dirname).filter(i => i.match(/^config.*.js$/));
    await asyncForEach(configs, async (loc) => {
      const init = await import(`./${loc}`);
      await init.default();
    });

    this._status = 'initialized';
    this.emit('initialized');
    return true;
  }

  public getPublicKey(key: string): string | number {
    return this._publicKeys[key];
  }

  public setPublicKey(key: string, value: string | number) {
    this._publicKeys[key] = value;
  }

  public getPrivateKey(key: string): string | number {
    return this._privateKeys[key];
  }

  public setPrivateKey(key: string, value: string | number) {
    this._privateKeys[key] = value;
  }

  public getConfig(key: string): IConfig {
    return this._configs[key] || undefined;
  }

  public addConfig(key: string, value: IConfig) {
    if (this._configs[key] !== undefined) {
      this._configs[key] = { ...this._configs[key], ...value };
    } else {
      this._configs[key] = { ...value };
    }
  }
}

export default new Config();
