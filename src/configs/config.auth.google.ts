/*
 * config.auth.google.ts
 * Google Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';

import utilities from '../utilities';
import Configs from './index';

import { getServerUrl } from './utilities.config';

dotenv.config();
const { jsonTryParse, exists } = utilities;

/*
 * Constants
 */

export const key = 'google';
export const category = 'auth';

/*
 * Utility Methods
 */

/*
 * Loader
 */

export default async function configure() {
  const envConfig = jsonTryParse(process.env.GOOGLE_AUTH);
  if (!envConfig) return undefined;
  if (!exists([envConfig.clientID, envConfig.clientSecret], true)) return undefined;
  const { clientID, clientSecret, profileFields } = envConfig;
  const callbackRoute = envConfig.callbackRoute || '/auth/google/redirect';
  const callbackURL = envConfig.callbackURL || getServerUrl() + `${callbackRoute}`;
  try {
    const config = {
      clientID,
      clientSecret,
      profileFields: profileFields || ['openid', 'email'],
      callbackRoute,
      callbackURL,
    };
    Configs.emit('google auth initialized');
    console.log(chalk.green.bold('>> Google Auth Initialized <<'));
    Configs.addConfig(key, config, category);
    Configs.setPublicKey('google', clientID);
    return config;
  } catch (err) {
    console.error(err);
  }
}
