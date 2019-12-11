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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Dependencies
 */
const path_1 = __importDefault(require("path"));
const koa_views_1 = __importDefault(require("koa-views"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_passport_1 = __importDefault(require("koa-passport"));
const passport_1 = __importDefault(require("../passport"));
const middleware_common_1 = require("./middleware.common");
const middleware_auth_1 = require("./middleware.auth");
const routes_graphql_1 = __importDefault(require("./routes.graphql"));
const routes_common_1 = __importDefault(require("./routes.common"));
const routes_auth_1 = __importDefault(require("./routes.auth"));
const configs_1 = __importDefault(require("../configs"));
/**
 * Module Exports
 */
const middlewareCommon = __importStar(require("./middleware.common"));
const middlewareAuth = __importStar(require("./middleware.auth"));
exports.middleware = Object.assign(Object.assign({}, middlewareCommon), middlewareAuth);
function default_1(app, router, server) {
    return __awaiter(this, void 0, void 0, function* () {
        const { appName, env } = configs_1.default.getConfig('environment');
        const { corsUrls } = configs_1.default.getConfig('server');
        const { host } = configs_1.default.getConfig('uris');
        const routeConfig = { title: appName, appName, env, host };
        // App Middleware Configs
        app.use(koa_bodyparser_1.default());
        app.use(cors_1.default({ origin: corsUrls, credentials: true }));
        app.use(koa_static_1.default(path_1.default.join(__dirname, '../../public')));
        app.use(koa_views_1.default(path_1.default.join(__dirname, '../../views'), { extension: 'pug' }));
        if (env === 'production')
            app.use(koa_logger_1.default());
        // Authentication Configs
        app.use(koa_passport_1.default.initialize());
        yield passport_1.default();
        // Create the Router
        // const router = new Router();
        app
            .use(router.routes())
            .use(router.allowedMethods());
        // Router Middleware Configs
        // router.use(bodyParser());
        // router.use(cors({ origin: corsUrls, credentials: true }));
        router.use(koa_views_1.default(path_1.default.join(__dirname, '../../views'), { extension: 'pug' }));
        router.use(middleware_auth_1.authenticate.optional);
        router.use(middleware_common_1.injectConfig('config', routeConfig));
        // // Routes
        yield routes_common_1.default(app, router, server);
        yield routes_graphql_1.default(app, router, server);
        if (configs_1.default.getConfig('mongodb'))
            yield routes_auth_1.default(app, router, server);
        app.use(middleware_common_1.renderInjected('404'));
        return;
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map