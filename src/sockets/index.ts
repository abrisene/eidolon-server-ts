/*
 * sockets/index.ts
 * Sockets Index
 */

/*
 * Module Dependencies
 */

import chalk from 'chalk';
import socketIO from 'socket.io';
import Configs from '../configs';
import Server from '../Server';

/*
 * Module Exports
 */

export default async function(io: socketIO.Server, server: Server) {

  // Basic Connection Event
  io.on('connection', (socket) => {
    console.log(chalk.cyan.bold('>> Client Connected <<'));
    socket.on('disconnect', () => {
      console.log(chalk.magenta.bold('>> Client Disconnected <<'));
    });
  });

  return;
}
