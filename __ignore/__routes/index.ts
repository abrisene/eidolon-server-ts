/*
 * routes/index.ts
 * Route Index
 */

/**
 * Module Dependencies
 */

import path from 'path';

import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import logger from 'morgan';

import passport from 'passport';
import authStrategies from '../passport';

import graphQLRoutes from './routes.graphql';
import authRoutes from './routes.auth';

import Configs from '../configs';
import Server from '../Server';

/**
 * Interface
 */

export interface IEidolonRouteFunction {
  app: Application;
  server: Server;
}

/**
 * Module Exports
 */

export * from './middleware.common';
export * from './middleware.auth';

export default async function(app: Application, server: Server) {
  const { appName, env } = Configs.getConfig('environment');
  const { corsUrls } = Configs.getConfig('server');

  console.log(env);

  // Express Settings
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, '../views'));
  app.disable('x-powered-by');

  // Middleware Configs
  const corsOptions: CorsOptions = { origin: corsUrls, credentials: true };
  app.use(cors(corsOptions));
  app.use('/static', express.static(path.join(__dirname, '../../public')));
  if (env === 'production') app.use(logger('combined'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(passport.initialize());
  await authStrategies();

  // Routes
  await graphQLRoutes(app, server);
  if (Configs.getConfig('mongodb')) await authRoutes(app, server);

  return;
}
