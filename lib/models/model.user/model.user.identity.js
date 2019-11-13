"use strict";
/*
 * model.user.identity.ts
 * Mongoose User Identity Model
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Dependencies
 */
const mongoose_1 = __importStar(require("mongoose"));
/*
 * Constants
 */
exports.constants = {
    token: {
        validateIdentity: 'VALIDATE_IDENTITY',
    },
};
/*
 * Schema
 */
const schema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    emailPrimary: { type: String, trim: true },
    emails: [{ type: String, trim: true }],
    type: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true },
    source: { type: String, required: true, trim: true },
    tsValidated: Date,
    tsAccessed: [Date],
}, {
    timestamps: {
        createdAt: 'tsCreated',
        updatedAt: 'tsUpdated',
    },
});
/*
 * Schema Methods
 */
/**
 * Generates a token with the identity as owner.
 * @param type     The type of token to generate.
 * @param duration The token's duration.
 */
schema.methods.generateToken = function (type, duration = 86400) {
    return __awaiter(this, void 0, void 0, function* () {
        const Token = this.db.model('Token');
        const token = new Token({
            owner: this._id,
            type,
            tsExpiration: Date.now() + (duration * 1000),
        });
        return token.save();
    });
};
/*
 * Static Schema Methods
 */
/**
 * Validates an identity with a token hash.
 * Saves both the Identity and Token documents.
 * @param hash A hash matching the validation token's hash.
 */
schema.statics.validateWithToken = function (hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const Identity = this;
        const Token = this.db.model('Token');
        const { validateIdentity } = exports.constants.token;
        try {
            const token = yield Token.findOne({ token: hash });
            if (!token)
                throw new Error(`Could not find token ${hash}.`);
            if (token.type !== validateIdentity)
                throw new Error(`Token ${token} (${token.type}) cannot be used to validate identity.`);
            const identity = yield Identity.findOne({ _id: token.owner });
            if (!identity)
                throw new Error(`Could not find identity for token ${token}.`);
            const redeemed = yield token.redeem();
            identity.tsValidated = redeemed.tsRedeemed.pop();
            return identity.save();
        }
        catch (err) {
            return err;
        }
    });
};
/*
 * Module Exports
 */
exports.default = mongoose_1.default.model('User Identity', schema);
//# sourceMappingURL=model.user.identity.js.map