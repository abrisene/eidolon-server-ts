"use strict";
/*
 * index.js
 * Module Index
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
 * Module Dependencies
 */
const configs_1 = __importDefault(require("./configs"));
const Server_1 = __importDefault(require("./Server"));
const models = __importStar(require("./models"));
const services = __importStar(require("./services"));
const utils = __importStar(require("./utilities"));
const routes_1 = require("./routes");
/**
 * Module Exports
 */
// export * from './configs';
// export * from './server';
// export * from './models';
// export * from './services';
// export * from './utilities';
// export { middleware } from './routes';
/**
 * Bootstrapping Method
 */
function init(useServer = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = useServer ? new Server_1.default() : undefined;
        yield configs_1.default.init();
        const serverConfig = configs_1.default.getConfig('server');
        const port = serverConfig.port || 8000;
        if (server)
            yield server.serve(port);
        return {
            Configs: configs_1.default,
            server,
            models,
            services,
            utils,
            middleware: routes_1.middleware,
        };
    });
}
exports.init = init;
const mod = {
    Configs: configs_1.default,
    init,
    models,
    services,
    utils,
    middleware: routes_1.middleware,
};
exports.default = mod;
//# sourceMappingURL=index.js.map