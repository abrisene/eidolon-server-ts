/*
 * server.js
 * Server Index
 */

/**
 * Module Dependencies
 */

import { Server } from 'http';
import EventEmitter from 'events';
// import express from 'express';
import Koa from 'koa';
import socketIO from 'socket.io';
import chalk from 'chalk';
import Configs from './configs';

import routes from './routes';
import sockets from './sockets';

import { importGraphQLConfig, importSchema, IGraphQLConfig } from './graphql';

/*
 * Utility Methods
 */

/**
 * Asynchronous wrapper from Express' app.listen()
 * @param app  An express app to listen on.
 * @param port The port that the express app should listen on.
 */
async function asyncListen(app: Koa, port: number): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    });
  });
}

/*
 * Module Exports
 */

export default class EidolonServer extends EventEmitter {
  protected _app: Koa;
  protected _server?: Server;
  protected _io?: socketIO.Server;
  protected _status: string;
  protected _gqlSchema?: IGraphQLConfig;
  constructor() {
    super();
    this._app = new Koa();
    this._server = undefined;
    this._io = undefined;
    this._status = 'inactive';
    this._gqlSchema = undefined;
  }

  get app() {
    return this._app;
  }

  get server() {
    return this._server;
  }

  get io() {
    return this._io;
  }

  get status() {
    return this._status;
  }

  get gqlSchema() {
    return this._gqlSchema;
  }

  /**
   * Loads GraphQL Schemas and Resolvers from a directory. Will initialize the schema if none currently exists.
   * All filenames in the directory prepended with "schema." or "scalar." will be loaded.
   * @param location The directory to load schemas from.
   */
  public async registerGraphQLSchema(location?: string) {
    // Import the default schema if we haven't yet.
    if (this._gqlSchema === undefined) this._gqlSchema = await importGraphQLConfig();
    // Import the schema from the indicated location.
    if (location !== undefined) this._gqlSchema = await importSchema(location, this._gqlSchema);
    return this._gqlSchema;
  }

  /**
   * Registers a new set of routes with the server.
   * @param routeFn An async function containing route handlers.
   */
  public async registerRoute(routeFn: (app: Koa, server: EidolonServer) => void) {
    await routeFn(this._app, this);
    return;
  }

  /**
   * Registers a new set of socket handlers with the server.
   * @param socketFn An async function which handles socket event handlers.
   */
  public async registerSocket(socketFn: (io: socketIO.Server, server: EidolonServer) => void) {
    await socketFn(this._io, this);
    return;
  }

  /**
   * Begins serving from the provided port.
   * @param port Port to serve from.
   */
  public async serve(port: number) {
    // Initialize the GraphQL Schema if it has not been already
    await this.registerGraphQLSchema();

    // Start the Server
    this._server = await asyncListen(this._app, port);

    // Configure Sockets
    this._io = socketIO(this._server);

    // Configure Routes & Sockets
    await this.registerRoute(routes);
    await this.registerSocket(sockets);

    const { host } = Configs.getConfig('uris');

    // console.log(chalk`\n{cyan.bold > Server Listening on ${port.toString()}}\n`);
    console.log(chalk`\n{cyan.bold > Server Listening on} {white.bold ${host}}\n`);

    this._status = 'serving';
    this.emit('serving');
  }
}
