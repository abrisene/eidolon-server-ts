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

import { importSchema as iS, IGraphQLConfig } from './schema';

/*
 * Module Exports
 */

export const importSchema = iS;

export async function importConfig(): Promise<IGraphQLConfig> {
  return iS(path.join(__dirname, './schema'), true);
}
