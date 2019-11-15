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

async function init(useServer = true): Promise<object> {
  const server = useServer ? new Server() : undefined;
  await Configs.init();
  if (server) await server.serve(9000);
  // console.log(Configs);
  return {
    server,
    models,
  };
}

/**
 * Module Exports
 */

module.exports = {
  init,
  models,
  // config,
  // constants,
  // models,
  // modules,
};
