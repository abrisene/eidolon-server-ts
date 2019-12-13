"use strict";
/*
 * model.user.identity.ts
 * Mongoose User Identity Model
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
/**
 * Module Dependencies
 */
const mongoose_1 = __importDefault(require("mongoose"));
const typegoose_1 = require("@typegoose/typegoose");
const crypto_1 = __importDefault(require("crypto"));
/*
 * Interface
 */
/* export interface IToken extends Document {
  owner: Document;
  type: string;
  token: string;
  uses: number;
  persist: boolean;
  tsExpiration: Date;
  tsRedeemed: Date[];
  tsCreated: Date;
  tsUpdated: Date;
  redeem: (save: boolean, session?: any) => Promise<IValidationResponse>;
} */
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
const schemaOptions = {
    timestamps: {
        createdAt: 'tsCreated',
        updatedAt: 'tsUpdated',
    },
};
let Schema = class Schema extends typegoose_1.Typegoose {
    /**
     * Instance Methods
     */
    /**
     * Redeems a token if it has uses remaining and hasn't expired.
     * @param save Should the token be saved during redemption?
     *             If you're using a session you probably want to handle this manually.
     * @param session The session to be used for the redemption transaction.
     */
    redeem(save = true, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ts = Date.now();
                if (this.uses <= 0)
                    throw new Error(`Token ${this.token} has no uses remaining`);
                if (ts > this.tsExpiration.getMilliseconds())
                    throw new Error(`Token ${this.token} has expired.`);
                if (this.tsRedeemed === undefined)
                    this.tsRedeemed = [];
                this.tsRedeemed.push(new Date(ts));
                this.uses -= 1;
                if (save)
                    yield this.save({ session });
                return { success: true, msg: 'Successfully redeemed token.' };
            }
            catch (err) {
                if (session)
                    session.abortTransaction();
                return { success: false, err, msg: err.message };
            }
        });
    }
};
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", mongoose_1.default.Schema.Types.ObjectId)
], Schema.prototype, "owner", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Schema.prototype, "type", void 0);
__decorate([
    typegoose_1.prop({ index: true, required: true, unique: true, default: generateToken }),
    __metadata("design:type", String)
], Schema.prototype, "token", void 0);
__decorate([
    typegoose_1.prop({ default: 1 }),
    __metadata("design:type", Number)
], Schema.prototype, "uses", void 0);
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], Schema.prototype, "persist", void 0);
__decorate([
    typegoose_1.prop({ default: Date.now() + 86400 * 3 * 1000 }),
    __metadata("design:type", Date)
], Schema.prototype, "tsExpiration", void 0);
__decorate([
    typegoose_1.arrayProp({ items: Date }),
    __metadata("design:type", Array)
], Schema.prototype, "tsRedeemed", void 0);
Schema = __decorate([
    typegoose_1.modelOptions({ schemaOptions }),
    typegoose_1.index({ tsExpiration: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { persist: false } })
], Schema);
exports.Token = typegoose_1.getModelForClass(Schema);
/* export const Token = new Schema().getModelForClass(Schema, {
  existingMongoose: mongoose,
  schemaOptions,
}); */
/* export const UserModel = new User().getModelForClass(User, {
  existingMongoose: mongoose,
  //  had many problems without that definition of the collection name
  //  so better define it
  //                        |
  //                        v
  schemaOptions: { collection: 'users' }
}) */
/* const schema = new Schema({
  owner: { type: Schema.Types.ObjectId },
  type: { type: String, required: true },
  token: { type: String, required: true, default: () => generateToken() },
  uses: { type: Number, default: 1 },
  persist: { type: Boolean, default: false },
  tsExpiration: { type: Date, default: Date.now() + (86400 * 3 * 1000) },
  tsRedeemed: [Date],
},
{
  timestamps: {
    createdAt: 'tsCreated',
    updatedAt: 'tsUpdated',
  },
});

schema.index(
  { tsExpiration: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpresson: { persist: false },
  },
); */
/**
 * Schema Methods
 */
/**
 * Redeems a token if it has uses remaining and hasn't expired.
 * @param save Should the token be saved during redemption?
 *             If you're using a session you probably want to handle this manually.
 * @param session The session to be used for the redemption transaction.
 */
/* schema.methods.redeem = async function(save: boolean = true, session?: any): Promise<IValidationResponse> {
  try {
    const ts = Date.now();
    if (this.uses <= 0) throw new Error(`Token ${this.token} has no uses remaining`);
    if (ts > this.tsExpiration) throw new Error(`Token ${this.token} has expired.`);
    if (this.tsRedeemed === undefined) this.tsRedeemed = [];
    this.tsRedeemed.push(ts);
    this.uses -= 1;
    if (save) await this.save({ session });
    return { success: true, msg: 'Successfully redeemed token.' };
  } catch (err) {
    if (session) session.abortTransaction();
    return { success: false, err, msg: err.message };
  }
}; */
/*
 * Module Exports
 */
// export default mongoose.model<IToken>('Token', schema);
// export const Token = mongoose.model<IToken>('Token', schema);
//# sourceMappingURL=model.token.js.map