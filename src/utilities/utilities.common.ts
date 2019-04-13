/*
 * utilities.common.ts
 * Common Utility Methods
 */

/**
 * Interfaces
 */

interface IEnvConfig {
  [propName: string]: string;
}

/**
 * Module Exports
 */

/**
 * Iterates forEach on an array asynchronously.
 * @param  {array}    array     An array to be iterated over.
 * @param  {function} callback  The operation to be performed on each item of the array.
 */
export async function asyncForEach(array: any[], callback: (item: any, index: number, array: any[]) => void) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * Checks whether a string or array of items have any non-undefined or empty values.
 * @param  {array}   items An array of items.
 * @param  {boolean} all   Whether or not all items need to be present.
 * @return {bool}          Returns true or false
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
 * Tries to parse JSON, returns undefined if input is invalid.
 * @param  {string} string  String to be parsed.
 * @return {object}         Returns JSON or undefined
 */
export function jsonTryParse(string: string): IEnvConfig|undefined {
  try {
    const json = JSON.parse(string);
    return json;
  } catch (err) {
    return undefined;
  }
}
