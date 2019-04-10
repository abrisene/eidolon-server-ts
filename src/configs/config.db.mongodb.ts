/*
 * config.db.redis.ts
 * Redis Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import utilities from '../utilities';
import Configs from './index';

dotenv.config();
const { jsonTryParse, exists } = utilities;

/*
 * Constants
 */

const key = 'mongodb';
const category = 'database';

/*
 * Loader
 */

export default async function configure() {
  const url = process.env.MONGODB_URL;
  if (!url) return undefined;

  const client = mongoose.connection;

  client.on('error', (err) => {
    Configs.emit('mongodb error', (err));
    console.error(chalk.red.bold('Could not connect to MongoDB'));
    console.error(err);
  });

  client.on('open', () => {
    Configs.emit('mongodb connected');
    console.log(chalk.green.bold('>> MongoDB Connected <<'));
  });

  try {
    await mongoose.connect(url, { useNewUrlParser: true });
    const config = { url, client };
    Configs.addConfig(key, config);
    return config;
  } catch (err) {
    console.error(err);
  }
}
