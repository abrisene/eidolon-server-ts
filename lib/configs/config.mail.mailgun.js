"use strict";
/*
 * config.mail.mailgun.ts
 * Mailgun Configuration
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
// import mailgun from 'mailgun-js';
const ts_mailgun_1 = require("ts-mailgun");
const utilities_1 = require("../utilities");
const index_1 = __importDefault(require("./index"));
dotenv_1.default.config();
/*
 * Constants
 */
exports.key = 'mailgun';
exports.category = 'mail';
/*
 * Utility Methods
 */
/*
 * Loader
 */
function configure() {
    return __awaiter(this, void 0, void 0, function* () {
        const envConfig = utilities_1.jsonTryParse(process.env.MAILGUN);
        if (!envConfig)
            return undefined;
        if (!utilities_1.exists([envConfig.secretKey, envConfig.publicKey, envConfig.domain], true))
            return undefined;
        const { secretKey, publicKey, domain } = envConfig;
        try {
            // const client = mailgun({ apiKey: secretKey, domain });
            const client = new ts_mailgun_1.NodeMailgun(secretKey, domain);
            client.fromEmail = `noreply@${domain}`;
            client.fromTitle = `noreply@${domain}`;
            client.init();
            const config = { secretKey, publicKey, domain, client };
            index_1.default.emit('mailgun initialized');
            console.log(chalk_1.default.green.bold('>> Mailgun Initialized <<'));
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
//# sourceMappingURL=config.mail.mailgun.js.map