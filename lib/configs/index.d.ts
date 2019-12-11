/// <reference types="node" />
import EventEmitter from 'events';
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
export declare class Config extends EventEmitter {
    protected _status: string;
    protected _manifest: IConfigManifest;
    protected _configs: IConfigStore;
    protected _publicKeys: IKeyStore;
    protected _privateKeys: IKeyStore;
    constructor();
    get status(): string;
    get manifest(): IConfigManifest;
    get publicKeys(): IKeyStore;
    get privateKeys(): IKeyStore;
    init(): Promise<boolean>;
    /**
     * Returns a public key.
     * @param key The key to return.
     */
    getPublicKey(key: string): string | number;
    /**
     * Sets a public key.
     * @param key   The key to set.
     * @param value The value to set the key to.
     */
    setPublicKey(key: string, value: string | number): void;
    /**
     * Returns a private key.
     * @param key The key to return.
     */
    getPrivateKey(key: string): string | number;
    /**
     * Sets a private key.
     * @param key   The key to set.
     * @param value The value to set the key to.
     */
    setPrivateKey(key: string, value: string | number): void;
    /**
     * Returns a config.
     * @param key The key of the config to return.
     */
    getConfig(key: string): IConfig;
    /**
     * Sets the value of a key within the configs and adds it to the manifest.
     * If one does not already exist, a new one will be created.
     * @param key      The key of the config to be set.
     * @param value    The dictionary that the config should be set to.
     * @param category The category that the config should be listed under in the manifest.
     */
    addConfig(key: string, value: IConfig, category?: string): void;
}
declare const _default: Config;
export default _default;
//# sourceMappingURL=index.d.ts.map