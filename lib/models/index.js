"use strict";
/*
 * models/index.ts
 * Models Index
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Module Dependencies
 */
const model_user_schema_1 = __importDefault(require("./model.user/model.user.schema"));
const model_user_identity_1 = __importDefault(require("./model.user/model.user.identity"));
const model_token_1 = __importDefault(require("./model.authentication/model.token"));
/*
 * Module Exports
 */
exports.default = {
    User: model_user_schema_1.default,
    Identity: model_user_identity_1.default,
    Token: model_token_1.default,
};
//# sourceMappingURL=index.js.map