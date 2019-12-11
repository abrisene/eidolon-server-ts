/**
 * Module Dependencies
 */
import Configs from './configs';
import Server from './Server';
import * as models from './models';
import * as services from './services';
import * as utils from './utilities';
import { middleware } from './routes';
/**
 * Interfaces
 */
export interface IBootstrapResponse {
    Configs: typeof Configs;
    init?: typeof init;
    server?: Server;
    models: typeof models;
    services: typeof services;
    utils: typeof utils;
    middleware: typeof middleware;
}
/**
 * Module Exports
 */
/**
 * Bootstrapping Method
 */
export declare function init(useServer?: boolean): Promise<IBootstrapResponse>;
declare const mod: IBootstrapResponse;
export default mod;
//# sourceMappingURL=index.d.ts.map