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

interface IConfigManifest {
  [propName: string]: string[];
}

/*
 * Constants
 */

/*
 * Module Exports
 */

class Config extends EventEmitter {
  protected _status: string;
  protected _manifest: IConfigManifest;
  protected _configs: IConfigStore;
  protected _publicKeys: IKeyStore;
  protected _privateKeys: IKeyStore;
  constructor() {
    super();
    this._status = 'uninitialized';

    this._manifest = { core: ['environment', 'server', 'uris'], keys: ['publicKeys', 'privateKeys'] };

    this._configs = {
      environment: {
        appName: process.env.APP_NAME || '',
        env: process.env.NODE_ENV || 'production',
      },
      server: {
        corsUrls: jsonTryParse(process.env.CORS_URLS), // TODO: Need to properly configure CORS
        port: process.env.PORT || 8000,
      },
      uris: {
        host: process.env.SERVER_URL,
        client: process.env.CLIENT_URL,
      },
    };

    this._publicKeys = {};
    this._privateKeys = {};
  }

  get status() {
    return this._status;
  }

  get manifest() {
    return this._manifest;
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
    console.log(this._manifest);
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

  public addConfig(key: string, value: IConfig, category?: string) {
    // Add to configs
    if (this._configs[key] !== undefined) {
      this._configs[key] = { ...this._configs[key], ...value };
    } else {
      this._configs[key] = { ...value };
    }
    // Add to manifest
    if (category !== undefined) {
      if (this._manifest[category] === undefined) this._manifest[category] = [];
      this._manifest[category].push(key);
    }
  }
}

export default new Config();
