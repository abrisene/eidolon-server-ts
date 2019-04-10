/*
 * utilities.common.ts
 * Common Utility Methods
 */

/**
 * Module Exports
 */

/**
 * Checks whether an array of items have any non-undefined or empty values.
 * @param  {array} items An array of items.
 * @return {bool}        Returns true or false
 */
export function exists(items?: string|any[]): boolean {
  let result;
  if (Array.isArray(items)) {
    result = items.some((i: any) => i !== undefined && i !== '');
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
export function jsonTryParse(string: string): object|undefined {
  try {
    const json = JSON.parse(string);
    return json;
  } catch (err) {
    return undefined;
  }
}
