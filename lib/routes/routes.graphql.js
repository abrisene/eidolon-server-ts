"use strict";
/*
 * routes.graphql.ts
 * GraphQL Routes
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_koa_1 = require("apollo-server-koa");
const apollo_server_cache_redis_1 = require("apollo-server-cache-redis");
const configs_1 = __importDefault(require("../configs"));
const models = __importStar(require("../models"));
/**
 * Constants
 */
/**
 * Returns a context for the Apollo Server.
 * @param ctx The Koa Context.
 */
function bindContext({ ctx }) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            ctx,
            req: ctx.request,
            res: ctx.response,
            user: ctx.state.user,
            Configs: configs_1.default,
            models,
        };
    });
}
/**
 * Module Exports
 */
function routes(app, server) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get Configuration Variables
        const { corsUrls } = configs_1.default.getConfig('server');
        const redisConfig = configs_1.default.getConfig('redis');
        // Get the Schema and Resolvers from the Server
        const gqlConfig = server.gqlSchema;
        const redisHost = redisConfig ? redisConfig.url : undefined;
        // Set up the Redis Cache for GraphQL if Redis is configured
        let cache;
        // if (redisConfig !== undefined) cache = new RedisCache({ url: redisConfig.url });
        if (redisHost)
            cache = new apollo_server_cache_redis_1.RedisCache({ host: redisHost }); // TODO: Test This
        // Create the server.
        const gqlServer = new apollo_server_koa_1.ApolloServer({
            typeDefs: gqlConfig.schema,
            resolvers: gqlConfig.resolvers,
            cache,
            context: bindContext,
            /* context: async ({ ctx }: { ctx: Koa.Context }) => ({
              ctx,
              req: ctx.request,
              res: ctx.response,
              Configs,
              user: ctx.state.user,
              models,
            }), */
            playground: {
                settings: {
                    'request.credentials': 'include',
                },
            },
        });
        // Apply Middleware
        // app.use('/graphql'/* , authenticate.optional */);
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