/*
 * model.user.schema.ts
 * Mongoose User Model Schema
 */

/**
 * Module Dependencies
 */

import mongoose, { Document, Query, Schema } from 'mongoose';
import utilities from '../../utilities';
import identityMethods from './methods.user.identity';
import authenticationMethods from './methods.user.authentication';

const { stitchMongooseSchema } = utilities;

/*
 * Interface
 */

export interface IUser extends Document {
  emailPrimary: string;
  emails: string[];
  identityPrimary: Document;
  identities: Document[];
  roles: string[];
  hash: string[];
  tsLogin: Date[];
  tsCreated: Date;
  tsUpdated: Date;
}

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

stitchMongooseSchema(schema, identityMethods);
stitchMongooseSchema(schema, authenticationMethods);

/*
 * Module Exports
 */

export default mongoose.model<IUser>('User', schema);
