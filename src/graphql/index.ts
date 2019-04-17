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

import { importSchemas as iS } from './schema';
import { importResolvers as iR } from './resolvers';

/*
 * Interfaces
 */

interface IGraphQLConfig {
  schema: DocumentNode[];
  resolvers: IResolvers;
}

/*
 * Module Exports
 */

export async function importConfig(): Promise<IGraphQLConfig> {
  const schema = await iS(path.join(__dirname, './schema'), true);
  const resolvers = await iR();
  return { schema, resolvers };
}

export const importSchemas = iS;
export const importResolvers = iR;
