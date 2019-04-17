import { IResolvers } from 'graphql-tools';

/*
 * graphql/resolvers/index.ts
 * GraphQL Resolver Index
 */

/*
 * Module Dependencies
 */

import utilities from '../../utilities';
const { importPattern } = utilities;

/*
 * Interfaces
 */

interface IResolverImport {
  default: IResolvers;
}

/*
 * Module Exports
 */

export async function importResolvers(location = __dirname): Promise<IResolvers> {
  let resolvers: IResolvers = { Query: {}, Mutation: {} };
  await importPattern(/^(resolvers).*.js$/, async (resolver: IResolverImport) => {
    const { Query, Mutation, ...rest } = resolver.default;
    resolvers = {
      Query: { ...resolvers.Query, ...Query },
      Mutation: { ...resolvers.Mutation, ...Mutation },
      ...rest,
    } as IResolvers;
  }, location);
  return resolvers;
}
