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
function init(useServer = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = useServer ? new Server_1.default() : undefined;
        yield configs_1.default.init();
        if (server)
            yield server.serve(9000);
        // console.log(Configs);
        return {
            server,
            models,
        };
    });
}
/**
 * Module Exports
 */
module.exports = {
    init,
    models,
};
//# sourceMappingURL=index.js.map