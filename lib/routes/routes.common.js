"use strict";
/*
 * routes.common.ts
 * Common Routes
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
const middleware_common_1 = require("./middleware.common");
const middleware_auth_1 = require("./middleware.auth");
const models_1 = require("../models");
/**
 * Constants
 */
/* export const constants = {
  navConfig: [
    { text: 'About', href: '/about' },
  ],
}; */
/**
 * Module Exports
 */
function routes(app, router, server) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get Configuration Variables
        // NOTE: We don't need to use our authentication middleware, since we injected it on the router.
        // Index Route
        router.get('/', middleware_common_1.renderInjected('home', { header: 'Home' }));
        // Common routes
        // User Routes
        router.get('/login', middleware_common_1.renderInjected('login', { header: 'Login' }));
        router.get('/register', middleware_common_1.renderInjected('register', { header: 'Register' }));
        router.get('/profile', middleware_auth_1.authenticate.required, (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const identities = yield models_1.UserIdentity.find({ _id: { $in: ctx.state.user.identities } });
                ctx.state.config.identities = identities;
            }
            catch (err) {
                ctx.throw(400, err.message);
            }
            return next();
        }), middleware_common_1.renderInjected('profile', { header: 'Profile' }));
        return;
    });
}
exports.default = routes;
//# sourceMappingURL=routes.common.js.map