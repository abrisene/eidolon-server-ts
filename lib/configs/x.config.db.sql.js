"use strict";
/*
 * config.db.neo4j.ts
 * Neo4j Configuration
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const { jsonTryParse, exists } = utilities;
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
//# sourceMappingURL=x.config.db.sql.js.map