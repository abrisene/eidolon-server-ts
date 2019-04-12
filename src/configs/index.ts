/*
 * configs/index.ts
 * Configuration Index
 */

/**
 * Module Dependencies
 */

import dotenv from 'dotenv';
import EventEmitter from 'events';
import utilities from '../utilities';

import configMongoDB from './config.db.mongodb';
import configNeo4j from './config.db.neo4j';
import configRedis from './config.db.redis';
// import configSql from './config.db.sql';

import configMailgun from './config.mail.mailgun';

import configAbly from './config.pubsub.ably';
import configPubNub from './config.pubsub.pubnub';

import configTwilio from './config.sms.twilio';

dotenv.config();
const { jsonTryParse } = utilities;

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

const configMap = {
  // jwt: './config.auth.jwt',
  mongodb: './config.db.mongodb',
  neo4j: './config.db.neo4j',
  redis: './config.db.redis',
  // sql: './config.db.sql',
  mailgun: './config.mail.mailgun',
  // stripe: './config.payment.stripe',
  ably: './config.pubsub.ably',
  pubnub: './config.pubsub.pubnub',
  twilio: './config.sms.twilio',
  // google: './config.social.google',
  // facebook: './config.social.facebook',
  // airtable: './config.spreadsheet.airtable',
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
        corsUrls: jsonTryParse(process.env.CORS_URLS),
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
    await configMongoDB();
    await configNeo4j();
    await configRedis();
    await configMailgun();
    await configAbly();
    await configPubNub();
    await configTwilio();
    this._status = 'initialized';
    this.emit('initialized');
    return true;
  }

  public getPublicKey(key: string): string | number | undefined {
    return this._publicKeys[key];
  }

  public setPublicKey(key: string, value: string | number) {
    this._publicKeys[key] = value;
  }

  public getPrivateKey(key: string): string | number | undefined {
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
