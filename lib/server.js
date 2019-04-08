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
/*
 * Module Exports
 */
class Server extends events_1.default {
    constructor() {
        super();
        this.app = express_1.default();
    }
    /* public async init() {
    } */
    serve(port) {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.listen(port, () => {
                console.log(`> Server Listening on ${port}`);
                this.emit('Serving');
            });
        });
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map