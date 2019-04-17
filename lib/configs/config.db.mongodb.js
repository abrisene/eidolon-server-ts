"use strict";
/*
 * config.db.mongodb.ts
 * MongoDB Configuration
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
const mongoose_1 = __importDefault(require("mongoose"));
const utilities_1 = __importDefault(require("../utilities"));
const index_1 = __importDefault(require("./index"));
dotenv_1.default.config();
const { jsonTryParse, exists } = utilities_1.default;
/*
 * Constants
 */
exports.key = 'mongodb';
exports.category = 'database';
/*
 * Loader
 */
function configure() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = process.env.MONGODB_URL;
        if (!url)
            return undefined;
        const client = mongoose_1.default.connection;
        client.on('error', (err) => {
            index_1.default.emit('mongodb error', (err));
            console.error(chalk_1.default.red.bold('Could not connect to MongoDB'));
            console.error(err);
        });
        client.on('open', () => {
            index_1.default.emit('mongodb connected');
            console.log(chalk_1.default.green.bold('>> MongoDB Connected <<'));
        });
        try {
            yield mongoose_1.default.connect(url, { useNewUrlParser: true });
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
//# sourceMappingURL=config.db.mongodb.js.map