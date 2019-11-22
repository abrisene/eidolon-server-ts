"use strict";
/*
 * middleware.auth.ts
 * Authentication Express Middleware
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const configs_1 = __importDefault(require("../configs"));
// import { IUser } from '../models';
/**
 * Module Exports
 */
/**
 * Middleware to generate a JWT if the request contains a valid user.
 * @param req Express request.
 * @param res Express response.
 * @param next Express callback.
 */
function generateUserToken(req, res, next) {
    const user = req.user;
    const { useHttps } = configs_1.default.getConfig('server');
    if (!user) {
        res.status(400).send({ err: 'Could not login' });
    }
    else {
        const token = user.generateJWT();
        res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
        next();
    }
}
exports.generateUserToken = generateUserToken;
/**
 * Middleware to clear the JWT from the current user's cookies.
 * @param req Express request.
 * @param res Express response.
 * @param next Express callback.
 */
function clearUserToken(req, res, next) {
    const { useHttps } = configs_1.default.getConfig('server');
    res.cookie('jwt', '', { httpOnly: true, secure: useHttps });
    next();
}
exports.clearUserToken = clearUserToken;
/**
 * Middleware to require JWT authentication. Injects user into Request.
 * @param req Express request.
 * @param res Express response.
 * @param next Express callback.
 */
function authenticateJwtRequired(req, res, next) {
    return passport_1.default.authenticate(['jwt'], { session: false }, (err, user) => {
        req.user = user;
        return user ? next() : res.status(401);
    })(req, res, next);
}
/**
 * Middleware for optional JWT authentication. Injects user into Request.
 * @param req Express request.
 * @param res Express response.
 * @param next Express callback.
 */
function authenticateJwtOptional(req, res, next) {
    return passport_1.default.authenticate(['jwt'], { session: false }, (err, user) => {
        req.user = user;
        return next();
    })(req, res, next);
}
exports.authenticate = {
    required: authenticateJwtRequired,
    optional: authenticateJwtOptional,
};
//# sourceMappingURL=middleware.auth.js.map