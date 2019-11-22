/*
 * middleware.auth.ts
 * Authentication Express Middleware
 */

/**
 * Module Dependencies
 */

import passport from 'passport';
import Configs from '../configs';

// import { IUser } from '../models';
/**
 * Module Exports
 */

/**
 * Middleware to generate a JWT if the request contains a valid user.
 * @param req Express request.
 * @param res Express response.
 * @param next Express callback.
 */
export async function generateUserToken(req: Express.Request, res: any, next: () => any) {
  const user: any = req.user;
  const { useHttps } = Configs.getConfig('server');

  if (!user) {
    res.status(400).send({ err: 'Could not login' });
  } else {
    const token = user.generateJWT();
    res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
    next();
  }
}

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
