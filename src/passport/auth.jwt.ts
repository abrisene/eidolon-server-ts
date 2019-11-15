/*
 * auth.jwt.ts
 * JWT Strategy for Passport
 */

/**
 * Module Dependencies
 */

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import Configs from '../configs';
import { User } from '../models';

/**
 * Constants
 */

const extractors = [
  // Note, this will fail if https is not enabled. Cookie is signed with secure.
  (req: Request) => {
    let jwt;
    if (req !== undefined && req.cookies !== undefined) {
      jwt = req.cookies.jwt || req.cookies.bearer;
    }
    return jwt;
  },
  ExtractJwt.fromAuthHeaderAsBearerToken(),
];

/**
 * Module Exports
 */

export default async function() {
  const options = Configs.getConfig('jwt').options;
  options.jwtFromRequest = ExtractJwt.fromExtractors(extractors);
  return new Strategy(options, async (payload, done) => {
    try {
      const user = await User.findOne({ _id: payload.sub });
      return user ? done(null, user) : done(null, false);
    } catch (err) {
      return done(err, false);
    }
  });
}
