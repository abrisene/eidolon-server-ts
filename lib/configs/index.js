"use strict";
/*
 * configs/index.ts
 * Configuration Index
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Dependencies
 */
const dotenv_1 = __importDefault(require("dotenv"));
const events_1 = __importDefault(require("events"));
const fs_1 = __importDefault(require("fs"));
const utilities_1 = __importDefault(require("../utilities"));
dotenv_1.default.config();
const { asyncForEach, jsonTryParse } = utilities_1.default;
/*
 * Constants
 */
// This is not currently used for anything.
const configMap = {
    // jwt: './config.auth.jwt',
    mongodb: './config.db.mongodb',
    neo4j: './config.db.neo4j',
    redis: './config.db.redis',
    // sql: './config.db.sql',
    mailgun: './config.mail.mailgun',
    stripe: './config.payment.stripe',
    ably: './config.pubsub.ably',
    pubnub: './config.pubsub.pubnub',
    twilio: './config.sms.twilio',
    // google: './config.social.google',
    // facebook: './config.social.facebook',
    airtable: './config.spreadsheet.airtable',
};
/*
 * Module Exports
 */
class Config extends events_1.default {
    constructor() {
        super();
        this._status = 'uninitialized';
        this._publicKeys = {};
        this._privateKeys = {};
        this._configs = {
            environment: {
                appName: process.env.APP_NAME || '',
                env: process.env.NODE_ENV || 'production',
            },
            server: {
                corsUrls: jsonTryParse(process.env.CORS_URLS),
                port: process.env.PORT || 8000,
            },
        };
    }
    get status() {
        return this._status;
    }
    get publicKeys() {
        return this._publicKeys;
    }
    get privateKeys() {
        return this._privateKeys;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const configs = fs_1.default.readdirSync(__dirname).filter(i => i.match(/^config.*.js$/));
            yield asyncForEach(configs, (loc) => __awaiter(this, void 0, void 0, function* () {
                const init = yield Promise.resolve().then(() => __importStar(require(`./${loc}`)));
                yield init.default();
            }));
            this._status = 'initialized';
            this.emit('initialized');
            return true;
        });
    }
    getPublicKey(key) {
        return this._publicKeys[key];
    }
    setPublicKey(key, value) {
        this._publicKeys[key] = value;
    }
    getPrivateKey(key) {
        return this._privateKeys[key];
    }
    setPrivateKey(key, value) {
        this._privateKeys[key] = value;
    }
    getConfig(key) {
        return this._configs[key] || undefined;
    }
    addConfig(key, value) {
        if (this._configs[key] !== undefined) {
            this._configs[key] = Object.assign({}, this._configs[key], value);
        }
        else {
            this._configs[key] = Object.assign({}, value);
        }
    }
}
exports.default = new Config();
//# sourceMappingURL=index.js.map