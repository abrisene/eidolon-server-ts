/*
 * routes.graphql.ts
 * GraphQL Routes
 */

/**
 * Module Dependencies
 */

import path from 'path';
import Koa, { Context, Next } from 'koa';
import Router from 'koa-router';
import passport from 'passport';

import Configs from '../configs';
import Server from '../Server';
import * as models from '../models';
import { authenticate, clearUserToken, generateUserToken } from './middleware.auth';

/**
 * Module Exports
 */

export default async function routes(app: Koa, router: Router, server: Server) {
  // Get Configuration Variables
  const facebook = Configs.getConfig('facebook');
  const google = Configs.getConfig('google');

  // Auth Testroutes
  router.get('/auth/secret', authenticate.required, (ctx) => ctx.body = ctx.state.user);
  router.get('/auth/optional', authenticate.optional, (ctx) => ctx.body = ctx.state.user);
  router.get('/auth/user', (ctx) => ctx.body = ctx.state.user);

  // "Session" Routes
  router
    .all('/auth/logout', clearUserToken)
    .get('/auth/logout', (ctx) => ctx.body = ({ success: true, msg: 'Successfully logged out.' }))
    .post('/auth/logout', (ctx) => ctx.body = ({ success: true, msg: 'Successfully logged out.' }));

  // Social Login Routes

  // Facebook Authentication Routes
  if (facebook?.clientID) {
    router
      .get(
        '/auth/facebook',
        passport.authenticate(['facebook'], {
          session: false,
          failureRedirect: '/login',
          scope: facebook.profileFields,
        }),
      )
      .get(
        facebook.callbackRoute,
        passport.authenticate(['facebook'], {
          session: false,
          failureRedirect: '/login',
        }),
        generateUserToken,
        (ctx) => ctx.body = ({ success: true, msg: 'Successfully logged in via Facebook'}),
      );
  }

  // Google Authentication Routes
  if (google?.clientID) {
    router
      .get(
        '/auth/google',
        passport.authenticate(['google'], {
          session: false,
          failureRedirect: '/login',
          scope: google.profileFields,
        }),
      )
      .get(
        google.callbackRoute,
        passport.authenticate(['google'], {
          session: false,
          failureRedirect: '/login',
        }),
        generateUserToken,
        (ctx) => ctx.body = ({ success: true, msg: 'Successfully logged in via Google' }),
      );
  }

  // Token Validation Routes

  // Confirm Email with Token
  router.get('/validate/email/:token', async (ctx, next) => {
    const { token } = ctx.params;
    try {
      const redeem = await models.UserIdentity.validateWithToken(token);
      if (!redeem.success) throw new Error(redeem.msg);
      ctx.body = redeem;
    } catch (err) {
      ctx.body = err.message;
    }
  });

}
