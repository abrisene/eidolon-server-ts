"use strict";
/*
 * routes.graphql.ts
 * GraphQL Routes
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_koa_1 = require("apollo-server-koa");
const apollo_server_cache_redis_1 = require("apollo-server-cache-redis");
const configs_1 = __importDefault(require("../configs"));
const models = __importStar(require("../models"));
const middleware_auth_1 = require("./middleware.auth");
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
function routes(app, router, server) {
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
            playground: {
                settings: {
                    'request.credentials': 'include',
                },
            },
        });
        // Apply Middleware
        // app.use('/graphql'/* , authenticate.optional */);
        router.use('/graphql', middleware_auth_1.authenticate.optional);
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