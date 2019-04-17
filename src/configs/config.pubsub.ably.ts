/*
 * config.pubsub.ably.ts
 * Ably Configuration
 */

/**
 * Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import Ably from 'ably';

import utilities from '../utilities';
import Configs from './index';

dotenv.config();
const { jsonTryParse, exists } = utilities;

/*
 * Constants
 */

const key = 'ably';
const category = 'pubsub';

/*
 * Utility Methods
 */

function connectAbly(serverKey: string): Promise<Ably.Realtime> {
  return new Promise((resolve, reject) => {
    try {
      const client = new Ably.Realtime(serverKey);

      client.connection.on('failed', (err) => {
        Configs.emit('ably error', (err));
        console.error(chalk.red.bold('Could not connect to Ably'));
        console.error(err);
      });

      client.connection.on('connected', () => {
        Configs.emit('ably connected');
        console.log(chalk.green.bold('>> Ably Connected <<'));
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
  const envConfig = jsonTryParse(process.env.ABLY);
  if (!envConfig) return undefined;
  if (!exists([envConfig.secretKey, envConfig.publicKey], true)) return undefined;
  const { secretKey, publicKey } = envConfig;

  try {
    const client = await connectAbly(secretKey);
    const config = { secretKey, publicKey, client };
    Configs.addConfig(key, config);
    Configs.setPublicKey(key, publicKey);
    return config;
  } catch (err) {
    console.error(err);
  }
}
