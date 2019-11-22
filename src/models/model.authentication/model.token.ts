/*
 * model.user.identity.ts
 * Mongoose User Identity Model
 */

/**
 * Module Dependencies
 */

import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

/*
 * Interface
 */

export interface IToken extends Document {
  owner: Document;
  type: string;
  token: string;
  uses: number;
  persist: boolean;
  tsExpiration: Date;
  tsRedeemed: Date[];
  tsCreated: Date;
  tsUpdated: Date;
  redeem: (save: boolean, session?: any) => Promise<boolean>;
}

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

const schema = new Schema({
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
);

/**
 * Schema Methods
 */

/**
 * Redeems a token if it has uses remaining and hasn't expired.
 * @param save Should the token be saved during redemption?
 *             If you're using a session you probably want to handle this manually.
 * @param session The session to be used for the redemption transaction.
 */
schema.methods.redeem = async function(save: boolean = true, session?: any): Promise<boolean> {
  try {
    const ts = Date.now();
    if (this.uses <= 0) throw new Error(`Token ${this.token} has no uses remaining`);
    if (ts > this.tsExpiration) throw new Error(`Token ${this.token} has expired.`);
    if (this.tsRedeemed === undefined) this.tsRedeemed = [];
    this.tsRedeemed.push(ts);
    this.uses -= 1;
    if (save) await this.save({ session });
    return true;
  } catch (err) {
    if (session) session.abortTransaction();
    return err;
  }
};

/*
 * Module Exports
 */

// export default mongoose.model<IToken>('Token', schema);
export const Token = mongoose.model<IToken>('Token', schema);
