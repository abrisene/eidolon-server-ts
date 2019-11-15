"use strict";
/*
 * passport/index.ts
 * Passport Index
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
const auth_jwt_1 = __importDefault(require("./auth.jwt"));
const auth_local_1 = __importDefault(require("./auth.local"));
/*
const authJwt = require('./auth.jwt');
const authLocal = require('./auth.local');

const authGoogle = require('./auth.google');
const authGoogleToken = require('./auth.google.token');
const authFacebook = require('./auth.facebook');
const authFacebookToken = require('./auth.facebook.token');
// const authTwitter = require('./auth.twitter');
// const authLinkedIn = require('./auth.linkedin');
// const authPinterest = require('./auth.pinterest');
*/
/**
 * Module Exports
 */
function auth() {
    return __awaiter(this, void 0, void 0, function* () {
        const jwtStrategy = yield auth_jwt_1.default();
        const localStrategy = yield auth_local_1.default();
        // const googleStrategy = await authGoogle();
        // const googleTokenStrategy = await authGoogleToken();
        // const facebookStrategy = await authFacebook();
        // const facebookTokenStrategy = await authFacebookToken();
        // const twitterStrategy = await authTwitter;
        // const linkedInStrategy = await authLinkedIn;
        // const pinterestStrategy = await authPinterest;
        passport_1.default.use(jwtStrategy);
        passport_1.default.use(localStrategy);
        // if (config.getConfig('google').clientID) {
        //   passport.use(googleStrategy);
        //   passport.use(googleTokenStrategy);
        // }
        // if (Configs.getConfig('facebook').clientID) {
        //   passport.use(facebookStrategy);
        //   passport.use(facebookTokenStrategy);
        // }
    });
}
exports.default = auth;
//# sourceMappingURL=index.js.map