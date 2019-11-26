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
// import koaRouter from 'koa-router';
const koa_views_1 = __importDefault(require("koa-views"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_logger_1 = __importDefault(require("koa-logger"));
// import authStrategies from '../passport';
const routes_graphql_1 = __importDefault(require("./routes.graphql"));
// import authRoutes from './routes.auth';
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
        // Settings
        app.use(koa_views_1.default(path_1.default.join(__dirname, '../views'), { extension: 'pug' }));
        app.use(koa_static_1.default(path_1.default.join(__dirname, '../../public')));
        // app.set('view engine', 'pug');
        // app.set('views', path.join(__dirname, '../views'));
        // app.disable('x-powered-by');
        // Middleware Configs
        app.use(koa_bodyparser_1.default());
        app.use(cors_1.default({ origin: corsUrls, credentials: true }));
        if (env === 'production')
            app.use(koa_logger_1.default());
        // const corsOptions: CorsOptions = { origin: corsUrls, credentials: true };
        // app.use(cors(corsOptions));
        // app.use('/static', express.static(path.join(__dirname, '../../public')));
        // if (env === 'production') app.use(logger('combined'));
        // app.use(bodyParser.urlencoded({ extended: true }));
        // app.use(bodyParser.json());
        // app.use(cookieParser());
        // app.use(passport.initialize());
        // await authStrategies();
        // // Routes
        yield routes_graphql_1.default(app, server);
        // if (Configs.getConfig('mongodb')) await authRoutes(app, server);
        return;
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map