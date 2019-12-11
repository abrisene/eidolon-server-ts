/// <reference types="koa-views" />
/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
/// <reference types="node" />
/**
 * Module Dependencies
 */
import { Server } from 'http';
import EventEmitter from 'events';
import Koa from 'koa';
import Router from 'koa-router';
import socketIO from 'socket.io';
import { IGraphQLConfig } from './graphql';
export default class EidolonServer extends EventEmitter {
    protected _app: Koa;
    protected _router: Router;
    protected _server?: Server;
    protected _io?: socketIO.Server;
    protected _status: string;
    protected _gqlSchema?: IGraphQLConfig;
    constructor();
    get app(): Koa<Koa.DefaultState, Koa.DefaultContext>;
    get router(): Router<any, {}>;
    get server(): Server;
    get io(): socketIO.Server;
    get status(): string;
    get gqlSchema(): IGraphQLConfig;
    /**
     * Loads GraphQL Schemas and Resolvers from a directory. Will initialize the schema if none currently exists.
     * All filenames in the directory prepended with "schema." or "scalar." will be loaded.
     * @param location The directory to load schemas from.
     */
    registerGraphQLSchema(location?: string): Promise<IGraphQLConfig>;
    /**
     * Registers a new set of routes with the server.
     * @param routeFn An async function containing route handlers.
     */
    registerRoute(routeFn: (app: Koa, router: Router, server: EidolonServer) => void): Promise<void>;
    /**
     * Registers a new set of socket handlers with the server.
     * @param socketFn An async function which handles socket event handlers.
     */
    registerSocket(socketFn: (io: socketIO.Server, server: EidolonServer) => void): Promise<void>;
    /**
     * Begins serving from the provided port.
     * @param port Port to serve from.
     */
    serve(port: number): Promise<void>;
}
//# sourceMappingURL=Server.d.ts.map