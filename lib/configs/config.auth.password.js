"use strict";
/*
 * config.auth.jwt.ts
 * JSON Web Token Configuration
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
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const utilities_1 = __importDefault(require("../utilities"));
const index_1 = __importDefault(require("./index"));
dotenv_1.default.config();
const { jsonTryParse, exists } = utilities_1.default;
/*
 * Constants
 */
exports.key = 'password';
exports.category = 'auth';
/*
 * Utility Methods
 */
/**
 * Validates a password using a given set of validation options. Only used locally.
 * @param password Password to validate.
 * @param config Configuration containing validation options.
 */
function validatePassword(password, config) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (password.length < config.minLength)
                throw new Error(`Password must be at least ${config.minLength} characters long.`);
            return true;
        }
        catch (err) {
            return err;
        }
    });
}
/**
 * Generate a password hash using a given set of formatting and validation rules. Only used locally.
 * @param password String to generate a hash from.
 * @param config Configuration containing formatting options.
 */
function generatePasswordHash(password, config) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pw = config.trim ? password.trim() : password;
            yield validatePassword(pw, config);
            return bcrypt_nodejs_1.default.hashSync(pw);
        }
        catch (err) {
            return err;
        }
    });
}
/**
 * Authenticates a password against a hash.
 * @param password String to compare against the hash.
 * @param hash Hash to compare the string to.
 * @param config Configuration containing formatting options.
 */
function authenticatePassword(password, hash, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const pw = config.trim ? password.trim() : password;
        return bcrypt_nodejs_1.default.compareSync(pw, hash);
    });
}
/**
 * Generates curried password generation methods with pre-injected configuration variables.
 * @param config Configuration containing formatting and validation options.
 */
function initPasswordGenerator(config) {
    const methods = {
        generatePasswordHash: (password) => __awaiter(this, void 0, void 0, function* () { return generatePasswordHash(password, config); }),
        authenticatePassword: (password, hash) => __awaiter(this, void 0, void 0, function* () { return authenticatePassword(password, hash, config); }),
    };
    return methods;
}
/*
 * Loader
 */
function configure() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const options = {
                trim: process.env.PW_TRIM !== undefined ? parseInt(process.env.PW_TRIM, 10) : 1,
                minLength: process.env.PW_MIN_LENGTH ? parseInt(process.env.PW_MIN_LENGTH, 10) : 4,
            };
            const methods = initPasswordGenerator(options);
            const config = Object.assign({}, options, methods);
            index_1.default.emit('password auth initialized');
            console.log(chalk_1.default.green.bold('>> Password Auth Initialized <<'));
            index_1.default.addConfig(exports.key, config, exports.category);
            return config;
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.default = configure;
//# sourceMappingURL=config.auth.password.js.map