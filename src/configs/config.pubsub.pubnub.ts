/*
 * config.pubsub.pubnub.ts
 * Pubnub Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import PubNub from 'pubnub';

import utilities from '../utilities';
import Configs from './index';

dotenv.config();
const { jsonTryParse, exists } = utilities;

/*
 * Constants
 */

const key = 'pubnub';
const category = 'pubsub';

/*
 * Utility Methods
 */

/*
 * Loader
 */

export default async function configure() {
  const envConfig = jsonTryParse(process.env.PUBNUB);
  if (!envConfig) return undefined;
  if (!exists([envConfig.publishKey, envConfig.subscribeKey, envConfig.secretKey])) return undefined;
  const { publishKey, subscribeKey, secretKey } = envConfig;

  try {
    const client = new PubNub({ publishKey, subscribeKey, secretKey });
    const config = { publishKey, subscribeKey, secretKey, client };
    Configs.emit('pubnub connected');
    console.log(chalk.green.bold('>> PubNub Connected <<'));
    Configs.addConfig(key, config);
    return config;
  } catch (err) {
    console.error(err);
  }
}
