/*
 * routes.graphql.ts
 * GraphQL Routes
 */

/**
 * Module Dependencies
 */

import path from 'path';

import { ApolloServer, IResolvers } from 'apollo-server-express';
import { DocumentNode } from 'graphql';
import { RedisCache } from 'apollo-server-cache-redis';

import { importConfig } from '../graphql';
import Configs from '../configs';
import Server from '../Server';

/**
 * Module Exports
 */

export default async function routes(server: Server, schemas?: DocumentNode[], resolvers?: IResolvers) {
  // Get Configuration Variables
  const app = server.app;
  const { corsUrls } = Configs.getConfig('server');
  const redisConfig = Configs.getConfig('redis');

  // Construct the Schema and Resolvers
  const gqlConfig = await importConfig();
  const gqlSchema = schemas || gqlConfig.schema;
  const gqlResolvers: IResolvers = resolvers || gqlConfig.resolvers;

  // Set up the Redis Cache for GraphQL if Redis is configured
  let cache;
  if (redisConfig !== undefined) cache = new RedisCache({ url: redisConfig.url });

  // Create the server.
  const gqlServer = new ApolloServer({
    typeDefs: gqlSchema,
    resolvers: gqlResolvers,
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
