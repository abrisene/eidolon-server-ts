"use strict";
/*
 * utilities.common.ts
 * Common Utility Methods
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Exports
 */
/**
 * Iterates forEach on an array asynchronously.
 * @param  {array}    array     An array to be iterated over.
 * @param  {function} callback  The operation to be performed on each item of the array.
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
 * @param  {array}   items An array of items.
 * @param  {boolean} all   Whether or not all items need to be present.
 * @return {bool}          Returns true or false
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
 * Tries to parse JSON, returns undefined if input is invalid.
 * @param  {string} string  String to be parsed.
 * @return {object}         Returns JSON or undefined
 */
function jsonTryParse(string) {
    try {
        const json = JSON.parse(string);
        return json;
    }
    catch (err) {
        return undefined;
    }
}
exports.jsonTryParse = jsonTryParse;
//# sourceMappingURL=utilities.common.js.map