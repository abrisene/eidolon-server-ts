"use strict";
/*
 * auth.local.ts
 * Local Strategy for Passport
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Dependencies
 */
const passport_local_1 = require("passport-local");
const models_1 = require("../models");
/**
 * Constants
 */
const options = {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
};
/**
 * Module Exports
 */
/**
 * Builds Local Passport Strategy for Middleware
 */
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        return new passport_local_1.Strategy(options, (email, password, done) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield models_1.User.authenticateEmail(email, password);
                return done(null, result);
            }
            catch (err) {
                return done(err, false);
            }
        }));
    });
}
exports.default = default_1;
//# sourceMappingURL=auth.local.js.map