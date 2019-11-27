/*
 * routes.graphql.ts
 * GraphQL Routes
 */

/**
 * Module Dependencies
 */

import Koa from 'koa'; // koa@2
import { ApolloServer, IResolvers } from 'apollo-server-koa';
import { RedisCache } from 'apollo-server-cache-redis';

import Configs, { Config } from '../configs';
import Server from '../Server';
import * as models from '../models';
import { IConfig } from '../utilities';
// import { authenticate } from './middleware.auth';

/**
 * Interfaces
 */

export interface IGraphQLContext {
  ctx: Koa.Context;
  req: Koa.Request;
  res: Koa.Response;
  user: any;
  Configs: Config;
  models: typeof models;
}

/**
 * Constants
 */

/**
 * Returns a context for the Apollo Server.
 * @param ctx The Koa Context.
 */
async function bindContext({ ctx }: { ctx: Koa.Context }): Promise<IGraphQLContext> {
  return {
    ctx,
    req: ctx.request,
    res: ctx.response,
    user: ctx.state.user,
    Configs,
    models,
  };
}

/**
 * Module Exports
 */

export default async function routes(app: Koa,  server: Server) {
  // Get Configuration Variables
  const { corsUrls } = Configs.getConfig('server');
  const redisConfig = Configs.getConfig('redis');

  // Get the Schema and Resolvers from the Server
  const gqlConfig = server.gqlSchema;
  const redisHost: string = redisConfig ? redisConfig.url : undefined;

  // Set up the Redis Cache for GraphQL if Redis is configured
  let cache;
  // if (redisConfig !== undefined) cache = new RedisCache({ url: redisConfig.url });
  if (redisHost) cache = new RedisCache({ host: redisHost }); // TODO: Test This

  // Create the server.
  const gqlServer = new ApolloServer({
    typeDefs: gqlConfig.schema,
    resolvers: gqlConfig.resolvers,
    cache,
    context: bindContext,
    /* context: async ({ ctx }: { ctx: Koa.Context }) => ({
      ctx,
      req: ctx.request,
      res: ctx.response,
      Configs,
      user: ctx.state.user,
      models,
    }), */
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
  });

  // Apply Middleware
  // app.use('/graphql'/* , authenticate.optional */);
  gqlServer.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: corsUrls,
      credentials: true,
    },
  });

  return gqlServer;
}
