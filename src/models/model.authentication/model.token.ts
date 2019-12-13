/*
 * model.user.identity.ts
 * Mongoose User Identity Model
 */

/**
 * Module Dependencies
 */

import mongoose from 'mongoose';
import {
  arrayProp,
  getModelForClass,
  index,
  modelOptions,
  prop,
  Typegoose,
} from '@typegoose/typegoose';
import crypto from 'crypto';
import { IValidationResponse } from '../model.user/methods.user.authentication';

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
function generateToken(len = 32): string {
  return crypto.randomBytes(len).toString('hex');
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

@modelOptions({ schemaOptions })
@index(
  { tsExpiration: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { persist: false } },
)
class Schema extends Typegoose {
  @prop()
  public owner: mongoose.Schema.Types.ObjectId;

  @prop({ required: true })
  public type: String;

  @prop({ index: true, required: true, unique: true, default: generateToken })
  public token: String;

  @prop({ default: 1 })
  public uses: number;

  @prop({ default: false })
  public persist: boolean;

  @prop({ default: Date.now() + 86400 * 3 * 1000 })
  public tsExpiration: Date;

  @arrayProp({ items: Date })
  public tsRedeemed: Date[];

  /**
   * Instance Methods
   */

  /**
   * Redeems a token if it has uses remaining and hasn't expired.
   * @param save Should the token be saved during redemption?
   *             If you're using a session you probably want to handle this manually.
   * @param session The session to be used for the redemption transaction.
   */
  public async redeem(save: boolean = true, session?: any): Promise<IValidationResponse> {
    try {
      const ts = Date.now();
      if (this.uses <= 0)
        throw new Error(`Token ${this.token} has no uses remaining`);
      if (ts > this.tsExpiration.getMilliseconds())
        throw new Error(`Token ${this.token} has expired.`);
      if (this.tsRedeemed === undefined) this.tsRedeemed = [];
      this.tsRedeemed.push(new Date(ts));
      this.uses -= 1;
      if (save) await this.save({ session });
      return { success: true, msg: 'Successfully redeemed token.' };
    } catch (err) {
      if (session) session.abortTransaction();
      return { success: false, err, msg: err.message };
    }
  }
}

export const Token = getModelForClass(Schema);

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
