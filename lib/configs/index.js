"use strict";
/*
 * configs/index.ts
 * Configuration Index
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Config = void 0;
/**
 * Module Dependencies
 */
const dotenv_1 = __importDefault(require("dotenv"));
const events_1 = require("events");
const fs_1 = __importDefault(require("fs"));
const utilities_1 = require("../utilities");
const utilities_config_1 = require("./utilities.config");
dotenv_1.default.config();
/*
 * Constants
 */
/*
 * Module Exports
 */
class Config extends events_1.EventEmitter {
    constructor() {
        super();
        this._status = 'uninitialized';
        this._manifest = { core: ['environment', 'server', 'uris'], keys: ['publicKeys', 'privateKeys'] };
        this._configs = {
            environment: {
                appName: process.env.APP_NAME || '',
                env: process.env.NODE_ENV || 'production',
            },
            server: {
                hostname: process.env.HOSTNAME,
                corsUrls: utilities_1.jsonTryParse(process.env.CORS_URLS),
                port: process.env.PORT || 8000,
                useHttps: process.env.HTTPS === 'true',
            },
            uris: {
                host: utilities_config_1.getServerUrl(),
                client: process.env.CLIENT_URL,
                logo: process.env.LOGO_URL || `${utilities_config_1.getServerUrl()}/static/images/app_logo.png`,
            },
        };
        this._publicKeys = {};
        this._privateKeys = {};
    }
    get status() {
        return this._status;
    }
    get manifest() {
        return this._manifest;
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
            yield utilities_1.asyncForEach(configs, (loc) => __awaiter(this, void 0, void 0, function* () {
                const init = yield Promise.resolve().then(() => __importStar(require(`./${loc}`)));
                yield init.default();
            }));
            this._status = 'initialized';
            this.emit('initialized');
            console.log('\nManifest:');
            console.log(this._manifest);
            return true;
        });
    }
    /**
     * Returns a public key.
     * @param key The key to return.
     */
    getPublicKey(key) {
        return this._publicKeys[key];
    }
    /**
     * Sets a public key.
     * @param key   The key to set.
     * @param value The value to set the key to.
     */
    setPublicKey(key, value) {
        this._publicKeys[key] = value;
    }
    /**
     * Returns a private key.
     * @param key The key to return.
     */
    getPrivateKey(key) {
        return this._privateKeys[key];
    }
    /**
     * Sets a private key.
     * @param key   The key to set.
     * @param value The value to set the key to.
     */
    setPrivateKey(key, value) {
        this._privateKeys[key] = value;
    }
    /**
     * Returns a config.
     * @param key The key of the config to return.
     */
    getConfig(key) {
        return this._configs[key] || undefined;
    }
    /**
     * Sets the value of a key within the configs and adds it to the manifest.
     * If one does not already exist, a new one will be created.
     * @param key      The key of the config to be set.
     * @param value    The dictionary that the config should be set to.
     * @param category The category that the config should be listed under in the manifest.
     */
    addConfig(key, value, category) {
        // Add to configs
        if (this._configs[key] !== undefined) {
            this._configs[key] = Object.assign(Object.assign({}, this._configs[key]), value);
        }
        else {
            this._configs[key] = Object.assign({}, value);
        }
        // Add to manifest
        if (category !== undefined) {
            if (this._manifest[category] === undefined)
                this._manifest[category] = [];
            this._manifest[category].push(key);
        }
    }
}
exports.Config = Config;
exports.default = new Config();
//# sourceMappingURL=index.js.map