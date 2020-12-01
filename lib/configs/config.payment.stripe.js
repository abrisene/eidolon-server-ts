"use strict";
/*
 * config.payment.stripe.ts
 * Stripe Configuration
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
const stripe_1 = __importDefault(require("stripe"));
const utilities_1 = require("../utilities");
const index_1 = __importDefault(require("./index"));
dotenv_1.default.config();
/*
 * Constants
 */
exports.key = 'stripe';
exports.category = 'payment';
/*
 * Utility Methods
 */
/*
 * Loader
 */
function configure() {
    return __awaiter(this, void 0, void 0, function* () {
        const envConfig = utilities_1.jsonTryParse(process.env.STRIPE);
        if (!envConfig)
            return undefined;
        if (!utilities_1.exists([envConfig.secretKey, envConfig.publicKey], true))
            return undefined;
        const { secretKey, publicKey } = envConfig;
        try {
            const client = new stripe_1.default(secretKey);
            const config = { secretKey, publicKey, client };
            index_1.default.emit('stripe initialized');
            console.log(chalk_1.default.green.bold('>> Stripe Initialized <<'));
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
//# sourceMappingURL=config.payment.stripe.js.map