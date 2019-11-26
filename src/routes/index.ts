/*
 * routes/index.ts
 * Route Index
 */

/**
 * Module Dependencies
 */

import path from 'path';

import Koa from 'koa';
// import koaRouter from 'koa-router';
import views from 'koa-views';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import logger from 'koa-logger';
// import express, { Application } from 'express';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import cors, { CorsOptions } from 'cors';
// import logger from 'morgan';

import passport from 'koa-passport';

import authStrategies from '../passport';

import graphQLRoutes from './routes.graphql';
// import authRoutes from './routes.auth';

import Configs from '../configs';
import Server from '../Server';

/**
 * Interface
 */

export interface IEidolonRouteFunction {
  app: Koa;
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

  // Settings
  app.use(views(path.join(__dirname, '../views'), { extension: 'pug' }));
  app.use(serve(path.join(__dirname, '../../public')));
  // app.disable('x-powered-by');

  // Middleware Configs
  app.use(bodyParser());
  app.use(cors({ origin: corsUrls, credentials: true }));
  if (env === 'production') app.use(logger());
  // app.use(cookieParser());

  app.use(passport.initialize());
  await authStrategies();

  // // Routes
  await graphQLRoutes(app, server);
  // if (Configs.getConfig('mongodb')) await authRoutes(app, server);

  return;
}
