"use strict";
/*
 * middleware.auth.ts
 * Authentication Express Middleware
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
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.generateUserToken = generateUserToken;
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