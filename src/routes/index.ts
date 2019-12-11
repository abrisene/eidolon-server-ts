/*
 * routes/index.ts
 * Route Index
 */

/**
 * Module Dependencies
 */

import path from 'path';

import Koa from 'koa';
import Router from 'koa-router';
import views from 'koa-views';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import logger from 'koa-logger';

import passport from 'koa-passport';

import authStrategies from '../passport';

import { injectConfig, renderInjected } from './middleware.common';
import { authenticate } from './middleware.auth';

import graphQLRoutes from './routes.graphql';
import commonRoutes from './routes.common';
import authRoutes from './routes.auth';

import Configs from '../configs';
import Server from '../Server';

/**
 * Interface
 */

export interface IEidolonRouteFunction {
  app: Koa;
  router: Router;
  server: Server;
}

/**
 * Module Exports
 */

import * as middlewareCommon from './middleware.common';
import * as middlewareAuth from './middleware.auth';

export const middleware = {
  ...middlewareCommon,
  ...middlewareAuth,
};

export default async function(app: Koa, router: Router, server: Server) {
  const { appName, env } = Configs.getConfig('environment');
  const { corsUrls } = Configs.getConfig('server');
  const { host } = Configs.getConfig('uris');

  const routeConfig = { title: appName, appName, env, host };

  // App Middleware Configs
  app.use(bodyParser());
  app.use(cors({ origin: corsUrls, credentials: true }));
  app.use(serve(path.join(__dirname, '../../public')));
  app.use(views(path.join(__dirname, '../../views'), { extension: 'pug' }));
  if (env === 'production') app.use(logger());

  // Authentication Configs
  app.use(passport.initialize());
  await authStrategies();

  // Create the Router
  // const router = new Router();
  app
    .use(router.routes())
    .use(router.allowedMethods());

  // Router Middleware Configs
  // router.use(bodyParser());
  // router.use(cors({ origin: corsUrls, credentials: true }));
  router.use(views(path.join(__dirname, '../../views'), { extension: 'pug' }));
  router.use(authenticate.optional);
  router.use(injectConfig('config', routeConfig));

  // // Routes
  await commonRoutes(app, router, server);
  await graphQLRoutes(app, router, server);
  if (Configs.getConfig('mongodb')) await authRoutes(app, router, server);

  app.use(renderInjected('404'));

  return;
}
