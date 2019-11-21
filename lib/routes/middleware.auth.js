"use strict";
/*
 * middleware.auth.ts
 * Authentication Express Middleware
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Dependencies
 */
const passport_1 = __importDefault(require("passport"));
/**
 * Module Exports
 */
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