"use strict";
/*
 * sockets/index.ts
 * Sockets Index
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
/*
 * Module Dependencies
 */
const chalk_1 = __importDefault(require("chalk"));
/*
 * Module Exports
 */
function default_1(io, server) {
    return __awaiter(this, void 0, void 0, function* () {
        // Basic Connection Event
        io.on('connection', (socket) => {
            console.log(chalk_1.default.cyan.bold('>> Client Connected <<'));
            socket.on('disconnect', () => {
                console.log(chalk_1.default.magenta.bold('>> Client Disconnected <<'));
            });
        });
        return;
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map