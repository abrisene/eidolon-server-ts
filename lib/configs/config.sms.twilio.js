"use strict";
/*
 * config.sms.twilio.ts
 * Twilio Configuration
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
const twilio_1 = __importDefault(require("twilio"));
const utilities_1 = __importDefault(require("../utilities"));
const index_1 = __importDefault(require("./index"));
dotenv_1.default.config();
const { jsonTryParse, exists } = utilities_1.default;
/*
 * Constants
 */
exports.key = 'twilio';
exports.category = 'sms';
/*
 * Loader
 */
function configure() {
    return __awaiter(this, void 0, void 0, function* () {
        const envConfig = jsonTryParse(process.env.TWILIO);
        if (!envConfig)
            return undefined;
        if (!exists([envConfig.account, envConfig.secretKey], true))
            return undefined;
        const { account, secretKey } = envConfig;
        try {
            const client = twilio_1.default(account, secretKey);
            console.log(chalk_1.default.green.bold('>> Twilio Initialized <<'));
            index_1.default.emit('twilio initialized');
            const config = { account, secretKey, client };
            index_1.default.addConfig(exports.key, config, exports.category);
            return config;
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.default = configure;
//# sourceMappingURL=config.sms.twilio.js.map