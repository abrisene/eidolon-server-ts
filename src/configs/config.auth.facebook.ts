/*
 * config.auth.facebook.ts
 * Facebook Configuration
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

export const key = 'facebook';
export const category = 'auth';

/*
 * Utility Methods
 */

/*
 * Loader
 */

export default async function configure() {
  const envConfig = jsonTryParse(process.env.FACEBOOK_AUTH);
  if (!envConfig) return undefined;
  if (!exists([envConfig.clientID, envConfig.clientSecret], true)) return undefined;
  const { clientID, clientSecret, profileFields } = envConfig;
  const callbackRoute = envConfig.callbackRoute || '/auth/facebook/redirect';
  const callbackURL = envConfig.callbackURL || getServerUrl() + `${callbackRoute}`;
  try {
    const config = {
      clientID,
      clientSecret,
      profileFields: profileFields || ['email'],
      // profileFields: profileFields || ['id', 'email', 'first_name', 'last_name'],
      callbackRoute,
      callbackURL,
    };
    Configs.emit('facebook auth initialized');
    console.log(chalk.green.bold('>> Facebook Auth Initialized <<'));
    Configs.addConfig(key, config, category);
    Configs.setPublicKey('facebook', clientID);
    return config;
  } catch (err) {
    console.error(err);
  }
}
