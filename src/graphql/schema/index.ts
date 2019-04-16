/*
 * graphql/schea/index.ts
 * GraphQL Schema Index
 */

/*
 * Module Dependencies
 */

import { gql } from 'apollo-server-express';
// const configSchema = require('./schema.config');
// const userSchema = require('./schema.user');
// const paymentSchema = require('./schema.payment');
// const messageSchema = require('./schema.message');

/*
 * Resolvers
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

export default [
  linkSchema,
  // configSchema,
  // userSchema,
  // paymentSchema,
  // messageSchema,
];
