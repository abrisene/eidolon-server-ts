/*
 * auth.local.ts
 * Local Strategy for Passport
 */

/**
 * Module Dependencies
 */

import { Strategy } from 'passport-local';

import { User } from '../models';

/**
 * Constants
 */

const options = {
  usernameField: 'email',
  passwordField: 'password',
  session: false,
};

/**
 * Module Exports
 */

/**
 * Builds Local Passport Strategy for Middleware
 */
export default async function() {
  return new Strategy(options, async (email, password, done) => {
    try {
      const result = await User.authenticateEmail(email, password);
      console.log('LOCAL');
      return done(null, result);
    } catch (err) {
      return done(err, false);
    }
  });
}
