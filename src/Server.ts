/*
 * server.js
 * Server Index
 */

/**
 * Module Dependencies
 */

import { Server } from 'http';
import EventEmitter from 'events';
import express from 'express';
import socketIO from 'socket.io';
import Configs from './configs';

import routes from './routes';
import sockets from './sockets';

/*
 * Utility Methods
 */

/**
 * Asynchronous wrapper from Express' app.listen()
 * @param app  An express app to listen on.
 * @param port The port that the express app should listen on.
 */
async function asyncListen(app: express.Application, port: number): Promise<Server> {
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
  protected _app: express.Application;
  protected _server: Server;
  protected _io: socketIO.Server;
  protected _status: string;
  constructor() {
    super();
    this._app = express();
    this._server = undefined;
    this._io = undefined;
    this._status = 'inactive';
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

  /**
   * Registers a new set of routes with the server.
   * @param routeFn An async function containing route handlers.
   */
  public async registerRoute(routeFn: (app: express.Application, server: EidolonServer) => void) {
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

    // Start the Server
    this._server = await asyncListen(this._app, port);

    // Configure Sockets
    this._io = socketIO(this._server);

    // Configure Routes & Sockets
    await this.registerRoute(routes);
    await this.registerSocket(sockets);

    console.log(`> Server Listening on ${port}`);
    this._status = 'serving';
    this.emit('serving');
  }
}
