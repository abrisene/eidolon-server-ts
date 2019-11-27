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
import { asyncForEach, jsonTryParse } from '../utilities';
import { getServerUrl } from './utilities.config';

dotenv.config();

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

export class Config extends EventEmitter {
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
        hostname: process.env.HOSTNAME,
        corsUrls: jsonTryParse(process.env.CORS_URLS), // TODO: Need to properly configure CORS
        port: process.env.PORT || 8000,
        useHttps: process.env.HTTPS === 'true', // TODO: Need to properly configure https.
      },
      uris: {
        host: getServerUrl(),
        client: process.env.CLIENT_URL,
        logo: process.env.LOGO_URL || `${getServerUrl()}/static/images/app_logo.png`,
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

    console.log('\nManifest:');
    console.log(this._manifest);

    return true;
  }

  /**
   * Returns a public key.
   * @param key The key to return.
   */
  public getPublicKey(key: string): string | number {
    return this._publicKeys[key];
  }

  /**
   * Sets a public key.
   * @param key   The key to set.
   * @param value The value to set the key to.
   */
  public setPublicKey(key: string, value: string | number) {
    this._publicKeys[key] = value;
  }

  /**
   * Returns a private key.
   * @param key The key to return.
   */
  public getPrivateKey(key: string): string | number {
    return this._privateKeys[key];
  }

  /**
   * Sets a private key.
   * @param key   The key to set.
   * @param value The value to set the key to.
   */
  public setPrivateKey(key: string, value: string | number) {
    this._privateKeys[key] = value;
  }

  /**
   * Returns a config.
   * @param key The key of the config to return.
   */
  public getConfig(key: string): IConfig {
    return this._configs[key] || undefined;
  }

  /**
   * Sets the value of a key within the configs and adds it to the manifest.
   * If one does not already exist, a new one will be created.
   * @param key      The key of the config to be set.
   * @param value    The dictionary that the config should be set to.
   * @param category The category that the config should be listed under in the manifest.
   */
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
