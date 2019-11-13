"use strict";
/*
 * model.user.schema.ts
 * Mongoose User Model Schema
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Dependencies
 */
const mongoose_1 = __importStar(require("mongoose"));
const utilities_1 = __importDefault(require("../../utilities"));
const methods_user_identity_1 = __importDefault(require("./methods.user.identity"));
const methods_user_authentication_1 = __importDefault(require("./methods.user.authentication"));
const { stitchMongooseSchema } = utilities_1.default;
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
stitchMongooseSchema(schema, methods_user_identity_1.default);
stitchMongooseSchema(schema, methods_user_authentication_1.default);
/*
 * Module Exports
 */
exports.default = mongoose_1.default.model('User', schema);
//# sourceMappingURL=model.user.schema.js.map