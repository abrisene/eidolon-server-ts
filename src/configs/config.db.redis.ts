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

import utilities from '../utilities';
import Configs from './index';

dotenv.config();
const { jsonTryParse, exists } = utilities;

/*
 * Constants
 */

const key = 'redis';
const category = 'database';

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
    Configs.addConfig(key, config);
    return config;
  } catch (err) {
    console.error(err);
  }
}
