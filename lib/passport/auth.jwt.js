"use strict";
/*
 * auth.jwt.ts
 * JWT Strategy for Passport
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
const passport_jwt_1 = require("passport-jwt");
const configs_1 = __importDefault(require("../configs"));
const models_1 = require("../models");
/**
 * Constants
 */
const extractors = [
    // Note, this will fail if https is not enabled. Cookie is signed with secure.
    (req) => {
        let jwt;
        if (req !== undefined && req.cookies !== undefined) {
            jwt = req.cookies.jwt || req.cookies.bearer;
        }
        return jwt;
    },
    passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
];
/**
 * Module Exports
 */
/**
 * Builds JWT Passport Strategy for Middleware
 */
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = configs_1.default.getConfig('jwt').options;
        options.jwtFromRequest = passport_jwt_1.ExtractJwt.fromExtractors(extractors);
        return new passport_jwt_1.Strategy(options, (payload, done) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.User.findOne({ _id: payload.sub });
                return user ? done(null, user) : done(null, false);
            }
            catch (err) {
                return done(err, false);
            }
        }));
    });
}
exports.default = default_1;
//# sourceMappingURL=auth.jwt.js.map