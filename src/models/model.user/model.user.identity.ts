/*
 * model.user.identity.ts
 * Mongoose User Identity Model
 */

/**
 * Module Dependencies
 */

import mongoose, { Document, Model, Schema } from 'mongoose';
import { IToken } from '../model.authentication/model.token';

/*
 * Interface
 */

export interface IUserIdentity extends Document {
  owner: Document;
  emailPrimary: string;
  emails: string[];
  type: string;
  key: string;
  source: string;
  tsValidated?: Date;
  tsAccessed?: Date[];
  tsCreated: Date;
  tsUpdated: Date;
  generateToken: (type: string, duration: number) => Promise<IToken|Error>;
}

export interface IUserIdentityModel extends Model<IUserIdentity> {
  validateWithToken: (hash: string) => Promise<boolean>;
}
/*
 * Constants
 */

export const constants = {
  token: {
    validateIdentity: 'VALIDATE_IDENTITY',
  },
};

/*
 * Schema
 */

const schema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  emailPrimary: { type: String, trim: true },
  emails: [{ type: String, trim: true }],
  type: { type: String, required: true, trim: true },
  key: { type: String, required: true, trim: true },
  source: { type: String, required: true, trim: true },
  tsValidated: Date,
  tsAccessed: [Date],
},
{
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
schema.methods.generateToken = function(type: string, duration: number = 86400): Promise<IToken|Error> {
  const Token = this.db.model('Token');
  const token = new Token({
    owner: this._id,
    type,
    tsExpiration: Date.now() + (duration * 1000),
  });
  return token;
};

/*
 * Static Schema Methods
 */

/**
 * Validates an identity with a token hash.
 * Saves both the Identity and Token documents.
 * @param hash A hash matching the validation token's hash.
 */
schema.statics.validateWithToken = async function(hash: string): Promise<boolean> {
  const Identity = this;
  const Token = this.db.model('Token');
  const { validateIdentity } = constants.token;
  let session;
  try {
    const token: IToken = await Token.findOne({ token: hash });
    if (!token) throw new Error(`Could not find token ${hash}.`);
    if (token.type !== validateIdentity) throw new Error(`Token ${token} (${token.type}) cannot be used to validate identity.`);

    const identity = await Identity.findOne({ _id: token.owner });
    if (!identity) throw new Error(`Could not find identity for token ${token}.`);

    // Start the session and the transaction.
    session = await this.db.startSession();
    session.startTransaction();

    const redeemed = await token.redeem(false);
    identity.tsValidated = token.tsRedeemed[token.tsRedeemed.length - 1];

    // Save and commit the transaction.
    await identity.save({ session });
    await token.save({ session });
    session.commitTransaction();

    return redeemed;
  } catch (err) {
    if (session) session.abortTransaction();
    return err;
  }
};

/*
 * Module Exports
 */

// export default mongoose.model<IUserIdentity>('User Identity', schema);
export const UserIdentity = mongoose.model<IUserIdentity, IUserIdentityModel>('User Identity', schema);
