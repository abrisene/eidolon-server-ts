import { IResolvers, IResolverObject } from 'graphql-tools';

/*
 * resolvers.configs.ts
 * Config GraphQL Resolvers
 */

/*
 * Module Dependencies
 */

/*
 * Utility Methods
 */

/*
 * Resolvers
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

/*
 # Module Exports
 */

export default {
  Query: query,
  Mutation: mutation,
  AppConfig: appConfig,
  PublicKeys: publicKeys,
} as IResolvers;
