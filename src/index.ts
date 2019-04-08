/*
 * index.js
 * Module Index
 */

/**
 * Module Dependencies
 */

import Server from './Server';
// const config = require('./configs');
// const server = require('./server');

// const constants = require('./constants');
// const models = require('./models');

// const modules = require('./modules');

/**
 * Main
 */

/* const init = async (useServer = true) => {
  try {
    await config.init();
    if (useServer) await server();

    return {
      config,
      constants,
      models,
      modules,
    };
  } catch (err) {
    console.error(err);
    return { err };
  }
}; */

async function init(useServer = true): Promise<object> {
  console.log('xxx');
  const server = useServer ? new Server() : undefined;
  if (server) await server.serve(9000);
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
