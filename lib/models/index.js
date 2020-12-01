"use strict";
/*
 * models/index.ts
 * Models Index
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Module Dependencies
 */
// export * from './model.user/model.user.schema';
// export * from './model.user/model.user.identity';
// export * from './model.authentication/model.token';
/*
 * Module Exports
 */
__exportStar(require("./model.user/model.user.schema"), exports);
__exportStar(require("./model.user/model.user.identity"), exports);
__exportStar(require("./model.authentication/model.token"), exports);
/* export default {
  User,
  Identity,
  Token,
}; */
//# sourceMappingURL=index.js.map