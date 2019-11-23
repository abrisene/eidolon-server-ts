/*
 * config.sms.twilio.ts
 * Twilio Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import twilio from 'twilio';

import { exists, jsonTryParse } from '../utilities';
import Configs from './index';

dotenv.config();

/*
 * Constants
 */

export const key = 'twilio';
export const category = 'sms';

/*
 * Loader
 */

export default async function configure() {
  const envConfig = jsonTryParse(process.env.TWILIO);
  if (!envConfig) return undefined;
  if (!exists([envConfig.account, envConfig.secretKey], true)) return undefined;
  const { account, secretKey } = envConfig;

  try {
    const client = twilio(account, secretKey);
    console.log(chalk.green.bold('>> Twilio Initialized <<'));
    Configs.emit('twilio initialized');
    const config = { account, secretKey, client };
    Configs.addConfig(key, config, category);
    return config;
  } catch (err) {
    console.error(err);
  }
}
