"use strict";
/*
 * model.user.schema.ts
 * Mongoose User Model Schema
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.User = void 0;
/**
 * Module Dependencies
 */
const mongoose_1 = __importStar(require("mongoose"));
const utilities_1 = require("../../utilities");
const methods_user_authentication_1 = __importDefault(require("./methods.user.authentication"));
/*
 * Schema
 */
const schema = new mongoose_1.Schema({
    emailPrimary: { type: String, trim: true },
    emails: [{ type: String, trim: true }],
    identityPrimary: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'UserIdentity' }],
    identities: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'UserIdentity' }],
    roles: [String],
    hash: [String],
    tsLogin: [Date],
}, {
    timestamps: {
        createdAt: 'tsCreated',
        updatedAt: 'tsUpdated',
    },
});
/*
 * Schema Virtual Methods
 */
/*
 * Schema Static Methods
 */
/**
 * Finds a user by the provided id and populates all fields.
 * @param id The id of the user to be returned.
 */
schema.statics.findById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.findOne({ _id: id })
            .populate('identityPrimary')
            .populate('identities');
    });
};
/* schema.statics.findByEmail = async function(email: string): Promise<IUser> {

}; */
/*
 * Schema Stitching
 */
utilities_1.stitchMongooseSchema(schema, methods_user_authentication_1.default);
/*
 * Module Exports
 */
exports.User = mongoose_1.default.model('User', schema);
//# sourceMappingURL=model.user.schema.js.map