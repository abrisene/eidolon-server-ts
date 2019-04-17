"use strict";
/*
 * graphql/index.ts
 * GraphQL Index
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
/*
 * Module Dependencies
 */
const path_1 = __importDefault(require("path"));
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
/*
 * Module Exports
 */
function importConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = yield schema_1.importSchemas(path_1.default.join(__dirname, './schema'), true);
        const resolvers = yield resolvers_1.importResolvers();
        return { schema, resolvers };
    });
}
exports.importConfig = importConfig;
exports.importSchemas = schema_1.importSchemas;
exports.importResolvers = resolvers_1.importResolvers;
//# sourceMappingURL=index.js.map