/*
 * config.auth.jwt.ts
 * JSON Web Token Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import Configs from './index';

dotenv.config();

/*
 * Interfaces
 */

interface IJwtOptions {
  issuer?: string;
  audience?: string;
  expiration?: string;
  subject?: string;
}

interface IJwtGeneratorOptions extends IJwtOptions {
  secretKey: string;
}

/*
 * Constants
 */

export const key = 'jwt';
export const category = 'auth';

/*
 * Utility Methods
 */

/**
 * Generates a curried method for signing JWTs with injected options.
 * @param options JWT Configuration Options
 */
function initJWTGenerator(options: IJwtGeneratorOptions): (options: IJwtOptions) => string {
  const generator = (payload: string | object | Buffer, subject?: string, expiration?: string) => {
    const { secretKey, ...rest } = options;
    const config = {
      subject,
      expiresIn: expiration || rest.expiration,
      issuer: rest.issuer,
      audience: rest.audience,
    };
    return jwt.sign(payload, secretKey, config);
  };
  return generator;
}

/*
 * Loader
 */

export default async function configure() {
  try {
    const options = {
      secretKey: process.env.JWT_SECRET || 'secret',
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
      expiration: process.env.JWT_EXPIRATION || '1d',
    };
    const generateJWT = initJWTGenerator(options);
    const config = {...options, generateJWT };

    Configs.emit('jwt auth initialized');
    console.log(chalk.green.bold('>> JWT Auth Initialized <<'));
    Configs.addConfig(key, config, category);
    return config;
  } catch (err) {
    console.error(err);
  }
}
