/*
 * methods.user.auth.ts
 * Mongoose User Authentication Methods
 */

/**
 * Module Dependencies
 */

import Configs from '../../configs';
import { sendPasswordResetEmail, sendValidationEmail } from './mail.user';
import { ISchemaFragment } from '../../utilities/utilities.mongoose';
import { IUser } from './model.user.schema';
import { constants as identityConstants, IUserIdentity } from './model.user.identity';
import { IToken } from '../model.authentication/model.token';
import { ISocialProfile } from '../../passport/auth.social';

/*
 * Constants
 */

export interface ILoginResponse {
  user?: IUser;
  jwt?: string;
  err?: Error;
  info?: any;
}

/*
 * Constants
 */
export const constants = {
  token: {
    resetPassword: 'RESET_PASSWORD',
  },
};

const schema: ISchemaFragment = {
  methods: {},
  statics: {},
  query: {},
};

/*
 * Utility Methods
 */

/**
 * Utility method to generate a signed JWT for the user.
 * @param id The user's id to use as the subject.
 * @param expiration The duration till the token will expire. Usually defaults to '1d'
 */
function generateJWT(id: string, expiration?: string): string {
  const jwtConfig = Configs.getConfig('jwt');
  const generate = jwtConfig.generateJWT;
  return generate({}, id, expiration);
}

/**
 * Generates a hashed password from a plain text string.
 * @param password Password to be hashed.
 */
async function generatePasswordHash(password: string): Promise<string> {
  const passwordConfig = Configs.getConfig('password');
  const generate = passwordConfig.generatePasswordHash;
  return generate(password);
}

/**
 * Authenticates a plain text password against a hash.
 * @param password Plain text password to be authenticated.
 * @param hash Hashed password to authenticate the password against.
 */
async function authenticatePasswordHash(password: string, hash: string): Promise<boolean> {
  const passwordConfig = Configs.getConfig('password');
  const authenticate = passwordConfig.authenticatePassword;
  return authenticate(password, hash);
}

/*
 * Schema Methods
 */

/**
 * Generates a signed JWT for the user with a duration defined by the expiration.
 * @param expiration The duration till the token will expire. Usually defaults to '1d'
 */
schema.methods.generateJWT = function(expiration?: string): string {
  return generateJWT(this._id.toString(), expiration);
};

/**
 * Authenticates a password against the hashed version stored on the user document.
 * @param password Password to validate against the user's hashed password.
 */
schema.methods.authenticatePassword = async function(password: string): Promise<boolean> {
  const hash = this.hash[this.hash.length - 1];
  return authenticatePasswordHash(password, hash);
};

/**
 * Logs in the user and returns a JWT.
 * IMPORTANT: This should only ever be called AFTER authentication.
 * @param identity The identity to login with.
 */
schema.methods.login = async function(identity: IUserIdentity): Promise<ILoginResponse> {
  let session;
  try {
    // Start the session and the transaction.
    session = await this.db.startSession();
    session.startTransaction();
    const ts = new Date();
    this.tsLogin.push(ts);
    identity.tsAccessed.push(ts);
    await this.save({ session });
    await identity.save({ session });
    session.commitTransaction();

    // Generate the JWT for Login.
    const jwt = this.generateJWT();

    // Return the user and the JWT.
    return { user: this, jwt };
  } catch (err) {
    if (session) session.abortTransaction();
    return err;
  }
};

/**
 * Logs in a user with a provided password and identity. Returns a JWT.
 * @param password Plain text password to log the user in with.
 * @param identity Identity used for the password login.
 */
schema.methods.loginPassword = async function(password: string, identity: IUserIdentity): Promise<ILoginResponse> {
  try {
    if (!this.hash) throw new Error(`Could not log in ${identity.emailPrimary} (${identity.source}): Password Login Unsupported by User`);
    const authenticated = await this.authenticatePassword(password);
    if (!authenticated) throw new Error(`Could not log in ${identity.emailPrimary} (${identity.source}): Incorrect Password`);
    return this.login(identity);
  } catch (err) {
    return { err };
  }
};

/**
 * Logs in a user with a social profile and identity. Returns a JWT.
 * TODO: Check for Profile updates and adjust identity.
 * @param profile Social profile.
 * @param identity Identity used for the social login.
 */
schema.methods.loginSocial = async function(profile: ISocialProfile, identity: IUserIdentity): Promise<ILoginResponse> {
  try {
    console.log('Authenticated (Social)');

    // Check for Profile / Identity Updates here <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    return this.login(identity);
  } catch (err) {
    return { err };
  }
};

/*
 * Schema Static Methods
 */

/**
 * Uses a limited use token to change a user's password. (UNTESTED)
 * TODO: TEST THIS METHOD
 * @param tokenHash The hash of the token to be redeemed.
 * @param password The new password to be set on the user.
 */
schema.statics.setPasswordWithToken = async function(tokenHash: string, password: string): Promise<IUser> {
  const User = this;
  const Token = this.db.model('Token');
  let session;
  try {
    // Start the session
    session = await this.db.startSession();

    // Find the token and the identity.
    let token = await Token.findOne({ token: tokenHash }).populate('owner');
    if (!token) throw new Error(`Could not find token ${tokenHash}.`);
    if (token.type !== constants.token.resetPassword) throw new Error(`Token ${token} (${token.type}) cannot be used to reset password.`);
    if (!token.owner) throw new Error(`Could not find identity for token ${token}.`);

    // Find the user.
    let user = await User.findOne({ _id: token.owner.owner });
    if (!user) throw new Error(`Could not find User for token ${token}.`);

    // Start the transaction, redeem the token and set the password.
    session.startTransaction();
    user.hash = await generatePasswordHash(password);
    token = await token.redeem(session);
    user = await user.save({ session });
    session.commitTransaction();

    return user;
  } catch (err) {
    if (session) session.abortTransaction();
    return err;
  }
};

// STATIC AUTHENTICATION METHODS

/**
 * Sends a password reset email to the indicated email address.
 * TODO: Write this method.
 * @param email The email address to send the password reset request to.
 */
/*
schema.statics.requestPasswordReset = async function(email: string): IToken {
  const Identity = this.db.model('Identity');
};*/

/**
 * Authenticates a login or a registration with an email and password. Returns a JWT if successful.
 * @param email The email address to be used for authentication.
 * @param password The password in plain text to be used for authentication.
 * @param register If true, will attempt to register the user.
 */
schema.statics.authenticateEmail = async function(email: string, password: string, register: boolean = false): Promise<ILoginResponse> {
  const User = this;
  const Identity = this.db.model('User Identity');
  try {
    // Check to see if we have a user with the primary email.
    const identity = await Identity.findOne({ type: 'email', source: 'user', key: email }).populate('owner');
    if (identity) { // If we do, log in using the password.
      return identity.owner.loginPassword(password, identity);
    } else if (register) { // If not, try to register a new user if registration is enabled.
      return User.registerEmail(email, password);
    } else {
      throw new Error(`Identity not found for Email: ${email}`);
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};

/**
 * Registers a new user using an email address. (MAJOR TODO)
 * @param email The email address to be used for registration.
 * @param password The password in plain text to be used for registration.
 */
schema.statics.registerEmail = async function(email: string, password: string): Promise<ILoginResponse> {
  const User = this;
  const Identity = this.db.model('User Identity');
  let session;
  try {
    // Check to see if the email is already in use within any existing identities.
    const duplicates = await Identity.find({ emails: email });
    if (duplicates.length > 0) throw new Error(`Could not Create User with Email - ${email} is already in use.`);

    // Start the session
    session = await this.db.startSession();
    session.startTransaction();

    // Generate the hash, the user and the identity.
    const hash = await generatePasswordHash(password);

    let user = new User({
      emailPrimary: email,
      emails: [email],
      identities: [],
      hash: [hash],
    });

    let identity = new Identity({
      emailPrimary: email,
      emails: [email],
      owner: user,
      type: 'email',
      key: email,
      source: 'user',
    });

    // Link the identity to the user.
    user.identityPrimary = identity;
    user.identities.push(identity);

    // Create the token for email authentication.
    let token = identity.generateToken(identityConstants.token.validateIdentity, 86400 * 7);

    // Save the documents and commit the transactions.
    user = await user.save({ session });
    identity = await identity.save({ session });
    token = await token.save({ session });

    // Send out the identity verification email.
    const msg = await sendValidationEmail(email, token.token);

    await session.commitTransaction();

    // Login with the password and generate the JWT.
    return user.loginPassword(password, identity);
  } catch (err) {
    console.log(err);
    if (session) session.abortTransaction();
    return err;
  }
};

/**
 * Authenticates a login or a registration with a social profile. Returns a JWT if successful.
 * @param type    The type of social profile.
 * @param profile The profile object used for the authentication.
 * @param register If true, will attempt to register the user.
 */
schema.statics.authenticateSocial = async function(type: string, profile: ISocialProfile, register: boolean = true): Promise<ILoginResponse> {
  const User = this;
  const Identity = this.db.model('User Identity');
  try {
    // Check to see if we have an identity the matches the profile.
    const identity = await Identity.findOne({ type, key: profile.id }).populate('owner');

    if (identity) { // If we do, log in using the profile.
      return identity.owner.loginSocial(profile, identity);
    } else if (register) { // If not, try to register a new user if registration is enabled.
      return User.registerSocial(type, profile);
    } else {
      throw new Error(`Identity not found for social ID: ${profile.id}`);
    }
  } catch (err) {
    return err;
  }
};

/**
 * Registers a new user using a social profile.
 * @param type    The type of social profile.
 * @param profile The profile object used for the authentication.
 */
schema.statics.registerSocial = async function(type: string, profile: ISocialProfile): Promise<ILoginResponse> {
  const User = this;
  const Identity = this.db.model('User Identity');
  let session;
  let user;
  let emailIdentity;
  let isPrimary;
  try {
    const tsNow = Date.now();

    // See if we have an valid existing user to link our new identity to.
    const duplicates = await Identity.find({ emails: profile.email }).populate('owner');

    if (duplicates.length > 0) {
      duplicates.some((i: IUserIdentity) => {
        const linkable = i.tsValidated;
        if (linkable) user = i.owner;
        return linkable;
      });
    }

    // Start the session
    session = await this.db.startSession();
    session.startTransaction();

    // If we don't have an existing user, this will be our primary identity.
    if (!user) {
      isPrimary = true;

      // Create the user.
      user = new User({
        emailPrimary: profile.email,
        emails: [profile.email],
        identities: [],
      });

      // Create the email identity, since we're creating a new user.
      emailIdentity = new Identity({
        emailPrimary: profile.email,
        emails: [profile.email],
        owner: user,
        type: 'email',
        key: profile.id,
        source: type,
        tsValidated: tsNow,
      });

      // Link the email identity to the user.
      user.identities.push(emailIdentity);
    }

    // Create the social identity - we will always need to do this.
    let socialIdentity = new Identity({
      emailPrimary: profile.email,
      emails: [profile.email],
      owner: user,
      type,
      key: profile.id,
      source: type,
      tsValidated: tsNow,
    });

    // Link the social identity to the user.
    if (isPrimary) user.identityPrimary = socialIdentity;
    user.identities.push(socialIdentity);

    // Save the documents and commit the transactions.
    user = await user.save({ session });
    socialIdentity = await socialIdentity.save({ session });
    if (emailIdentity) emailIdentity = await emailIdentity.save({ session });
    await session.commitTransaction();

    // Login with the social identity and generate the JWT.
    return user.loginSocial(profile, socialIdentity);
  } catch (err) {
    console.log(err);
    if (session) session.abortTransaction();
    return err;
  }
};

/*
 * Module Exports
 */

export default schema;
