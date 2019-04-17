/*
 * graphql/schea/index.ts
 * GraphQL Schema Index
 */

/*
 * Module Dependencies
 */

import { DocumentNode } from 'graphql';
import { gql } from 'apollo-server-express';
import utilities from '../../utilities';
const { importPattern } = utilities;

/*
 * Utility Methods
 */

/*
 * Interfaces
 */

interface ISchemaImport {
  default: DocumentNode;
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

export async function importSchemas(location = __dirname, init = false): Promise<DocumentNode[]> {
  const schemas: DocumentNode[] = [];
  await importPattern(/^(schema|scalar).*.js$/, async (schema: ISchemaImport) => {
    schemas.push(schema.default);
    return;
  }, location);
  const result = !init ? schemas : [linkSchema, ...schemas];
  return result;
}

export default [
  linkSchema,
];
