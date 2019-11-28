"use strict";
/*
 * middleware.auth.ts
 * Authentication Middleware
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
/**
 * Module Exports
 */
/**
 * Middleware to generate a JWT if the request contains a valid user.
 * @param ctx Koa context.
 * @param next Next function callback.
 */
function generateUserToken(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // const user: any = req.user;
        const user = ctx.state.user;
        const { useHttps } = configs_1.default.getConfig('server');
        if (!user) {
            ctx.throw(400, 'Could not login: User not found.');
        }
        else {
            const token = user.generateJWT();
            ctx.cookies.set('jwt', token, { httpOnly: true, secure: useHttps });
            next();
        }
    });
}
exports.generateUserToken = generateUserToken;
/**
 * Middleware to clear the JWT from the current user's cookies.
 * @param ctx Koa context.
 * @param next Next function callback.
 */
function clearUserToken(ctx, next) {
    const { useHttps } = configs_1.default.getConfig('server');
    ctx.cookies.set('jwt', '', { httpOnly: true, secure: useHttps });
    next();
}
exports.clearUserToken = clearUserToken;
/**
 * Middleware to require JWT authentication. Injects user into Request.
 * @param ctx Koa context.
 * @param next Next function callback.
 */
function authenticateJwtRequired(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        return ctx.state.user ? next() : passport_1.default.authenticate(['jwt'], { session: false }, (err, user) => {
            ctx.state.user = user;
            return user ? next() : ctx.throw(401, 'Could not authenticate JWT');
        })(ctx, next);
    });
}
/**
 * Middleware for optional JWT authentication. Injects user into Request.
 * @param ctx Koa context.
 * @param next Next function callback.
 */
function authenticateJwtOptional(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        return ctx.state.user ? next() : passport_1.default.authenticate(['jwt'], { session: false }, (err, user) => {
            ctx.state.user = user;
            return next();
        })(ctx, next);
    });
}
exports.authenticate = {
    required: authenticateJwtRequired,
    optional: authenticateJwtOptional,
};
//# sourceMappingURL=middleware.auth.js.map