/*
 * index.js
 * Module Index
 */

/**
 * Module Dependencies
 */

import Configs from './configs';
import Server from './Server';

async function init(useServer = true): Promise<object> {
  const server = useServer ? new Server() : undefined;
  await Configs.init();
  if (server) await server.serve(9000);
  console.log(Configs);
  return {
    server,
  };
}

/**
 * Module Exports
 */

module.exports = {
  init,
  // config,
  // constants,
  // models,
  // modules,
};
