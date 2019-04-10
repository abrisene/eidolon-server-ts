/*
 * server.js
 * Server Index
 */

/**
 * Module Dependencies
 */

import EventEmitter from 'events';
import express from 'express';
import Configs from './configs';

/*
 * Module Exports
 */

export default class Server extends EventEmitter {
  public app: express.Application;
  protected _status: string;
  constructor() {
    super();
    this.app = express();
    this._status = 'inactive';
  }

  get status() {
    return this._status;
  }

  /* public async init() {
  } */

  public async serve(port: number) {
    this.app.listen(port, () => {
      console.log(`> Server Listening on ${port}`);
      this._status = 'serving';
      this.emit('serving');
    });
  }
}
