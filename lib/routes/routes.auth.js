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
const passport_1 = __importDefault(require("passport"));
const configs_1 = __importDefault(require("../configs"));
const models = __importStar(require("../models"));
const middleware_auth_1 = require("./middleware.auth");
/**
 * Module Exports
 */
function routes(app, router, server) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // Get Configuration Variables
        const facebook = configs_1.default.getConfig('facebook');
        const google = configs_1.default.getConfig('google');
        // Auth Testroutes
        router.get('/auth/secret', middleware_auth_1.authenticate.required, (ctx) => ctx.body = ctx.state.user);
        router.get('/auth/optional', middleware_auth_1.authenticate.optional, (ctx) => ctx.body = ctx.state.user);
        router.get('/auth/user', (ctx) => ctx.body = ctx.state.user);
        // "Session" Routes
        router
            .all('/auth/logout', middleware_auth_1.clearUserToken)
            .get('/auth/logout', (ctx) => ctx.body = ({ success: true, msg: 'Successfully logged out.' }))
            .post('/auth/logout', (ctx) => ctx.body = ({ success: true, msg: 'Successfully logged out.' }));
        // Social Login Routes
        // Facebook Authentication Routes
        if ((_a = facebook) === null || _a === void 0 ? void 0 : _a.clientID) {
            router
                .get('/auth/facebook', passport_1.default.authenticate(['facebook'], {
                session: false,
                failureRedirect: '/login',
                scope: facebook.profileFields,
            }))
                .get(facebook.callbackRoute, passport_1.default.authenticate(['facebook'], {
                session: false,
                failureRedirect: '/login',
            }), middleware_auth_1.generateUserToken, (ctx) => ctx.body = ({ success: true, msg: 'Successfully logged in via Facebook' }));
        }
        // Google Authentication Routes
        if ((_b = google) === null || _b === void 0 ? void 0 : _b.clientID) {
            router
                .get('/auth/google', passport_1.default.authenticate(['google'], {
                session: false,
                failureRedirect: '/login',
                scope: google.profileFields,
            }))
                .get(google.callbackRoute, passport_1.default.authenticate(['google'], {
                session: false,
                failureRedirect: '/login',
            }), middleware_auth_1.generateUserToken, (ctx) => ctx.body = ({ success: true, msg: 'Successfully logged in via Google' }));
        }
        // Token Validation Routes
        // Confirm Email with Token
        router.get('/validate/email/:token', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            const { token } = ctx.params;
            try {
                const redeem = yield models.UserIdentity.validateWithToken(token);
                if (!redeem.success)
                    throw new Error(redeem.msg);
                ctx.body = redeem;
            }
            catch (err) {
                ctx.body = err.message;
            }
        }));
    });
}
exports.default = routes;
//# sourceMappingURL=routes.auth.js.map