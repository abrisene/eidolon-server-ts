/*
 * graphql/index.ts
 * GraphQL Index
 */

/*
 * Module Dependencies
 */

import path from 'path';
import { DocumentNode } from 'graphql';
import { IResolvers } from 'graphql-tools';
import { gql } from 'apollo-server-express';
import { importPattern } from '../utilities';

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

const defaultConfig: IGraphQLConfig = {
  schema: [linkSchema],
  resolvers: {
    Query: {},
    Mutation: {},
  },
};

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
 * Module Exports
 */

/**
 * Loads GraphQL Schemas and Resolvers from a directory.
 * All filenames in the directory prepended with "schema." or "scalar." will be loaded.
 * @param location The directory to load schemas from.
 * @param init     The schema to initialize the import with. This defaults to the default schema.
 */
export async function importSchema(
  location = __dirname,
  init: IGraphQLConfig = defaultConfig,
): Promise<IGraphQLConfig> {
  const schema: DocumentNode[] = init && init.schema ? init.schema : [];
  let resolvers: IResolvers = init && init.resolvers ? init.resolvers : { Query: {}, Mutation: {} };
  // let resolvers: IResolvers = { Query: {}, Mutation: {} };

  // Load the schema and resolvers.
  await importPattern(/^(schema|scalar).*.js$/, async (module) => {
    if (module.schema) schema.push(module.schema);
    if (module.resolvers !== undefined) resolvers = combineResolvers(resolvers, module.resolvers);
  }, location);

  return { schema, resolvers };
}

/**
 * Imports the default GraphQL Config from the files defined in graphql/schema
 */
export async function importGraphQLConfig(): Promise<IGraphQLConfig> {
  return importSchema(path.join(__dirname, './schema'));
}
