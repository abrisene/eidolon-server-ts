"use strict";
/*
 * utilities.common.ts
 * Common Utility Methods
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module Exports
 */
/**
 * Checks whether an array of items have any non-undefined or empty values.
 * @param  {array} items An array of items.
 * @return {bool}        Returns true or false
 */
function exists(items) {
    let result;
    if (Array.isArray(items)) {
        result = items.some((i) => i !== undefined && i !== '');
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