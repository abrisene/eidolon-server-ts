"use strict";
/*
 * graphql/index.ts
 * GraphQL Index
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Module Dependencies
 */
const schema_1 = __importDefault(require("./schema"));
const resolvers_1 = __importDefault(require("./resolvers"));
/*
 * Resolvers
 */
exports.schema = schema_1.default;
exports.resolvers = resolvers_1.default;
//# sourceMappingURL=index.js.map