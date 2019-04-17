/*
 * schema.config.ts
 * App Config GraphQL Schema
 */

/*
 * Module Dependencies
 */

import { gql } from 'apollo-server-express';

/*
 * Module Exports
 */

export default gql`
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
