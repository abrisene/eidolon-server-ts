import { DocumentNode } from 'graphql';
import { IResolvers } from 'graphql-tools';
export interface IGraphQLConfig {
    schema: DocumentNode[];
    resolvers: IResolvers;
}
/**
 * Loads GraphQL Schemas and Resolvers from a directory.
 * All filenames in the directory prepended with "schema." or "scalar." will be loaded.
 * @param location The directory to load schemas from.
 * @param init     The schema to initialize the import with. This defaults to the default schema.
 */
export declare function importSchema(location?: string, init?: IGraphQLConfig): Promise<IGraphQLConfig>;
/**
 * Imports the default GraphQL Config from the files defined in graphql/schema
 */
export declare function importGraphQLConfig(): Promise<IGraphQLConfig>;
//# sourceMappingURL=index.d.ts.map