/*
 * config.auth.jwt.ts
 * JSON Web Token Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt-nodejs';

import Configs from './index';

dotenv.config();

/*
 * Interfaces
 */

/* interface IJwtOptions {
  issuer?: string;
  audience?: string;
  expiration?: string;
  subject?: string;
}

interface IJwtGeneratorOptions extends IJwtOptions {
  secretKey: string;
} */

interface IPasswordGeneratorOptions {
  trim?: number;
  minLength?: number;
}

interface IPasswordGeneratorMethods {
  generatePasswordHash: (password: string) => Promise<string>;
  authenticatePassword: (passwrod: string, hash: string) => Promise<boolean>;
}
/*
 * Constants
 */

export const key = 'password';
export const category = 'auth';

/*
 * Utility Methods
 */

/**
 * Validates a password using a given set of validation options. Only used locally.
 * @param password Password to validate.
 * @param config Configuration containing validation options.
 */
async function validatePassword(password: string, config: IPasswordGeneratorOptions): Promise<boolean> {
  try {
    if (password.length < config.minLength) throw new Error(`Password must be at least ${config.minLength} characters long.`);
    return true;
  } catch (err) {
    return err;
  }
}

/**
 * Generate a password hash using a given set of formatting and validation rules. Only used locally.
 * @param password String to generate a hash from.
 * @param config Configuration containing formatting options.
 */
async function generatePasswordHash(password: string, config: IPasswordGeneratorOptions): Promise<string> {
  try {
    const pw = config.trim ? password.trim() : password;
    await validatePassword(pw, config);
    return bcrypt.hashSync(pw);
  } catch (err) {
    return err;
  }
}

/**
 * Authenticates a password against a hash.
 * @param password String to compare against the hash.
 * @param hash Hash to compare the string to.
 * @param config Configuration containing formatting options.
 */
async function authenticatePassword(password: string, hash: string, config: IPasswordGeneratorOptions): Promise<boolean> {
  const pw = config.trim ? password.trim() : password;
  return bcrypt.compareSync(pw, hash);
}

/**
 * Generates curried password generation methods with pre-injected configuration variables.
 * @param config Configuration containing formatting and validation options.
 */
function initPasswordGenerator(config: IPasswordGeneratorOptions): IPasswordGeneratorMethods {
  const methods: IPasswordGeneratorMethods = {
    generatePasswordHash: async (password: string) => generatePasswordHash(password, config),
    authenticatePassword: async (password: string, hash: string) => authenticatePassword(password, hash, config),
  };
  return methods;
}

/*
 * Loader
 */

export default async function configure() {
  try {
    const options = {
      trim: process.env.PW_TRIM !== undefined ? parseInt(process.env.PW_TRIM, 10) : 1,
      minLength: process.env.PW_MIN_LENGTH ? parseInt(process.env.PW_MIN_LENGTH, 10) : 4,
    };
    const methods = initPasswordGenerator(options);
    const config = {...options, ...methods };

    Configs.emit('password auth initialized');
    console.log(chalk.green.bold('>> Password Auth Initialized <<'));
    Configs.addConfig(key, config, category);
    return config;
  } catch (err) {
    console.error(err);
  }
}
