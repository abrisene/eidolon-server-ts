/*
 * utilities.mongoose.ts
 * Mongoose Utility Methods
 */

/**
 * Module Imports
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interfaces
 */

interface ISchemaMethods {
  [index: string]: any;
}

export interface ISchemaFragment {
  methods: ISchemaMethods;
  statics: ISchemaMethods;
  query: ISchemaMethods;
}

/**
 * Module Exports
 */

export function stitchMongooseSchema(schema: Schema, plugin: ISchemaFragment): Schema {
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
