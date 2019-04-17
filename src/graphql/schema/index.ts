/*
 * graphql/schea/index.ts
 * GraphQL Schema Index
 */

/*
 * Module Dependencies
 */

import { DocumentNode } from 'graphql';
import { IResolvers } from 'graphql-tools';
import { gql } from 'apollo-server-express';
import utilities from '../../utilities';
const { importPattern } = utilities;

/*
 * Utility Methods
 */

function combineResolvers(oldResolver: IResolvers, newResolver: IResolvers): IResolvers {
  const { Query: oldQuery = {}, Mutation: oldMutation = {}, ...oldRest } = oldResolver;
  const { Query: newQuery = {}, Mutation: newMutation = {}, ...newRest } = newResolver;
  return {
    Query: { ...oldQuery, ...newQuery },
    Mutation: { ...oldMutation, ...newMutation },
    ...oldRest,
    ...newRest,
  } as IResolvers;
}

/*
 * Interfaces
 */

export interface IGraphQLConfig {
  schema: DocumentNode[];
  resolvers: IResolvers;
}

/*
 * Default Schema
 */

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

/*
 * Module Exports
 */

export async function importSchema(location = __dirname, init = false): Promise<IGraphQLConfig> {
  const schema: DocumentNode[] = init ? [linkSchema] : [];
  let resolvers: IResolvers = { Query: {}, Mutation: {} };

  // Load the schema and resolvers.
  await importPattern(/^(schema|scalar).*.js$/, async (module, file) => {
    schema.push(module.schema);
    if (module.resolvers !== undefined) resolvers = combineResolvers(resolvers, module.resolvers);
  }, location);

  return { schema, resolvers };
}
