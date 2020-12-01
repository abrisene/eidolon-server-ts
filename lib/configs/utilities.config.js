"use strict";
/*
 * utilities.config.ts
 * Config Specific Utility Methods
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerUrl = void 0;
/**
 * Module Imports
 */
/**
 * Interfaces
 */
/**
 * Module Exports
 */
/**
 * Determines the URL of the server from config.
 * There has to be a better way of doing this.
 */
function getServerUrl() {
    const { HOSTNAME, PORT, SERVER_URL, HTTPS } = process.env;
    if (SERVER_URL) {
        return SERVER_URL;
    }
    else {
        const prefix = HTTPS === 'true' ? 'https://' : 'http://';
        const host = HOSTNAME;
        const suffix = host === 'localhost' ? `:${PORT}` : '';
        return prefix + host + suffix;
    }
}
exports.getServerUrl = getServerUrl;
//# sourceMappingURL=utilities.config.js.map