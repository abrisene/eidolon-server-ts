"use strict";
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
/*
 * graphql/resolvers/index.ts
 * GraphQL Resolver Index
 */
/*
 * Module Dependencies
 */
const utilities_1 = __importDefault(require("../../utilities"));
const { importPattern } = utilities_1.default;
/*
 * Module Exports
 */
function importResolvers(location = __dirname) {
    return __awaiter(this, void 0, void 0, function* () {
        let resolvers = { Query: {}, Mutation: {} };
        yield importPattern(/^(resolvers).*.js$/, (resolver) => __awaiter(this, void 0, void 0, function* () {
            const _a = resolver.default, { Query, Mutation } = _a, rest = __rest(_a, ["Query", "Mutation"]);
            resolvers = Object.assign({ Query: Object.assign({}, resolvers.Query, Query), Mutation: Object.assign({}, resolvers.Mutation, Mutation) }, rest);
        }), location);
        return resolvers;
    });
}
exports.importResolvers = importResolvers;
//# sourceMappingURL=index.js.map