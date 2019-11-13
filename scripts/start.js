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
    console.log(server.status);
    // console.log(os.hostname());
    // console.log(models);
    // const { User } = models;
    // console.log(User);
    // const u = await User.authenticateEmail('test@test.com', 'password', true);
    // const u = await User.loginEmail('test@test.com', 'password');
    // const mockSocial = {
    //   id: 'fakebook1223',
    //   email: 'test@test.com',
    // };

    // const u = await User.authenticateSocial('fakebook', mockSocial);
    // console.log(u);
  } catch (err) {
    console.error(err);
  }
};

main();
