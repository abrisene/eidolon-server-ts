"use strict";
/*
 * index.js
 * Module Index
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
const Server_1 = __importDefault(require("./Server"));
// const config = require('./configs');
// const server = require('./server');
// const constants = require('./constants');
// const models = require('./models');
// const modules = require('./modules');
/**
 * Main
 */
/* const init = async (useServer = true) => {
  try {
    await config.init();
    if (useServer) await server();

    return {
      config,
      constants,
      models,
      modules,
    };
  } catch (err) {
    console.error(err);
    return { err };
  }
}; */
function init(useServer = true) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('xxx');
        const server = useServer ? new Server_1.default() : undefined;
        if (server)
            yield server.serve(9000);
        return {
            server,
        };
    });
}
/**
 * Module Exports
 */
module.exports = {
    init,
};
//# sourceMappingURL=index.js.map