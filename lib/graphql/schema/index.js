"use strict";
/*
 * graphql/schea/index.ts
 * GraphQL Schema Index
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
const apollo_server_express_1 = require("apollo-server-express");
const utilities_1 = __importDefault(require("../../utilities"));
const { importPattern } = utilities_1.default;
/*
 * Utility Methods
 */
function combineResolvers(oldResolver, newResolver) {
    const { Query: oldQuery = {}, Mutation: oldMutation = {} } = oldResolver, oldRest = __rest(oldResolver, ["Query", "Mutation"]);
    const { Query: newQuery = {}, Mutation: newMutation = {} } = newResolver, newRest = __rest(newResolver, ["Query", "Mutation"]);
    return Object.assign({ Query: Object.assign({}, oldQuery, newQuery), Mutation: Object.assign({}, oldMutation, newMutation) }, oldRest, newRest);
}
/*
 * Default Schema
 */
const linkSchema = apollo_server_express_1.gql `
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;
/*
 * Module Exports
 */
function importSchema(location = __dirname, init = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = init ? [linkSchema] : [];
        let resolvers = { Query: {}, Mutation: {} };
        // Load the schema and resolvers.
        yield importPattern(/^(schema|scalar).*.js$/, (module, file) => __awaiter(this, void 0, void 0, function* () {
            schema.push(module.schema);
            if (module.resolvers !== undefined)
                resolvers = combineResolvers(resolvers, module.resolvers);
        }), location);
        return { schema, resolvers };
    });
}
exports.importSchema = importSchema;
//# sourceMappingURL=index.js.map