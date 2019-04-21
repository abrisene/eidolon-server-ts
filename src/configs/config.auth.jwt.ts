/*
 * config.auth.jwt.ts
 * JSON Web Token Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';

import utilities from '../utilities';
import Configs from './index';

dotenv.config();
const { jsonTryParse, exists } = utilities;

/*
 * Constants
 */

export const key = 'jwt';
export const category = 'auth';

/*
 * Utility Methods
 */

/*
 * Loader
 */

export default async function configure() {
  try {
    const config = {
      secretKey: process.env.JWT_SECRET || 'secret',
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    };
    Configs.emit('jwt auth initialized');
    console.log(chalk.green.bold('>> JWT Auth Initialized <<'));
    Configs.addConfig(key, config, category);
    return config;
  } catch (err) {
    console.error(err);
  }
}
