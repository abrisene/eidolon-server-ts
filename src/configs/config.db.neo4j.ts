/*
 * config.db.neo4j.ts
 * Neo4j Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import { v1 as neo4j } from 'neo4j-driver';

import { exists, jsonTryParse } from '../utilities';
import Configs from './index';

dotenv.config();

/*
 * Constants
 */

export const key = 'neo4j';
export const category = 'database';

/*
 * Loader
 */

export default async function configure() {
  const envConfig = jsonTryParse(process.env.NEO4J);
  if (!envConfig) return undefined;
  if (!envConfig.url) return undefined;

  const { url, username = 'neo4j', password = 'neo4j' } = envConfig;

  try {
    const client = neo4j.driver(url, neo4j.auth.basic(username, password));
    console.log(chalk.green.bold('>> Neo4j Connected <<'));
    const config = { url, username, password, client };
    Configs.addConfig(key, config, category);
    return config;
  } catch (err) {
    console.error(err);
  }
}
