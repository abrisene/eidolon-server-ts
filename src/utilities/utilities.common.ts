/*
 * utilities.common.ts
 * Common Utility Methods
 */

/**
 * Module Imports
 */

import fs from 'fs';
import path from 'path';

/**
 * Interfaces
 */

export interface IConfig {
  [index: string]: any;
}

export interface IEnvConfig {
  [index: string]: string;
}

/**
 * Module Exports
 */

/**
 * Iterates forEach on an array asynchronously.
 * @param    array  An array to be iterated over.
 * @param callback  The operation to be performed on each item of the array.
 */
export async function asyncForEach(array: any[], callback: (item: any, index: number, array: any[]) => void) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * Checks whether a string or array of items have any non-undefined or empty values.
 * @param items An array of items.
 * @param all   Whether or not all items need to be present.
 * @return      Returns true or false
 */
export function exists(items?: string|any[], all = false): boolean {
  let result;
  if (Array.isArray(items)) {
    if (!all) result = items.some((i: any) => i !== undefined && i !== '');
    if (all) result = items.reduce((a: boolean, b: any) => a && b !== undefined && b !== '');
  } else {
    result = items !== undefined && items !== '';
  }
  return result;
}

/**
 * Iterates through files in a directoy and imports the ones that match a RegExp
 * @param pattern  A string or RegExp to match files to be imported.
 * @param location The location of the directory to be iterated through.
 * @param callback An optional async callback to be performed on each module.
 */
export async function importPattern(
  pattern: string | RegExp,
  callback?: (module: any, filename?: string) => Promise<any>,
  location = __dirname,
): Promise<object> {
  const modules: IConfig = {};
  const files = fs.readdirSync(location).filter(i => i.match(pattern));
  await asyncForEach(files, async (filename) => {
    const module = await import(path.join(location, filename));
    modules[location] = module;
    if (callback) await callback(module, filename);
  });
  return modules;
}

/**
 * Tries to parse JSON, returns undefined if input is invalid.
 * @param string  String to be parsed.
 * @return        Returns JSON or undefined.
 */
export function jsonTryParse(string?: string): IEnvConfig|undefined {
  try {
    return string ? JSON.parse(string) : undefined;
  } catch (err) {
    return undefined;
  }
}
