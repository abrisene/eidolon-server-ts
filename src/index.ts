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
  const serverConfig = Configs.getConfig('server');
  const port = serverConfig.port || 8000;
  if (server) await server.serve(port);

  return {
    Configs,
    server,
    models,
  };
}

/**
 * Module Exports
 */

module.exports = {
  Configs,
  init,
  models,
  // constants,
  // modules,
};
