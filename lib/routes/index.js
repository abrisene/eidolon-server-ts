"use strict";
/*
 * routes/index.ts
 * Route Index
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Dependencies
 */
const path_1 = __importDefault(require("path"));
const koa_router_1 = __importDefault(require("koa-router"));
// import koaRouter from 'koa-router';
const koa_views_1 = __importDefault(require("koa-views"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_logger_1 = __importDefault(require("koa-logger"));
// import express, { Application } from 'express';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import cors, { CorsOptions } from 'cors';
// import logger from 'morgan';
const koa_passport_1 = __importDefault(require("koa-passport"));
const passport_1 = __importDefault(require("../passport"));
const middleware_auth_1 = require("./middleware.auth");
const routes_graphql_1 = __importDefault(require("./routes.graphql"));
const routes_auth_1 = __importDefault(require("./routes.auth"));
const configs_1 = __importDefault(require("../configs"));
/**
 * Module Exports
 */
// export * from './middleware.common';
// export * from './middleware.auth';
function default_1(app, server) {
    return __awaiter(this, void 0, void 0, function* () {
        const { appName, env } = configs_1.default.getConfig('environment');
        const { corsUrls } = configs_1.default.getConfig('server');
        // Create the Router
        const router = new koa_router_1.default();
        app
            .use(router.routes())
            .use(router.allowedMethods());
        // Settings
        app.use(koa_views_1.default(path_1.default.join(__dirname, '../views'), { extension: 'pug' }));
        app.use(koa_static_1.default(path_1.default.join(__dirname, '../../public')));
        // app.disable('x-powered-by');
        // Middleware Configs
        app.use(koa_bodyparser_1.default());
        app.use(cors_1.default({ origin: corsUrls, credentials: true }));
        if (env === 'production')
            app.use(koa_logger_1.default());
        app.use(koa_passport_1.default.initialize());
        yield passport_1.default();
        app.use(middleware_auth_1.authenticate.optional);
        // // Routes
        yield routes_graphql_1.default(app, server);
        if (configs_1.default.getConfig('mongodb'))
            yield routes_auth_1.default(app, router, server);
        return;
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map