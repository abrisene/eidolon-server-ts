"use strict";
/*
 * methods.user.auth.ts
 * Mongoose User Authentication Methods
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Dependencies
 */
const configs_1 = __importDefault(require("../../configs"));
const mail_user_1 = require("./mail.user");
const utilities_1 = require("../../utilities");
const model_user_identity_1 = require("./model.user.identity");
/*
 * Constants
 */
exports.constants = {
    token: {
        resetPassword: 'RESET_PASSWORD',
    },
};
const schema = {
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
function generateJWT(id, expiration) {
    const jwtConfig = configs_1.default.getConfig('jwt');
    const generate = jwtConfig.generateJWT;
    return generate({}, id, expiration);
}
/**
 * Generates a hashed password from a plain text string.
 * @param password Password to be hashed.
 */
function generatePasswordHash(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const passwordConfig = configs_1.default.getConfig('password');
        const generate = passwordConfig.generatePasswordHash;
        return generate(password);
    });
}
/**
 * Authenticates a plain text password against a hash.
 * @param password Plain text password to be authenticated.
 * @param hash Hashed password to authenticate the password against.
 */
function authenticatePasswordHash(password, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const passwordConfig = configs_1.default.getConfig('password');
        const authenticate = passwordConfig.authenticatePassword;
        return authenticate(password, hash);
    });
}
/*
 * Schema Methods
 */
/**
 * Generates a signed JWT for the user with a duration defined by the expiration.
 * @param expiration The duration till the token will expire. Usually defaults to '1d'
 */
schema.methods.generateJWT = function (expiration) {
    return generateJWT(this._id.toString(), expiration);
};
/**
 * Authenticates a password against the hashed version stored on the user document.
 * @param password Password to validate against the user's hashed password.
 */
schema.methods.authenticatePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = this.hash[this.hash.length - 1];
        return authenticatePasswordHash(password, hash);
    });
};
/**
 * Logs in the user and returns a JWT.
 * IMPORTANT: This should only ever be called AFTER authentication.
 * @param identity The identity to login with.
 */
schema.methods.login = function (identity) {
    return __awaiter(this, void 0, void 0, function* () {
        let session;
        try {
            // Start the session and the transaction.
            session = yield this.db.startSession();
            session.startTransaction();
            // Update the login and access dates.
            const ts = new Date();
            this.tsLogin.push(ts);
            identity.tsAccessed.push(ts);
            // Save and commit the transaction.
            yield this.save({ session });
            yield identity.save({ session });
            session.commitTransaction();
            // Generate the JWT for Login.
            const jwt = this.generateJWT();
            // Return the user and the JWT.
            return { user: this, jwt };
        }
        catch (err) {
            if (session)
                session.abortTransaction();
            return err;
        }
    });
};
/**
 * Logs in a user with a provided password and identity. Returns a JWT.
 * @param password Plain text password to log the user in with.
 * @param identity Identity used for the password login.
 */
schema.methods.loginPassword = function (password, identity) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!this.hash)
                throw new Error(`Could not log in ${identity.emailPrimary} (${identity.source}): Password Login Unsupported by User`);
            const authenticated = yield this.authenticatePassword(password);
            if (!authenticated)
                throw new Error(`Could not log in ${identity.emailPrimary} (${identity.source}): Incorrect Password`);
            return this.login(identity);
        }
        catch (err) {
            return { err };
        }
    });
};
/**
 * Logs in a user with a social profile and identity. Returns a JWT.
 * TODO: Check for Profile updates and adjust identity.
 * @param profile Social profile.
 * @param identity Identity used for the social login.
 */
schema.methods.loginSocial = function (profile, identity) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check for Profile / Identity Updates here <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            return this.login(identity);
        }
        catch (err) {
            return { err };
        }
    });
};
/*
 * Schema Static Methods
 */
/**
 * Uses a limited use token to change a user's password. (UNTESTED)
 * TODO: TEST THIS METHOD - NEEDS BETTER ERROR/RESPONSE HANDLING
 * @param tokenHash The hash of the token to be redeemed.
 * @param password The new password to be set on the user.
 */
schema.statics.setPasswordWithToken = function (tokenHash, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const UserIdentity = this.db.model('User Identity');
        const Token = this.db.model('Token');
        let session;
        try {
            // Find the token and the identity.
            let token = yield Token.findOne({ token: tokenHash });
            if (!token)
                throw new Error(`Cannot reset password: Could not find token ${tokenHash}.`);
            if (token.type !== exports.constants.token.resetPassword)
                throw new Error(`Cannot reset password: Token ${token} (${token.type}) cannot be used to reset password.`);
            // Find the identity associated with the token.
            const identity = yield UserIdentity.findById(token.owner).populate('owner');
            if (!identity)
                throw new Error(`Cannot reset password: Could not find Identity for token ${token}.`);
            // Find the user.
            let user = identity.owner;
            if (!user)
                throw new Error(`Cannot reset password: Could not find User for token ${token}.`);
            // Start the session and the transaction.
            session = yield this.db.startSession();
            session.startTransaction();
            // Generate the hash and redeem the token.
            const hash = yield generatePasswordHash(password);
            user.hash.push(hash);
            const redeem = yield token.redeem(false);
            if (!redeem.success)
                throw new Error(`Cannot reset password: ${redeem.msg}`);
            // Save and commit the transaction.
            user = yield user.save({ session });
            token = yield token.save({ session });
            session.commitTransaction();
            return { success: true, msg: 'Password reset successful.' };
        }
        catch (err) {
            if (session)
                session.abortTransaction();
            return { success: false, err, msg: err.message };
        }
    });
};
// STATIC AUTHENTICATION METHODS
/**
 * Sends a password reset email to the indicated email address.
 * @param email The email address to send the password reset request to.
 */
schema.statics.requestPasswordReset = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const Identity = this.db.model('User Identity');
        const Token = this.db.model('Token');
        let session;
        try {
            // Find out if there's a valid identity attached to this email.
            const identity = yield Identity.findOne({ emails: email }).populate('owner');
            if (!identity)
                throw new Error(`Cannot request password reset: Identity not found for email: "${email}"`);
            // TODO: RATE LIMIT THIS ACTION.
            // Start the session
            session = yield this.db.startSession();
            session.startTransaction();
            // Generate the token.
            const token = yield identity.generateToken(exports.constants.token.resetPassword);
            if (!token)
                throw new Error('Cannot request password reset: Could not generate Token.');
            // Invalidate existing password reset tokens.
            const tokens = yield Token.find({ owner: identity._id, type: exports.constants.token.resetPassword });
            yield utilities_1.asyncForEach(tokens, (t) => __awaiter(this, void 0, void 0, function* () {
                t.uses = 0;
                yield t.save({ session });
            }));
            // Save the token.
            yield token.save({ session });
            // Generate the reset email.
            yield mail_user_1.sendPasswordResetEmail(identity.emailPrimary, token.token);
            // Commit the session.
            yield session.commitTransaction();
            return { success: true, msg: 'Password reset request successful.' };
        }
        catch (err) {
            if (session)
                session.abortTransaction();
            return { success: false, err, msg: err.message };
        }
    });
};
/**
 * Authenticates a login or a registration with an email and password. Returns a JWT if successful.
 * @param email The email address to be used for authentication.
 * @param password The password in plain text to be used for authentication.
 * @param register If true, will attempt to register the user.
 */
schema.statics.authenticateEmail = function (email, password, register = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const User = this;
        const Identity = this.db.model('User Identity');
        try {
            // Check to see if we have a user with the primary email.
            const identity = yield Identity.findOne({ type: 'email', source: 'user', key: email }).populate('owner');
            if (identity) { // If we do, log in using the password.
                return identity.owner.loginPassword(password, identity);
            }
            else if (register) { // If not, try to register a new user if registration is enabled.
                return User.registerEmail(email, password);
            }
            else {
                throw new Error(`Identity not found for Email: ${email}`);
            }
        }
        catch (err) {
            return err;
        }
    });
};
/**
 * Registers a new user using an email address.
 * @param email The email address to be used for registration.
 * @param password The password in plain text to be used for registration.
 */
schema.statics.registerEmail = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const User = this;
        const Identity = this.db.model('User Identity');
        let session;
        try {
            // Check to see if the email is already in use within any existing identities.
            const duplicates = yield Identity.find({ emails: email });
            if (duplicates.length > 0)
                throw new Error(`Could not Create User with Email - ${email} is already in use.`);
            // Start the session
            session = yield this.db.startSession();
            session.startTransaction();
            // Generate the hash, the user and the identity.
            const hash = yield generatePasswordHash(password);
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
            let token = identity.generateToken(model_user_identity_1.constants.token.validateIdentity, 86400 * 7);
            // Save the documents and commit the transactions.
            user = yield user.save({ session });
            identity = yield identity.save({ session });
            token = yield token.save({ session });
            // Send out the identity verification email.
            yield mail_user_1.sendValidationEmail(email, token.token);
            yield session.commitTransaction();
            // Login with the password and generate the JWT.
            return user.loginPassword(password, identity);
        }
        catch (err) {
            if (session)
                session.abortTransaction();
            return err;
        }
    });
};
/**
 * Authenticates a login or a registration with a social profile. Returns a JWT if successful.
 * @param type    The type of social profile.
 * @param profile The profile object used for the authentication.
 * @param register If true, will attempt to register the user.
 */
schema.statics.authenticateSocial = function (type, profile, register = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const User = this;
        const Identity = this.db.model('User Identity');
        try {
            // Check to see if we have an identity the matches the profile.
            const identity = yield Identity.findOne({ type, key: profile.id }).populate('owner');
            if (identity) { // If we do, log in using the profile.
                return identity.owner.loginSocial(profile, identity);
            }
            else if (register) { // If not, try to register a new user if registration is enabled.
                return User.registerSocial(type, profile);
            }
            else {
                throw new Error(`Identity not found for social ID: ${profile.id}`);
            }
        }
        catch (err) {
            return err;
        }
    });
};
/**
 * Registers a new user using a social profile.
 * @param type    The type of social profile.
 * @param profile The profile object used for the authentication.
 */
schema.statics.registerSocial = function (type, profile) {
    return __awaiter(this, void 0, void 0, function* () {
        const User = this;
        const Identity = this.db.model('User Identity');
        let session;
        let user;
        let emailIdentity;
        let isPrimary;
        try {
            const tsNow = Date.now();
            // See if we have an valid existing user to link our new identity to.
            const duplicates = yield Identity.find({ emails: profile.email }).populate('owner');
            if (duplicates.length > 0) {
                duplicates.some((i) => {
                    const linkable = i.tsValidated;
                    if (linkable)
                        user = i.owner;
                    return linkable;
                });
            }
            // Start the session
            session = yield this.db.startSession();
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
            if (isPrimary)
                user.identityPrimary = socialIdentity;
            user.identities.push(socialIdentity);
            // Save the documents and commit the transactions.
            user = yield user.save({ session });
            socialIdentity = yield socialIdentity.save({ session });
            if (emailIdentity)
                emailIdentity = yield emailIdentity.save({ session });
            yield session.commitTransaction();
            // Login with the social identity and generate the JWT.
            return user.loginSocial(profile, socialIdentity);
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
exports.default = schema;
//# sourceMappingURL=methods.user.authentication.js.map