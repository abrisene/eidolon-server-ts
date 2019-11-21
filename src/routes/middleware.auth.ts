/*
 * middleware.auth.ts
 * Authentication Express Middleware
 */

/**
 * Module Dependencies
 */

import passport from 'passport';
import Configs from '../configs';
/**
 * Module Exports
 */

/**
 * Middleware to require JWT authentication. Injects user into Request.
 * @param req Express request.
 * @param res Express response.
 * @param next Express callback.
 */
function authenticateJwtRequired(
  req: Express.Request,
  res: any,
  next: () => any,
) {
  return passport.authenticate(['jwt'], { session: false }, (err, user) => {
    req.user = user;
    return user ? next() : res.status(401);
  })(req, res, next);
}

/**
 * Middleware for optional JWT authentication. Injects user into Request.
 * @param req Express request.
 * @param res Express response.
 * @param next Express callback.
 */
function authenticateJwtOptional(
  req: Express.Request,
  res: any,
  next: () => any,
) {
  return passport.authenticate(['jwt'], { session: false }, (err, user) => {
    req.user = user;
    return next();
  })(req, res, next);
}

export const authenticate = {
  required: authenticateJwtRequired,
  optional: authenticateJwtOptional,
};
