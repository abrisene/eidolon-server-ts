/*
 * utilities/index.ts
 * Utilities Index
 */

/*
 * Module Dependencies
 */

import * as common from './utilities.common';
import * as mongoose from './utilities.mongoose';

/*
 * Module Exports
 */

export default {
  ...common,
  ...mongoose,
};
