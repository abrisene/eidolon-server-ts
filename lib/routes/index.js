"use strict";
/*
 * routes/index.ts
 * Route Index
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
/**
 * Module Dependencies
 */
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const routes_graphql_1 = __importDefault(require("./routes.graphql"));
const configs_1 = __importDefault(require("../configs"));
/**
 * Module Exports
 */
function default_1(app, server) {
    return __awaiter(this, void 0, void 0, function* () {
        const { appName, env } = configs_1.default.getConfig('environment');
        const { corsUrls } = configs_1.default.getConfig('server');
        // Express Settings
        app.set('view engine', 'pug');
        app.set('views', path_1.default.join(__dirname, '../views'));
        app.disable('x-powered-by');
        // Middleware Configs
        app.use(cors_1.default({ origin: corsUrls, credentials: true }));
        app.use(express_1.default.static('public'));
        if (env === 'production')
            app.use(morgan_1.default('combined'));
        app.use(cookie_parser_1.default());
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        app.use(body_parser_1.default.json());
        // Routes
        yield routes_graphql_1.default(server);
        return;
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map