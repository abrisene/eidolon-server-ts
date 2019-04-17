"use strict";
/*
 * schema.config.ts
 * App Config GraphQL Schema
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Module Dependencies
 */
const apollo_server_express_1 = require("apollo-server-express");
/*
 * Module Exports
 */
/*
 * Schema
 */
exports.schema = apollo_server_express_1.gql `
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
/*
 # Resolvers
 */
const query = {
    appConfig: (p, a, { Configs }) => __awaiter(this, void 0, void 0, function* () {
        const environment = Configs.getConfig('environment');
        const uris = Configs.getConfig('uris');
        const { appName, env } = environment;
        return {
            name: appName,
            env,
            uris,
            keys: Configs.publicKeys,
        };
    }),
    publicKeys: (p, a, { Configs }) => __awaiter(this, void 0, void 0, function* () { return Configs.publicKeys; }),
};
const appConfig = {};
const publicKeys = {};
const mutation = {};
exports.resolvers = {
    Query: query,
    Mutation: mutation,
    AppConfig: appConfig,
    PublicKeys: publicKeys,
};
//# sourceMappingURL=schema.config.js.map