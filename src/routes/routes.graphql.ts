/*
 * routes.graphql.ts
 * GraphQL Routes
 */

/**
 * Module Dependencies
 */

import { ApolloServer } from 'apollo-server-express';
import { RedisCache } from 'apollo-server-cache-redis';

import { resolvers, schema } from '../graphql';
import Configs from '../configs';
import Server from '../Server';

/**
 * Module Exports
 */

export default async function routes(server: Server) {
  const app = server.app;
  const { corsUrls } = Configs.getConfig('server');
  const redisConfig = Configs.getConfig('redis');

  // Set up the Redis Cache for GraphQL if Redis is configured
  let cache;
  if (redisConfig !== undefined) cache = new RedisCache({ url: redisConfig.url });

  // Create the server.
  const gqlServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
    cache,
    context: async ({ req, res }) => ({
      req,
      res,
      Configs,
      // user
      // models
    }),
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
  });

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
