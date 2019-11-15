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

export default async function() {
  return new Strategy(options, async (email, password, done) => {
    try {
      const result = await User.authenticateEmail(email, password);
      return done(null, result.user);
    } catch (err) {
      return done(null, false);
    }
  });
}
