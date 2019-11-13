"use strict";
/*
 * graphql/index.ts
 * GraphQL Index
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Module Dependencies
 */
const path_1 = __importDefault(require("path"));
const apollo_server_express_1 = require("apollo-server-express");
const utilities_1 = __importDefault(require("../utilities"));
const { importPattern } = utilities_1.default;
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
const defaultConfig = {
    schema: [linkSchema],
    resolvers: {
        Query: {},
        Mutation: {},
    },
};
/*
 * Utility Methods
 */
/**
 * Combines two resolver objects into one.
 * @param oldResolver First resolver object.
 * @param newResolver Second resolver object.
 */
function combineResolvers(oldResolver, newResolver) {
    const { Query: oldQuery = {}, Mutation: oldMutation = {} } = oldResolver, oldRest = __rest(oldResolver, ["Query", "Mutation"]);
    const { Query: newQuery = {}, Mutation: newMutation = {} } = newResolver, newRest = __rest(newResolver, ["Query", "Mutation"]);
    return Object.assign(Object.assign({ Query: Object.assign(Object.assign({}, oldQuery), newQuery), Mutation: Object.assign(Object.assign({}, oldMutation), newMutation) }, oldRest), newRest);
}
/*
 * Module Exports
 */
/**
 * Loads GraphQL Schemas and Resolvers from a directory.
 * All filenames in the directory prepended with "schema." or "scalar." will be loaded.
 * @param location The directory to load schemas from.
 * @param init     The schema to initialize the import with. This defaults to the default schema.
 */
function importSchema(location = __dirname, init = defaultConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = init && init.schema ? init.schema : [];
        let resolvers = init && init.resolvers ? init.resolvers : { Query: {}, Mutation: {} };
        // let resolvers: IResolvers = { Query: {}, Mutation: {} };
        // Load the schema and resolvers.
        yield importPattern(/^(schema|scalar).*.js$/, (module) => __awaiter(this, void 0, void 0, function* () {
            if (module.schema)
                schema.push(module.schema);
            if (module.resolvers !== undefined)
                resolvers = combineResolvers(resolvers, module.resolvers);
        }), location);
        return { schema, resolvers };
    });
}
exports.importSchema = importSchema;
/**
 * Imports the default GraphQL Config from the files defined in graphql/schema
 */
function importGraphQLConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        return importSchema(path_1.default.join(__dirname, './schema'));
    });
}
exports.importGraphQLConfig = importGraphQLConfig;
//# sourceMappingURL=index.js.map