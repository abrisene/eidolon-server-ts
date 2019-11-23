/*
 * config.db.neo4j.ts
 * Neo4j Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import Sequelize from 'sequelize';

import { exists, jsonTryParse } from '../utilities';
import Configs from './index';

dotenv.config();

/*
 * Constants
 */

const key = 'sql';
const category = 'database';

/*
 * Loader
 */

/* export default async function configure() {
  const url = process.env.SQL_URL;
  if (!url) return undefined;

  try {
    const client = new Sequelize(url);
    console.log(chalk.green.bold('>> SQL Connected <<'));
    const config = { url, client };
    Configs.addConfig(key, config);
    return config;
  } catch (err) {
    console.error(err);
  }
} */
