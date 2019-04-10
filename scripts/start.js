/*
 * start.js
 * Start Script
 */

/**
 * Module Dependencies
 */
const os = require('os');
const eidolon = require('../lib');

/**
 * Main
 */

const main = async () => {
  try {
    const e = await eidolon.init();
    const { server } = e;
    console.log(server.status);
    // console.log(os.hostname());
  } catch (err) {
    console.error(err);
  }
};

main();
