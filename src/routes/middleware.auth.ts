/*
 * middleware.auth.ts
 * Authentication Middleware
 */

/**
 * Module Dependencies
 */

import { Next, ParameterizedContext } from 'koa';
import passport from 'passport';
import Configs from '../configs';

/**
 * Module Exports
 */

/**
 * Middleware to generate a JWT if the request contains a valid user.
 * @param ctx Koa context.
 * @param next Next function callback.
 */
export async function generateUserToken(ctx: ParameterizedContext, next: Next) {
  // const user: any = req.user;
  const user = ctx.state.user;
  const { useHttps } = Configs.getConfig('server');

  if (!user) {
    ctx.throw(400, 'Could not login: User not found.');
  } else {
    const token = user.generateJWT();
    ctx.cookies.set('jwt', token, { httpOnly: true, secure: useHttps });
    next();
  }
}

/**
 * Middleware to clear the JWT from the current user's cookies.
 * @param ctx Koa context.
 * @param next Next function callback.
 */
export function clearUserToken(ctx: ParameterizedContext, next: Next) {
  const { useHttps } = Configs.getConfig('server');
  ctx.cookies.set('jwt', '', { httpOnly: true, secure: useHttps });
  next();
}

/**
 * Middleware to require JWT authentication. Injects user into Request.
 * @param ctx Koa context.
 * @param next Next function callback.
 */
async function authenticateJwtRequired(ctx: ParameterizedContext, next: Next) {
  return passport.authenticate(['jwt'], { session: false }, (err, user) => {
    ctx.state.user = user;
    return user ? next() : ctx.throw(401, 'Could not authenticate JWT');
  })(ctx, next);
}

/**
 * Middleware for optional JWT authentication. Injects user into Request.
 * @param ctx Koa context.
 * @param next Next function callback.
 */
async function authenticateJwtOptional(ctx: ParameterizedContext, next: Next) {
  return passport.authenticate(['jwt'], { session: false }, (err, user) => {
    ctx.state.user = user;
    return next();
  })(ctx, next);
}

export const authenticate = {
  required: authenticateJwtRequired,
  optional: authenticateJwtOptional,
};
