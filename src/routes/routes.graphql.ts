/*
 * routes.graphql.ts
 * GraphQL Routes
 */

/**
 * Module Dependencies
 */

import path from 'path';
import express from 'express';
import { ApolloServer, IResolvers } from 'apollo-server-express';
import { DocumentNode } from 'graphql';
import { RedisCache } from 'apollo-server-cache-redis';

import Configs from '../configs';
import Server from '../Server';

/**
 * Module Exports
 */

export default async function routes(app: express.Application, server: Server) {
  // Get Configuration Variables
  const { corsUrls } = Configs.getConfig('server');
  const redisConfig = Configs.getConfig('redis');

  // Get the Schema and Resolvers from the Server
  const gqlConfig = server.gqlSchema;

  // Set up the Redis Cache for GraphQL if Redis is configured
  let cache;
  if (redisConfig !== undefined) cache = new RedisCache({ url: redisConfig.url });

  // Create the server.
  const gqlServer = new ApolloServer({
    typeDefs: gqlConfig.schema,
    resolvers: gqlConfig.resolvers,
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