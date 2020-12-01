"use strict";
/*
 * utilities.mongoose.ts
 * Mongoose Utility Methods
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stitchMongooseSchema = void 0;
/**
 * Module Exports
 */
function stitchMongooseSchema(schema, plugin) {
    if (plugin.methods !== undefined) {
        Object.keys(plugin.methods).forEach(key => schema.methods[key] = plugin.methods[key]);
    }
    if (plugin.statics !== undefined) {
        Object.keys(plugin.statics).forEach(key => schema.statics[key] = plugin.statics[key]);
    }
    if (plugin.query !== undefined) {
        Object.keys(plugin.query).forEach(key => schema.query[key] = plugin.query[key]);
    }
    return schema;
}
exports.stitchMongooseSchema = stitchMongooseSchema;
//# sourceMappingURL=utilities.mongoose.js.map