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
    const { server, models } = e;
  } catch (err) {
    console.error(err);
  }
};

main();
