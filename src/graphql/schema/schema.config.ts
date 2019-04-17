/*
 * schema.config.ts
 * App Config GraphQL Schema
 */

/*
 * Module Dependencies
 */

import { gql } from 'apollo-server-express';
import { IResolvers, IResolverObject } from 'graphql-tools';

/*
 * Module Exports
 */

/*
 * Schema
 */

export const schema = gql`
  extend type Query {
    appConfig: AppConfig
    publicKeys: PublicKeys
  }

  type AppConfig {
    name: String
    env: String
    uris: AppURIs
    keys: PublicKeys
  }

  type AppURIs {
    host: String
  }

  type PublicKeys {
    google: String
    facebook: String
    stripe: String
    mailgun: String
    ably: String
  }
`;

/*
 # Resolvers
 */

const query: IResolverObject = {
  appConfig: async (p, a, { Configs }) => {
    const environment = Configs.getConfig('environment');
    const uris = Configs.getConfig('uris');

    const { appName, env } = environment;

    return {
      name: appName,
      env,
      uris,
      keys: Configs.publicKeys,
    };
  },
  publicKeys: async (p, a, { Configs }) => Configs.publicKeys,
};

const appConfig: IResolverObject = {};

const publicKeys: IResolverObject = {};

const mutation: IResolverObject = {};

export const resolvers = {
  Query: query,
  Mutation: mutation,
  AppConfig: appConfig,
  PublicKeys: publicKeys,
} as IResolvers;
