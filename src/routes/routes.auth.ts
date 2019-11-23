/*
 * routes.graphql.ts
 * GraphQL Routes
 */

/**
 * Module Dependencies
 */

import path from 'path';
import express from 'express';
import passport from 'passport';

import Configs from '../configs';
import Server from '../Server';
import * as models from '../models';
import { asyncRoute } from './middleware.common';
import { authenticate, clearUserToken, generateUserToken } from './middleware.auth';

/**
 * Module Exports
 */

export default async function routes(app: express.Application, server: Server) {
  // Get Configuration Variables
  const { corsUrls } = Configs.getConfig('server');
  const facebook = Configs.getConfig('facebook');
  const google = Configs.getConfig('google');

  // "Session" Routes
  app.post('/auth/logout', clearUserToken, (req, res) => res.redirect('/'));

  // Social Login Routes

  // Facebook Authentication Routes
  if (facebook.clientID) {
    app.get(
      '/auth/facebook',
      passport.authenticate(['facebook'], { session: false, failureRedirect: '/login', scope: facebook.profileFields }),
    );

    app.get(
      facebook.callbackRoute,
      passport.authenticate(['facebook'], { session: false, failureRedirect: '/login' }),
      generateUserToken,
      // (req, res) => res.redirect('/profile'));
      (req, res) => res.json({ success: true }));
  }

  // Google Authentication Routes
  if (google.clientID) {
    app.get(
      '/auth/google',
      passport.authenticate(['google'], { session: false, failureRedirect: '/login', scope: google.profileFields }),
    );

    app.get(
      google.callbackRoute,
      passport.authenticate(['google'], { session: false, failureRedirect: '/login' }),
      generateUserToken,
      // (req, res) => res.redirect('/profile'));
      (req, res) => res.json({ success: true }));
  }

  // Token Validation Routes
  // Confirm Email with Token
  app.get('/validate/email/:token', asyncRoute(async (req, res, next) => {
    const { token } = req.params;
    try {
      const redeem = await models.UserIdentity.validateWithToken(token);
      if (!redeem.success) throw new Error(redeem.msg);
      res.json(redeem);
    } catch (err) {
      res.json(err.message);
    }
  }));
}
