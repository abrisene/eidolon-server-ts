/*
 * schema.user.ts
 * User Model GraphQL Schema
 */

/*
 * Module Dependencies
 */

import { gql } from 'apollo-server-express';
import { IResolvers, IResolverObject } from 'graphql-tools';
import passport from 'passport';
import { ILoginResponse, IUser } from '../../models';

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
function authSocial(provider: string, req: Express.Request, res: Express.Response): Promise<any> {
  return new Promise((resolve, reject) => {
    passport.authenticate([provider], { session: false }, (err, user, info) => {
      if (err) reject(err);
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
function validateRole(user: IUser, role: string, result: any) {
  return user && user.roles.includes(role) ? result : undefined;
}

/*
 * Module Exports
 */

/*
 * Schema
 */

export const schema = gql`
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

const query: IResolverObject = {
  currentUser: async (p, a, { user }) => user || undefined,
  user: async (p, { id }, { models, user }) => validateRole(user, 'admin', models.User.findById(id)),
  users: async (p, a, { models, user }) => validateRole(user, 'admin', models.User.find()),
};

const userResolvers: IResolverObject = {
  id: parent => parent.id || parent._id,
  identityPrimary: async (parent, a, { models }) => models.UserIdentity.findById(parent.identityPrimary),
  identities: async (parent, a, { models }) => models.UserIdentity.find({ owner: parent._id }),
  // purchases: async (parent, a, { models }) => models.Order.find({ userId: parent._id }),
  tsLogin: parent => parent.tsLogin.map((ts: Date) => ts.getTime()),
  tsCreated: parent => parent.tsCreated.getTime(),
  tsUpdated: parent => parent.tsUpdated.getTime(),
};

const identityResolvers: IResolverObject = {
  // owner: async (parent, a, { models }) => models.User.findById(parent.owner),
  tsValidated: parent => parent.tsValidated ? parent.tsValidated.getTime() : undefined,
  tsAccessed: parent => parent.tsAccessed.map((ts: Date) => ts.getTime()),
  tsCreated: parent => parent.tsCreated.getTime(),
  tsUpdated: parent => parent.tsUpdated.getTime(),
};

const mutation: IResolverObject = {
  authenticateEmail: async (_, { input }, { Configs, models, req, res }) => {
    const { email, password, register } = input;
    try {
      const { useHttps } = Configs.getConfig('server');
      const auth = await models.User.authenticateEmail(
        email,
        password,
        register,
      );
      if (auth.err) throw new Error(auth.err);
      const token = await auth.user.generateJWT();
      req.user = auth.user;
      res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
      return req.user;
    } catch (err) {
      res.status(401);
      return err;
    }
  },
  authenticateSocial: async (_, { input }, { Configs, req, res }) => {
    const { provider, accessToken, refreshToken } = input;
    try {
      const { useHttps } = Configs.getConfig('server');
      req.body = {
        ...req.body,
        access_token: accessToken,
        refresh_token: refreshToken,
      };
      const auth = await authSocial(provider, req, res);
      if (auth.err) throw new Error(auth.err);
      const token = auth.user.generateJWT();
      req.user = auth.user;
      res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
      return req.user;
    } catch (err) {
      res.status(401);
      console.error(err);
      return err;
    }
  },
  validateEmailWithToken: async (_, { input }, { models }) => {
    const { token } = input;
    try {
      const redeem = await models.UserIdentity.validateWithToken(token);
      return true;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  requestPasswordReset: async (_, { input }, { models }) => {
    // TODO
    const { email } = input;
    try {
      // const reset = await models.User.requestPasswordReset(email);
      return true;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  setPasswordWithToken: async (_, { input }, { models }) => {
    const { token, password } = input;
    try {
      const redeem = await models.User.setPasswordWithToken(token, password);
      return true;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  logout: async (_, a, { Configs, res }) => {
    const { useHttps } = Configs.getConfig('server');
    res.cookie('jwt', '', { httpOnly: true, secure: useHttps });
    return true;
  },
};

export const resolvers = {
  Query: query,
  Mutation: mutation,
  User: userResolvers,
  UserIdentity: identityResolvers,
} as IResolvers;
