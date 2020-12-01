"use strict";
/*
 * config.pubsub.ably.ts
 * Ably Configuration
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.category = exports.key = void 0;
/**
 * Module Dependencies
 */
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = __importDefault(require("dotenv"));
const ably_1 = __importDefault(require("ably"));
const utilities_1 = require("../utilities");
const index_1 = __importDefault(require("./index"));
dotenv_1.default.config();
/*
 * Constants
 */
exports.key = 'ably';
exports.category = 'pubsub';
/*
 * Utility Methods
 */
function connectAbly(serverKey) {
    return new Promise((resolve, reject) => {
        try {
            const client = new ably_1.default.Realtime(serverKey);
            client.connection.on('failed', (err) => {
                index_1.default.emit('ably error', (err));
                console.error(chalk_1.default.red.bold('Could not connect to Ably'));
                console.error(err);
            });
            client.connection.on('connected', () => {
                index_1.default.emit('ably connected');
                console.log(chalk_1.default.green.bold('>> Ably Connected <<'));
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
        const envConfig = utilities_1.jsonTryParse(process.env.ABLY);
        if (!envConfig)
            return undefined;
        if (!utilities_1.exists([envConfig.secretKey, envConfig.publicKey], true))
            return undefined;
        const { secretKey, publicKey } = envConfig;
        try {
            const client = yield connectAbly(secretKey);
            const config = { secretKey, publicKey, client };
            index_1.default.addConfig(exports.key, config, exports.category);
            index_1.default.setPublicKey(exports.key, publicKey);
            return config;
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.default = configure;
//# sourceMappingURL=config.pubsub.ably.js.map