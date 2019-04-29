"use strict";
/*
 * config.auth.jwt.ts
 * JSON Web Token Configuration
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Dependencies
 */
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utilities_1 = __importDefault(require("../utilities"));
const index_1 = __importDefault(require("./index"));
dotenv_1.default.config();
const { jsonTryParse, exists } = utilities_1.default;
/*
 * Constants
 */
exports.key = 'jwt';
exports.category = 'auth';
/*
 * Utility Methods
 */
/**
 * Generates a curried method for signing JWTs with injected options.
 * @param options JWT Configuration Options
 */
function initJWTGenerator(options) {
    const generator = (payload, subject, expiration) => {
        const { secretKey } = options, rest = __rest(options, ["secretKey"]);
        const config = {
            subject,
            expiresIn: expiration || rest.expiration,
            issuer: rest.issuer,
            audience: rest.audience,
        };
        return jsonwebtoken_1.default.sign(payload, secretKey, config);
    };
    return generator;
}
/*
 * Loader
 */
function configure() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const options = {
                secretKey: process.env.JWT_SECRET || 'secret',
                issuer: process.env.JWT_ISSUER,
                audience: process.env.JWT_AUDIENCE,
                expiration: process.env.JWT_EXPIRATION || '1d',
            };
            const generateJWT = initJWTGenerator(options);
            const config = Object.assign({}, options, { generateJWT });
            index_1.default.emit('jwt auth initialized');
            console.log(chalk_1.default.green.bold('>> JWT Auth Initialized <<'));
            index_1.default.addConfig(exports.key, config, exports.category);
            return config;
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.default = configure;
//# sourceMappingURL=config.auth.jwt.js.map