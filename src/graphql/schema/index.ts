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

/**
 * Combines two resolver objects into one.
 * @param oldResolver First resolver object.
 * @param newResolver Second resolver object.
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

/**
 * Loads GraphQL Schemas and Resolvers from a directory.
 * All filenames in the directory prepended with "schema." or "scalar." will be loaded.
 * @param location The directory to load schemas from.
 * @param init     Whether or not to initialize the schema with the default.
 */
export async function importSchema(location = __dirname, init = true): Promise<IGraphQLConfig> {
  const schema: DocumentNode[] = init ? [linkSchema] : [];
  let resolvers: IResolvers = { Query: {}, Mutation: {} };

  // Load the schema and resolvers.
  await importPattern(/^(schema|scalar).*.js$/, async (module) => {
    if (module.schema) schema.push(module.schema);
    if (module.resolvers !== undefined) resolvers = combineResolvers(resolvers, module.resolvers);
  }, location);

  return { schema, resolvers };
}
