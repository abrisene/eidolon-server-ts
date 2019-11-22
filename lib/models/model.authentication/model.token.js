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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Dependencies
 */
const mongoose_1 = __importStar(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
/*
 * Utility Methods
 */
/**
 * Generates a hash for a token.
 * @param len Length of the token.
 */
function generateToken(len = 32) {
    return crypto_1.default.randomBytes(len).toString('hex');
}
/*
 * Schema
 */
const schema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId },
    type: { type: String, required: true },
    token: { type: String, required: true, default: () => generateToken() },
    uses: { type: Number, default: 1 },
    persist: { type: Boolean, default: false },
    tsExpiration: { type: Date, default: Date.now() + (86400 * 3 * 1000) },
    tsRedeemed: [Date],
}, {
    timestamps: {
        createdAt: 'tsCreated',
        updatedAt: 'tsUpdated',
    },
});
schema.index({ tsExpiration: 1 }, {
    expireAfterSeconds: 0,
    partialFilterExpresson: { persist: false },
});
/**
 * Schema Methods
 */
/**
 * Redeems a token if it has uses remaining and hasn't expired.
 * @param save Should the token be saved during redemption?
 *             If you're using a session you probably want to handle this manually.
 * @param session The session to be used for the redemption transaction.
 */
schema.methods.redeem = function (save = true, session) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ts = Date.now();
            if (this.uses <= 0)
                throw new Error(`Token ${this.token} has no uses remaining`);
            if (ts > this.tsExpiration)
                throw new Error(`Token ${this.token} has expired.`);
            if (this.tsRedeemed === undefined)
                this.tsRedeemed = [];
            this.tsRedeemed.push(ts);
            this.uses -= 1;
            if (save)
                yield this.save({ session });
            return true;
        }
        catch (err) {
            if (session)
                session.abortTransaction();
            return err;
        }
    });
};
/*
 * Module Exports
 */
// export default mongoose.model<IToken>('Token', schema);
exports.Token = mongoose_1.default.model('Token', schema);
//# sourceMappingURL=model.token.js.map