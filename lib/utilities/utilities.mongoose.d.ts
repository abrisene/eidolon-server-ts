/**
 * Module Imports
 */
import { Schema } from 'mongoose';
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
export declare function stitchMongooseSchema(schema: Schema, plugin: ISchemaFragment): Schema;
export {};
//# sourceMappingURL=utilities.mongoose.d.ts.map