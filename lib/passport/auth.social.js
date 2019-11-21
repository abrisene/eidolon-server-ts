"use strict";
/*
 * auth.social.ts
 * Social Strategy for Passport
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
const passport_google_oauth_1 = require("passport-google-oauth");
// import { Strategy as GoogleTokenStrategy } from 'passport-google-token';
const passport_facebook_1 = require("passport-facebook");
// import * as FacebookTokenStrategy from 'passport-facebook-token';
const configs_1 = __importDefault(require("../configs"));
const models_1 = require("../models");
/**
 * Constants
 */
const G_CALLBACK_URL = '';
const FB_CALLBACK_URL = '';
/**
 * Returns mapped Options for the indicated social auth service from Configs.
 * @param service The key of the config used for the social service.
 */
function getOptions(service) {
    const callbackURL = service === 'facebook' ? FB_CALLBACK_URL : G_CALLBACK_URL;
    const { clientID, clientSecret } = configs_1.default.getConfig(service);
    const options = {
        clientID,
        clientSecret,
        callbackURL,
    };
    return options;
}
/**
 * Maps a Google Profile into the ISocialProfile Interface
 * @param profile A social profile passed from Google.
 */
function extractGoogleProfile(profile) {
    const result = {
        id: profile.id,
        email: profile.emails[0].value,
        emails: profile.emails.map(e => e.value),
        displayName: profile.displayName,
        gender: profile.gender,
        metadata: {
            name: profile.name,
            photoUrl: profile.photos,
        },
    };
    return result;
}
/**
 * Maps a Facebook Profile into the ISocialProfile Interface
 * @param profile A social profile passed from Facebook.
 */
function extractFacebookProfile(profile) {
    const result = {
        id: profile.id,
        email: profile.emails[0].value,
        emails: profile.emails.map(e => e.value),
        displayName: profile.displayName,
        gender: profile.gender,
        metadata: {
            name: profile.name,
            username: profile.username,
            profileUrl: profile.profileUrl,
        },
    };
    return result;
}
/**
 * Module Exports
 */
/**
 * Builds Google Passport Strategy for Middleware
 */
function authGoogle() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getOptions('google');
        return new passport_google_oauth_1.OAuth2Strategy(options, (accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
            const userData = extractGoogleProfile(profile);
            try {
                const result = yield models_1.User.authenticateSocial('google', userData);
                return done(null, result.user);
            }
            catch (err) {
                return done(err, false);
            }
        }));
    });
}
exports.authGoogle = authGoogle;
/**
 * Builds Facebook Passport Strategy for Middleware
 */
function authFacebook() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getOptions('facebook');
        return new passport_facebook_1.Strategy(options, (accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
            const userData = extractFacebookProfile(profile);
            try {
                const result = yield models_1.User.authenticateSocial('facebook', userData);
                return done(null, result.user);
            }
            catch (err) {
                return done(err, false);
            }
        }));
    });
}
exports.authFacebook = authFacebook;
//# sourceMappingURL=auth.social.js.map