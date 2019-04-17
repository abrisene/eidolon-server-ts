/*
 * config.spreadsheet.airtable.ts
 * Airtable Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import Airtable from 'airtable';

import utilities from '../utilities';
import Configs from './index';

dotenv.config();
const { jsonTryParse, exists } = utilities;

/*
 * Constants
 */

export const key = 'airtable';
export const category = 'spreadsheet';

/*
 * Utility Methods
 */

/*
 * Loader
 */

export default async function configure() {
  const envConfig = jsonTryParse(process.env.AIRTABLE);
  if (!envConfig) return undefined;
  if (!exists([envConfig.secretKey], true)) return undefined;
  const { secretKey } = envConfig;

  try {
    const client = new Airtable({ apiKey: secretKey });
    const config = { secretKey, client };
    Configs.emit('airtable initialized');
    console.log(chalk.green.bold('>> Airtable Initialized <<'));
    Configs.addConfig(key, config, category);
    return config;
  } catch (err) {
    console.error(err);
  }
}
