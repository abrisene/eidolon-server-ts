/*
 * routes.common.ts
 * Common Routes
 */

/**
 * Module Dependencies
 */

import Koa, { Context, Next } from 'koa';
import Router from 'koa-router';

import Configs from '../configs';
import Server from '../Server';
import { renderInjected } from './middleware.common';
import { authenticate } from './middleware.auth';
import { UserIdentity } from '../models';

/**
 * Constants
 */

/* export const constants = {
  navConfig: [
    { text: 'About', href: '/about' },
  ],
}; */

/**
 * Module Exports
 */

export default async function routes(app: Koa, router: Router, server: Server) {
  // Get Configuration Variables

  // NOTE: We don't need to use our authentication middleware, since we injected it on the router.

  // Index Route
  router.get('/', renderInjected('home', { header: 'Home' }));

  // Common routes

  // User Routes
  router.get('/login', renderInjected('login', { header: 'Login' }));
  router.get('/register', renderInjected('register', { header: 'Register' }));
  router.get(
    '/profile',
    authenticate.required,
    async (ctx: Koa.Context, next: Koa.Next) => {
      try {
        const identities = await UserIdentity.find({
          _id: { $in: ctx.state.user.identities },
        });
        ctx.state.config.identities = identities;
      } catch (err) {
        ctx.throw(400, err.message);
      }
      return next();
    },
    renderInjected('profile', { header: 'Profile' }),
  );

  return;
}
