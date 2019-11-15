/*
 * passport/index.ts
 * Passport Index
 */

/**
 * Module Dependencies
 */

import passport from 'passport';
import Configs from '../configs';

import authJwt from './auth.jwt';
import authLocal from './auth.local';

/*
const authJwt = require('./auth.jwt');
const authLocal = require('./auth.local');

const authGoogle = require('./auth.google');
const authGoogleToken = require('./auth.google.token');
const authFacebook = require('./auth.facebook');
const authFacebookToken = require('./auth.facebook.token');
// const authTwitter = require('./auth.twitter');
// const authLinkedIn = require('./auth.linkedin');
// const authPinterest = require('./auth.pinterest');
*/

/**
 * Module Exports
 */

export default async function auth() {
  const jwtStrategy = await authJwt();
  const localStrategy = await authLocal();

  // const googleStrategy = await authGoogle();
  // const googleTokenStrategy = await authGoogleToken();
  // const facebookStrategy = await authFacebook();
  // const facebookTokenStrategy = await authFacebookToken();
  // const twitterStrategy = await authTwitter;
  // const linkedInStrategy = await authLinkedIn;
  // const pinterestStrategy = await authPinterest;

  passport.use(jwtStrategy);
  passport.use(localStrategy);

  // if (config.getConfig('google').clientID) {
  //   passport.use(googleStrategy);
  //   passport.use(googleTokenStrategy);
  // }

  // if (Configs.getConfig('facebook').clientID) {
  //   passport.use(facebookStrategy);
  //   passport.use(facebookTokenStrategy);
  // }
}
