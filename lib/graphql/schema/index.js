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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const utilities_1 = __importDefault(require("../../utilities"));
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
/*
 * Module Exports
 */
function importSchemas(location = __dirname, init = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const schemas = [];
        yield importPattern(/^(schema|scalar).*.js$/, (schema) => __awaiter(this, void 0, void 0, function* () {
            schemas.push(schema.default);
            return;
        }), location);
        const result = !init ? schemas : [linkSchema, ...schemas];
        return result;
    });
}
exports.importSchemas = importSchemas;
exports.default = [
    linkSchema,
];
//# sourceMappingURL=index.js.map