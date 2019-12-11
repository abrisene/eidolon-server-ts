/*
 * index.js
 * Module Index
 */

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

// export * from './configs';
// export * from './server';
// export * from './models';
// export * from './services';
// export * from './utilities';
// export { middleware } from './routes';

/**
 * Bootstrapping Method
 */

export async function init(useServer = true): Promise<IBootstrapResponse> {
  const server = useServer ? new Server() : undefined;
  await Configs.init();
  const serverConfig = Configs.getConfig('server');
  const port = serverConfig.port || 8000;
  if (server) await server.serve(port);

  return {
    Configs,
    server,
    models,
    services,
    utils,
    middleware,
  };
}

const mod: IBootstrapResponse = {
  Configs,
  init,
  models,
  services,
  utils,
  middleware,
  // constants,
  // modules,
};

export default mod;
