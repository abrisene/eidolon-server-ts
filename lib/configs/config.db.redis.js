"use strict";
/*
 * config.db.mongodb.ts
 * Redis Configuration
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Dependencies
 */
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = __importDefault(require("dotenv"));
const ioredis_1 = __importDefault(require("ioredis"));
const utilities_1 = __importDefault(require("../utilities"));
const index_1 = __importDefault(require("./index"));
dotenv_1.default.config();
const { jsonTryParse, exists } = utilities_1.default;
/*
 * Constants
 */
exports.key = 'redis';
exports.category = 'database';
/*
 * Utility Methods
 */
function connectRedis(url) {
    return new Promise((resolve, reject) => {
        try {
            const client = new ioredis_1.default(url);
            client.on('connect', () => {
                index_1.default.emit('redis connected');
                console.log(chalk_1.default.green.bold('>> Redis Connected <<'));
                resolve(client);
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
/*
 * Loader
 */
function configure() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = process.env.REDIS_URL || process.env.REDISCLOUD_URL;
        if (!url)
            return undefined;
        try {
            const client = yield connectRedis(url);
            client.on('error', (err) => {
                index_1.default.emit('redis error', (err));
                console.error(chalk_1.default.red.bold('Could not connect to Redis'));
                console.error(err);
            });
            const config = { url, client };
            index_1.default.addConfig(exports.key, config, exports.category);
            return config;
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.default = configure;
//# sourceMappingURL=config.db.redis.js.map