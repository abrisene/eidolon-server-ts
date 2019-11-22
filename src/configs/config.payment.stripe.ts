/*
 * config.payment.stripe.ts
 * Stripe Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import Stripe from 'stripe';

import { exists, jsonTryParse } from '../utilities';
import Configs from './index';

dotenv.config();

/*
 * Constants
 */

export const key = 'stripe';
export const category = 'payment';

/*
 * Utility Methods
 */

/*
 * Loader
 */

export default async function configure() {
  const envConfig = jsonTryParse(process.env.STRIPE);
  if (!envConfig) return undefined;
  if (!exists([envConfig.secretKey, envConfig.publicKey], true)) return undefined;
  const { secretKey, publicKey } = envConfig;

  try {
    const client = new Stripe(secretKey);
    const config = { secretKey, publicKey, client };
    Configs.emit('stripe initialized');
    console.log(chalk.green.bold('>> Stripe Initialized <<'));
    Configs.addConfig(key, config, category);
    Configs.setPublicKey(key, publicKey);
    return config;
  } catch (err) {
    console.error(err);
  }
}
