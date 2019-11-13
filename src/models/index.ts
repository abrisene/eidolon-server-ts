/*
 * models/index.ts
 * Models Index
 */

/*
 * Module Dependencies
 */

import User from './model.user/model.user.schema';
import Identity from './model.user/model.user.identity';
import Token from './model.authentication/model.token';

/*
 * Module Exports
 */

export default {
  User,
  Identity,
  Token,
};
