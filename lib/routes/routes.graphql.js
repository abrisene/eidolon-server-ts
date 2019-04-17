"use strict";
/*
 * routes.graphql.ts
 * GraphQL Routes
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_cache_redis_1 = require("apollo-server-cache-redis");
const graphql_1 = require("../graphql");
const configs_1 = __importDefault(require("../configs"));
/**
 * Module Exports
 */
function routes(server, schemas, resolvers) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get Configuration Variables
        const app = server.app;
        const { corsUrls } = configs_1.default.getConfig('server');
        const redisConfig = configs_1.default.getConfig('redis');
        // Construct the Schema and Resolvers
        const gqlConfig = yield graphql_1.importConfig();
        const gqlSchema = schemas || gqlConfig.schema;
        const gqlResolvers = resolvers || gqlConfig.resolvers;
        // Set up the Redis Cache for GraphQL if Redis is configured
        let cache;
        if (redisConfig !== undefined)
            cache = new apollo_server_cache_redis_1.RedisCache({ url: redisConfig.url });
        // Create the server.
        const gqlServer = new apollo_server_express_1.ApolloServer({
            typeDefs: gqlSchema,
            resolvers: gqlResolvers,
            cache,
            context: ({ req, res }) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    req,
                    res,
                    Configs: configs_1.default,
                });
            }),
            playground: {
                settings: {
                    'request.credentials': 'include',
                },
            },
        });
        gqlServer.applyMiddleware({
            app,
            path: '/graphql',
            cors: {
                origin: corsUrls,
                credentials: true,
            },
        });
        return gqlServer;
    });
}
exports.default = routes;
//# sourceMappingURL=routes.graphql.js.map