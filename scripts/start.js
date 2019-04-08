/*
 * start.js
 * Start Script
 */

/**
 * Module Dependencies
 */

const eidolon = require('../lib');

/**
 * Main
 */

const main = async () => {
  try {
    console.log('xx');
    await eidolon.init();
  } catch (err) {
    console.error(err);
  }
};

main();
