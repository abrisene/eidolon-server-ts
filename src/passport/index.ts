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

import { authFacebook, authGoogle } from './auth.social';

// const authTwitter = require('./auth.twitter');
// const authLinkedIn = require('./auth.linkedin');
// const authPinterest = require('./auth.pinterest');

/**
 * Module Exports
 */

/**
 * Initializes valid passport strategies.
 */
export default async function auth() {
  const jwtStrategy = await authJwt();
  const localStrategy = await authLocal();

  passport.use(jwtStrategy);
  passport.use(localStrategy);

  // const twitterStrategy = await authTwitter;
  // const linkedInStrategy = await authLinkedIn;
  // const pinterestStrategy = await authPinterest;

  if (Configs.getConfig('google').clientID !== undefined) {
    // const googleTokenStrategy = await authGoogleToken();
    const googleStrategy = await authGoogle();
    passport.use(googleStrategy);
    // passport.use(googleTokenStrategy);
  }

  if (Configs.getConfig('facebook').clientID !== undefined) {
    // const facebookTokenStrategy = await authFacebookToken();
    const facebookStrategy = await authFacebook();
    passport.use(facebookStrategy);
    // passport.use(facebookTokenStrategy);
  }
}
