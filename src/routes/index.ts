/*
 * routes/index.ts
 * Route Index
 */

/**
 * Module Dependencies
 */

import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

import passport from 'passport';
import authStrategies from '../passport';

import graphQLRoutes from './routes.graphql';

import Configs from '../configs';
import Server from '../Server';

/**
 * Interface
 */

export interface IEidolonRouteFunction {
  app: express.Application;
  server: Server;
}

/**
 * Module Exports
 */

export default async function(app: express.Application, server: Server) {
  const { appName, env } = Configs.getConfig('environment');
  const { corsUrls } = Configs.getConfig('server');

  // Express Settings
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, '../views'));
  app.disable('x-powered-by');

  // Middleware Configs
  app.use(cors({ origin: corsUrls, credentials: true }));
  app.use(express.static('public'));
  // if (env === 'production') app.use(logger('combined'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(passport.initialize());
  await authStrategies();

  // Routes
  await graphQLRoutes(app, server);

  return;
}
