"use strict";
/*
 * schema.config.ts
 * App Config GraphQL Schema
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Module Dependencies
 */
const apollo_server_express_1 = require("apollo-server-express");
/*
 * Module Exports
 */
exports.default = apollo_server_express_1.gql `
  extend type Query {
    appConfig: AppConfig
    publicKeys: PublicKeys
  }

  type AppConfig {
    name: String
    env: String
    uris: AppURIs
    keys: PublicKeys
  }

  type AppURIs {
    host: String
  }

  type PublicKeys {
    google: String
    facebook: String
    stripe: String
    mailgun: String
    ably: String
  }
`;
//# sourceMappingURL=schema.config.js.map