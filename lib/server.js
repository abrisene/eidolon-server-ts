"use strict";
/*
 * server.js
 * Server Index
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
const events_1 = __importDefault(require("events"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
/*
 * Module Exports
 */
class EidolonServer extends events_1.default {
    constructor() {
        super();
        this.app = express_1.default();
        this._status = 'inactive';
    }
    get status() {
        return this._status;
    }
    /* public async init() {
    } */
    serve(port) {
        return __awaiter(this, void 0, void 0, function* () {
            yield routes_1.default(this);
            this.app.listen(port, () => {
                console.log(`> Server Listening on ${port}`);
                this._status = 'serving';
                this.emit('serving');
            });
        });
    }
}
exports.default = EidolonServer;
//# sourceMappingURL=Server.js.map