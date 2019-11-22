/*
 * config.db.mongodb.ts
 * Redis Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import Redis from 'ioredis';

import { exists, jsonTryParse } from '../utilities';
import Configs from './index';

dotenv.config();

/*
 * Constants
 */

export const key = 'redis';
export const category = 'database';

/*
 * Utility Methods
 */

function connectRedis(url: string): Promise<Redis.Redis> {
  return new Promise((resolve, reject) => {
    try {
      const client = new Redis(url);
      client.on('connect', () => {
        Configs.emit('redis connected');
        console.log(chalk.green.bold('>> Redis Connected <<'));
        resolve(client);
      });
    } catch (err) {
      reject(err);
    }
  });
}

/*
 * Loader
 */

export default async function configure() {
  const url = process.env.REDIS_URL || process.env.REDISCLOUD_URL;
  if (!url) return undefined;

  try {
    const client = await connectRedis(url);
    client.on('error', (err) => {
      Configs.emit('redis error', (err));
      console.error(chalk.red.bold('Could not connect to Redis'));
      console.error(err);
    });

    const config = { url, client };
    Configs.addConfig(key, config, category);
    return config;
  } catch (err) {
    console.error(err);
  }
}
