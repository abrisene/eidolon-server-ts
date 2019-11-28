"use strict";
/*
 * routes.auth.ts
 * Authorization Routes
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
const passport_1 = __importDefault(require("passport"));
const configs_1 = __importDefault(require("../configs"));
const models_1 = require("../models");
const middleware_common_1 = require("./middleware.common");
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
            .get('/auth/logout', middleware_common_1.injectMessage({ msg: 'Successfully logged out.', type: 'success' }), (ctx) => ctx.redirect('/'))
            .post('/auth/logout', (ctx) => ctx.body = ({ success: true, msg: 'Successfully logged out.' }));
        // Account Recovery
        router
            .get('/recover/', middleware_common_1.renderInjected('recover'))
            .post('/recover/', (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield models_1.User.requestPasswordReset(ctx.request.body.email);
                if (!request.success)
                    throw new Error(request.msg);
                return ctx.redirect('/login');
            }
            catch (err) {
                return ctx.throw(500, err.message);
            }
        }))
            .get('/recover/:token', (ctx) => middleware_common_1.renderInjected('recover', { token: ctx.params.token })(ctx))
            .post('/recover/:token', (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield models_1.User.setPasswordWithToken(ctx.params.token, ctx.request.body.password);
                if (!request.success)
                    throw new Error(request.msg);
                return ctx.redirect('/login');
            }
            catch (err) {
                return ctx.throw(403, err.message);
            }
        }));
        // Account Verification
        router.get('/validate/email/:token', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield models_1.UserIdentity.validateWithToken(ctx.params.token);
                if (!request.success)
                    throw new Error(request.msg);
                return ctx.redirect('/profile');
            }
            catch (err) {
                ctx.throw(500, err.message);
            }
        }));
        // Email / Password Login Routes
        router.post('/auth/login', passport_1.default.authenticate(['local'], { session: false, failureRedirect: '/login' }), (ctx) => ctx.redirect('/profile'));
        router.post('/auth/register', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield models_1.User.authenticateEmail(ctx.request.body.email, ctx.request.body.password, true);
                if (request.err)
                    throw new Error(request.err.message);
                ctx.state.user = request.user;
                return next();
            }
            catch (err) {
                ctx.throw(403, err);
            }
        }), middleware_auth_1.generateUserToken, ctx => ctx.redirect('/profile'));
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
            }), middleware_auth_1.generateUserToken, middleware_common_1.injectMessage({ msg: 'Successfully logged in.', type: 'success' }), (ctx) => ctx.redirect('/'));
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
            }), middleware_auth_1.generateUserToken, middleware_common_1.injectMessage({ msg: 'Successfully logged in.', type: 'success' }), (ctx) => ctx.redirect('/'));
        }
        return;
    });
}
exports.default = routes;
//# sourceMappingURL=routes.auth.js.map