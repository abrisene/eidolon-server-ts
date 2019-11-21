"use strict";
/*
 * schema.user.ts
 * User Model GraphQL Schema
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
/*
 * Module Dependencies
 */
const apollo_server_express_1 = require("apollo-server-express");
const passport_1 = __importDefault(require("passport"));
/*
 * Constants
 */
const USE_HTTPS = true;
/*
 * Methods
 */
// FOR SOCIAL AUTH:
// https://medium.freecodecamp.org/how-to-nail-social-authentication-in-graphql-27943aee5dce
/**
 * Uses passport to authenticate a User.
 * @param provider A string indicating which provider to use for the authentication.
 * @param req An express request.
 * @param res An express response.
 */
function authSocial(provider, req, res) {
    return new Promise((resolve, reject) => {
        passport_1.default.authenticate([provider], { session: false }, (err, user, info) => {
            if (err)
                reject(err);
            resolve({ user, info });
        })(req, res);
    });
}
/**
 * Middleware to validate whether or not the user has the required role.
 * @param user A User Document.
 * @param role The name of the role.
 * @param result The method to call if successful.
 */
function validateRole(user, role, result) {
    return user && user.roles.includes(role) ? result : undefined;
}
/*
 * Module Exports
 */
/*
 * Schema
 */
exports.schema = apollo_server_express_1.gql `
  extend type Query {
    currentUser: User
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID!
    emailPrimary: String!
    emails: [String]
    identityPrimary: UserIdentity
    identities: [UserIdentity]
    roles: [String]
    tsLogin: [Float]
    tsCreated: Float!
    tsUpdated: Float!
  }

  type UserIdentity {
    id: ID!
    # owner: User!
    emailPrimary: String!
    emails: [String]
    type: String!
    key: String!
    source: String!
    tsValidated: Float
    tsAccessed: [Float]
    tsCreated: Float!
    tsUpdated: Float!
  }

  extend type Mutation {
    authenticateEmail(input: AuthenticateEmailInput): User!
    authenticateSocial(input: AuthenticateSocialInput): User!
    validateEmailWithToken(input: TokenInput): Boolean!
    requestPasswordReset(input: EmailInput): Boolean!
    setPasswordWithToken(input: SetPasswordWithTokenInput): Boolean!
    logout: Boolean!
  }

  input AuthenticateEmailInput {
    email: String!
    password: String!
    register: Boolean
  }

  input AuthenticateSocialInput {
    provider: String!
    accessToken: String!
    refreshToken: String
  }

  input TokenInput {
    token: String!
  }

  input EmailInput {
    email: String!
  }

  input SetPasswordWithTokenInput {
    token: String!
    password: String!
  }

`;
/*
 # Resolvers
 */
const query = {
    currentUser: (p, a, { user }) => __awaiter(void 0, void 0, void 0, function* () { return user || undefined; }),
    user: (p, { id }, { models, user }) => __awaiter(void 0, void 0, void 0, function* () { return validateRole(user, 'admin', models.User.findById(id)); }),
    users: (p, a, { models, user }) => __awaiter(void 0, void 0, void 0, function* () { return validateRole(user, 'admin', models.User.find()); }),
};
const userResolvers = {
    id: parent => parent.id || parent._id,
    identityPrimary: (parent, a, { models }) => __awaiter(void 0, void 0, void 0, function* () { return models.UserIdentity.findById(parent.identityPrimary); }),
    identities: (parent, a, { models }) => __awaiter(void 0, void 0, void 0, function* () { return models.UserIdentity.find({ owner: parent._id }); }),
    // purchases: async (parent, a, { models }) => models.Order.find({ userId: parent._id }),
    tsLogin: parent => parent.tsLogin.map((ts) => ts.getTime()),
    tsCreated: parent => parent.tsCreated.getTime(),
    tsUpdated: parent => parent.tsUpdated.getTime(),
};
const identityResolvers = {
    // owner: async (parent, a, { models }) => models.User.findById(parent.owner),
    tsValidated: parent => parent.tsValidated ? parent.tsValidated.getTime() : undefined,
    tsAccessed: parent => parent.tsAccessed.map((ts) => ts.getTime()),
    tsCreated: parent => parent.tsCreated.getTime(),
    tsUpdated: parent => parent.tsUpdated.getTime(),
};
const mutation = {
    authenticateEmail: (_, { input }, { Configs, models, req, res }) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password, register } = input;
        try {
            const { useHttps } = Configs.getConfig('server');
            const auth = yield models.User.authenticateEmail(email, password, register);
            if (auth.err)
                throw new Error(auth.err);
            const token = yield auth.user.generateJWT();
            req.user = auth.user;
            res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
            return req.user;
        }
        catch (err) {
            res.status(401);
            return err;
        }
    }),
    authenticateSocial: (_, { input }, { Configs, req, res }) => __awaiter(void 0, void 0, void 0, function* () {
        const { provider, accessToken, refreshToken } = input;
        try {
            const { useHttps } = Configs.getConfig('server');
            req.body = Object.assign(Object.assign({}, req.body), { access_token: accessToken, refresh_token: refreshToken });
            const auth = yield authSocial(provider, req, res);
            if (auth.err)
                throw new Error(auth.err);
            const token = auth.user.generateJWT();
            req.user = auth.user;
            res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
            return req.user;
        }
        catch (err) {
            res.status(401);
            console.error(err);
            return err;
        }
    }),
    validateEmailWithToken: (_, { input }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = input;
        try {
            const redeem = yield models.UserIdentity.validateWithToken(token);
            return true;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }),
    requestPasswordReset: (_, { input }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        // TODO
        const { email } = input;
        try {
            // const reset = await models.User.requestPasswordReset(email);
            return true;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }),
    setPasswordWithToken: (_, { input }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        const { token, password } = input;
        try {
            const redeem = yield models.User.setPasswordWithToken(token, password);
            return true;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }),
    logout: (_, a, { Configs, res }) => __awaiter(void 0, void 0, void 0, function* () {
        const { useHttps } = Configs.getConfig('server');
        res.cookie('jwt', '', { httpOnly: true, secure: useHttps });
        return true;
    }),
};
exports.resolvers = {
    Query: query,
    Mutation: mutation,
    User: userResolvers,
    UserIdentity: identityResolvers,
};
//# sourceMappingURL=schema.user.js.map