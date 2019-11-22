"use strict";
/*
 * server.js
 * Server Index
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
const events_1 = __importDefault(require("events"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const chalk_1 = __importDefault(require("chalk"));
const configs_1 = __importDefault(require("./configs"));
const routes_1 = __importDefault(require("./routes"));
const sockets_1 = __importDefault(require("./sockets"));
const graphql_1 = require("./graphql");
/*
 * Utility Methods
 */
/**
 * Asynchronous wrapper from Express' app.listen()
 * @param app  An express app to listen on.
 * @param port The port that the express app should listen on.
 */
function asyncListen(app, port) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const server = app.listen(port, () => {
                resolve(server);
            });
        });
    });
}
/*
 * Module Exports
 */
class EidolonServer extends events_1.default {
    constructor() {
        super();
        this._app = express_1.default();
        this._server = undefined;
        this._io = undefined;
        this._status = 'inactive';
        this._gqlSchema = undefined;
    }
    get app() {
        return this._app;
    }
    get server() {
        return this._server;
    }
    get io() {
        return this._io;
    }
    get status() {
        return this._status;
    }
    get gqlSchema() {
        return this._gqlSchema;
    }
    /**
     * Loads GraphQL Schemas and Resolvers from a directory. Will initialize the schema if none currently exists.
     * All filenames in the directory prepended with "schema." or "scalar." will be loaded.
     * @param location The directory to load schemas from.
     */
    registerGraphQLSchema(location) {
        return __awaiter(this, void 0, void 0, function* () {
            // Import the default schema if we haven't yet.
            if (this._gqlSchema === undefined)
                this._gqlSchema = yield graphql_1.importGraphQLConfig();
            // Import the schema from the indicated location.
            if (location !== undefined)
                this._gqlSchema = yield graphql_1.importSchema(location, this._gqlSchema);
            return this._gqlSchema;
        });
    }
    /**
     * Registers a new set of routes with the server.
     * @param routeFn An async function containing route handlers.
     */
    registerRoute(routeFn) {
        return __awaiter(this, void 0, void 0, function* () {
            yield routeFn(this._app, this);
            return;
        });
    }
    /**
     * Registers a new set of socket handlers with the server.
     * @param socketFn An async function which handles socket event handlers.
     */
    registerSocket(socketFn) {
        return __awaiter(this, void 0, void 0, function* () {
            yield socketFn(this._io, this);
            return;
        });
    }
    /**
     * Begins serving from the provided port.
     * @param port Port to serve from.
     */
    serve(port) {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize the GraphQL Schema if it has not been already
            yield this.registerGraphQLSchema();
            // Start the Server
            this._server = yield asyncListen(this._app, port);
            // Configure Sockets
            this._io = socket_io_1.default(this._server);
            // Configure Routes & Sockets
            yield this.registerRoute(routes_1.default);
            yield this.registerSocket(sockets_1.default);
            const { host } = configs_1.default.getConfig('uris');
            // console.log(chalk`\n{cyan.bold > Server Listening on ${port.toString()}}\n`);
            console.log(chalk_1.default `\n{cyan.bold > Server Listening on} {white.bold ${host}}\n`);
            this._status = 'serving';
            this.emit('serving');
        });
    }
}
exports.default = EidolonServer;
//# sourceMappingURL=Server.js.map