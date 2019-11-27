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
// import logger from 'morgan';

import passport from 'koa-passport';

import authStrategies from '../passport';

import { authenticate } from './middleware.auth';

import graphQLRoutes from './routes.graphql';
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

// export * from './middleware.common';
// export * from './middleware.auth';

export default async function(app: Koa, server: Server) {
  const { appName, env } = Configs.getConfig('environment');
  const { corsUrls } = Configs.getConfig('server');

  // Create the Router
  const router = new Router();
  app
    .use(router.routes())
    .use(router.allowedMethods());

  // Settings
  app.use(views(path.join(__dirname, '../views'), { extension: 'pug' }));
  app.use(serve(path.join(__dirname, '../../public')));

  // Middleware Configs
  app.use(bodyParser());
  app.use(cors({ origin: corsUrls, credentials: true }));
  if (env === 'production') app.use(logger());

  app.use(passport.initialize());
  await authStrategies();
  app.use(authenticate.optional);

  // // Routes
  await graphQLRoutes(app, server);
  if (Configs.getConfig('mongodb')) await authRoutes(app, router, server);

  return;
}
