/*
 * model.user.schema.ts
 * Mongoose User Model Schema
 */

/**
 * Module Dependencies
 */

import mongoose, { Document, Model, Query, Schema } from 'mongoose';
import { stitchMongooseSchema } from '../../utilities';
import authenticationMethods, { ILoginResponse, ISocialProfile, IValidationResponse } from './methods.user.authentication';

import { IUserIdentity } from './model.user.identity';

/*
 * Interface
 */

export interface IUser extends Document {
  emailPrimary: string;
  emails: string[];
  identityPrimary: IUserIdentity['_id'];
  identities: Array<IUserIdentity['_id']>;
  roles: string[];
  hash: string[];
  tsLogin: Date[];
  tsCreated: Date;
  tsUpdated: Date;
  generateJWT: (expiration?: string) => Promise<string>;
  authenticatePassword: (password: string) => Promise<boolean>;
  login: (identity: IUserIdentity) => Promise<ILoginResponse>;
  loginPassword: (password: string, identity: IUserIdentity) => Promise<ILoginResponse>;
  loginSocial: (profile: ISocialProfile, identity: IUserIdentity) => Promise<ILoginResponse>;
}

export interface IUserModel extends Model<IUser> {
  requestPasswordReset: (email: string) => Promise<IValidationResponse>;
  setPasswordWithToken: (tokenHash: string, password: string) => Promise<IValidationResponse>;
  authenticateEmail: (email: string, password: string, register?: boolean) => Promise<ILoginResponse>;
  registerEmail: (email: string, password: string) => Promise<ILoginResponse>;
  authenticateSocial: (type: string, profile: ISocialProfile, register?: boolean) => Promise<ILoginResponse>;
  registerSocial: (type: string, profile: ISocialProfile) => Promise<ILoginResponse>;
}

export { ILoginResponse } from './methods.user.authentication';

/*
 * Schema
 */

const schema = new Schema({
  emailPrimary: { type: String, trim: true },
  emails: [{ type: String, trim: true }],
  identityPrimary: [{ type: Schema.Types.ObjectId, ref: 'UserIdentity' }],
  identities: [{ type: Schema.Types.ObjectId, ref: 'UserIdentity' }],
  roles: [String],
  hash: [String],
  tsLogin: [Date],
},
{
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
schema.statics.findById = async function(id: string): Promise<IUser> {
  return this.findOne({ _id: id })
    .populate('identityPrimary')
    .populate('identities');
};

/* schema.statics.findByEmail = async function(email: string): Promise<IUser> {

}; */

/*
 * Schema Stitching
 */

stitchMongooseSchema(schema, authenticationMethods);

/*
 * Module Exports
 */

export const User = mongoose.model<IUser, IUserModel>('User', schema);
