/*
 * server.js
 * Server Index
 */

/**
 * Module Dependencies
 */

import events from 'events';
import express from 'express';

/*
 * Module Exports
 */

export default class Server extends events {
  public app: express.Application;
  constructor() {
    super();
    this.app = express();
  }

  /* public async init() {
  } */

  public async serve(port: number) {
    this.app.listen(port, () => {
      console.log(`> Server Listening on ${port}`);
      this.emit('Serving');
    });
  }
}
