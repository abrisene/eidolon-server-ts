"use strict";
/*
 * utilities/index.ts
 * Utilities Index
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Module Dependencies
 */
const common = __importStar(require("./utilities.common"));
const mongoose = __importStar(require("./utilities.mongoose"));
/*
 * Module Exports
 */
exports.default = Object.assign(Object.assign({}, common), mongoose);
//# sourceMappingURL=index.js.map