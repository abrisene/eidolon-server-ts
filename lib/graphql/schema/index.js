"use strict";
/*
 * graphql/schea/index.ts
 * GraphQL Schema Index
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Module Dependencies
 */
const apollo_server_express_1 = require("apollo-server-express");
// const configSchema = require('./schema.config');
// const userSchema = require('./schema.user');
// const paymentSchema = require('./schema.payment');
// const messageSchema = require('./schema.message');
/*
 * Resolvers
 */
const linkSchema = apollo_server_express_1.gql `
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
exports.default = [
    linkSchema,
];
//# sourceMappingURL=index.js.map