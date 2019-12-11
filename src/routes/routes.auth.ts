/*
 * routes.auth.ts
 * Authorization Routes
 */

/**
 * Module Dependencies
 */

import Koa, { Context, Next } from 'koa';
import Router from 'koa-router';
import passport from 'passport';

import Configs from '../configs';
import Server from '../Server';
import { User, UserIdentity } from '../models';
import { injectConfig, injectMessage, renderInjected } from './middleware.common';
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
    .get('/auth/logout', injectMessage({ msg: 'Successfully logged out.', type: 'success' }), (ctx) => ctx.redirect('/'))
    .post('/auth/logout', (ctx) => ctx.body = ({ success: true, msg: 'Successfully logged out.' }));

  // Account Recovery
  router
    .get('/recover/', renderInjected('recover'))
    .post('/recover/', async (ctx) => {
      try {
        const request = await User.requestPasswordReset(ctx.request.body.email);
        if (!request.success) throw new Error(request.msg);
        return ctx.redirect('/login');
      } catch (err) {
        return ctx.throw(500, err.message);
      }
    })
    .get('/recover/:token', (ctx) => renderInjected('recover', { token: ctx.params.token })(ctx))
    .post('/recover/:token', async (ctx) => {
      try {
        const request = await User.setPasswordWithToken(ctx.params.token, ctx.request.body.password);
        if (!request.success) throw new Error(request.msg);
        return ctx.redirect('/login');
      } catch (err) {
        return ctx.throw(403, err.message);
      }
    });

  // Account Verification
  router.get('/validate/email/:token', async (ctx, next) => {
    try {
      const request = await UserIdentity.validateWithToken(ctx.params.token);
      if (!request.success) throw new Error(request.msg);
      return ctx.redirect('/profile');
    } catch (err) {
      ctx.throw(500, err.message);
    }
  });

  // Email / Password Login Routes
  router.post(
    '/auth/login',
    passport.authenticate(['local'], { session: false, failureRedirect: '/login' }),
    (ctx) => ctx.redirect('/profile'),
  );

  router.post(
    '/auth/register',
    async (ctx, next) => {
      try {
        const request = await User.authenticateEmail(ctx.request.body.email, ctx.request.body.password, true);
        if (request.err) throw new Error(request.err.message);
        ctx.state.user = request.user;
        return next();
      } catch (err) {
        ctx.throw(403, err);
      }
    },
    generateUserToken,
    ctx => ctx.redirect('/profile'),
  );

  // Social Login Routes

  // Facebook Authentication Routes
  if (facebook.clientID !== undefined) {
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
        injectMessage({ msg: 'Successfully logged in.', type: 'success' }),
        (ctx) => ctx.redirect('/'),
      );
  }

  // Google Authentication Routes
  if (google.clientID !== undefined) {
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
        injectMessage({ msg: 'Successfully logged in.', type: 'success' }),
        (ctx) => ctx.redirect('/'),
      );
  }

  return;
}
