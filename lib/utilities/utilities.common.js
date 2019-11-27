"use strict";
/*
 * utilities.common.ts
 * Common Utility Methods
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Imports
 */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Module Exports
 */
/**
 * Iterates forEach on an array asynchronously.
 * @param    array  An array to be iterated over.
 * @param callback  The operation to be performed on each item of the array.
 */
function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < array.length; index++) {
            yield callback(array[index], index, array);
        }
    });
}
exports.asyncForEach = asyncForEach;
/**
 * Checks whether a string or array of items have any non-undefined or empty values.
 * @param items An array of items.
 * @param all   Whether or not all items need to be present.
 * @return      Returns true or false
 */
function exists(items, all = false) {
    let result;
    if (Array.isArray(items)) {
        if (!all)
            result = items.some((i) => i !== undefined && i !== '');
        if (all)
            result = items.reduce((a, b) => a && b !== undefined && b !== '');
    }
    else {
        result = items !== undefined && items !== '';
    }
    return result;
}
exports.exists = exists;
/**
 * Iterates through files in a directoy and imports the ones that match a RegExp
 * @param pattern  A string or RegExp to match files to be imported.
 * @param location The location of the directory to be iterated through.
 * @param callback An optional async callback to be performed on each module.
 */
function importPattern(pattern, callback, location = __dirname) {
    return __awaiter(this, void 0, void 0, function* () {
        const modules = {};
        const files = fs_1.default.readdirSync(location).filter(i => i.match(pattern));
        yield asyncForEach(files, (filename) => __awaiter(this, void 0, void 0, function* () {
            const module = yield Promise.resolve().then(() => __importStar(require(path_1.default.join(location, filename))));
            modules[location] = module;
            if (callback)
                yield callback(module, filename);
        }));
        return modules;
    });
}
exports.importPattern = importPattern;
/**
 * Tries to parse JSON, returns undefined if input is invalid.
 * @param string  String to be parsed.
 * @return        Returns JSON or undefined.
 */
function jsonTryParse(string) {
    try {
        return string ? JSON.parse(string) : undefined;
    }
    catch (err) {
        return undefined;
    }
}
exports.jsonTryParse = jsonTryParse;
//# sourceMappingURL=utilities.common.js.map