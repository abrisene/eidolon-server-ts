/*
 * auth.jwt.ts
 * JWT Strategy for Passport
 */

/**
 * Module Dependencies
 */

import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
// import { Request } from 'express';
import { Context } from 'koa';

import Configs from '../configs';
import { User } from '../models';

/**
 * Constants
 */

/* const extractors = [
  // Note, this will fail if https is not enabled if cookie is signed with secure.
  (ctx: Context) => {
    let jwt;
    if (ctx.cookies !== undefined) {
      jwt = ctx.cookies.get('jwt') || ctx.cookies.get('bearer');
    }
    return jwt;
  },
  // ExtractJwt.fromAuthHeaderAsBearerToken(),
]; */

/**
 * Module Exports
 */

/**
 * Builds JWT Passport Strategy for Middleware
 */
export default async function() {
  const { secretKey, issuer, audience } = Configs.getConfig('jwt');
  const options: StrategyOptions = {
    secretOrKey: secretKey,
    issuer,
    audience,
    // jwtFromRequest: ExtractJwt.fromExtractors(extractors),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Need to figure out how to set this properly.
  };
  return new Strategy(options, async (payload, done) => {
    try {
      const user = await User.findOne({ _id: payload.sub });
      return user ? done(null, user) : done(null, false);
    } catch (err) {
      return done(err, false);
    }
  });
}
