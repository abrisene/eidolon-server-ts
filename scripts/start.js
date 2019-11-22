/*
 * start.js
 * Start Script
 */

/**
 * Module Dependencies
 */
const os = require('os');
const eidolon = require('../lib');
const chalk = require('chalk');

/**
 * Main
 */

const main = async () => {
  try {
    const e = await eidolon.init();
    const { server, models } = e;

    // await models.User.remove({});
    // await models.UserIdentity.remove({});
    // await models.Token.remove({});
    // await models.Product.remove({});
    // await models.SKU.remove({});
    // console.log(chalk `{yellow User Collections Cleared}`);
  } catch (err) {
    console.error(err);
  }
};

main();
