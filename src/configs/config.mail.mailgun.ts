/*
 * config.mail.mailgun.ts
 * Mailgun Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import mailgun from 'mailgun.js';

import utilities from '../utilities';
import Configs from './index';

dotenv.config();
const { jsonTryParse, exists } = utilities;

/*
 * Constants
 */

const key = 'mailgun';
const category = 'mail';

/*
 * Utility Methods
 */

/*
 * Loader
 */

export default async function configure() {
  const envConfig = jsonTryParse(process.env.MAILGUN);
  if (!envConfig) return undefined;
  if (!exists([envConfig.secretKey, envConfig.publicKey, envConfig.domain], true)) return undefined;
  const { secretKey, publicKey, domain } = envConfig;

  try {
    const client = mailgun.client({ username: 'api', key: secretKey, domain });
    const config = { secretKey, publicKey, domain, client };
    Configs.emit('mailgun initialized');
    console.log(chalk.green.bold('>> Mailgun Initialized <<'));
    Configs.addConfig(key, config);
    return config;
  } catch (err) {
    console.error(err);
  }
}
