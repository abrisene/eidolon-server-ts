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
export declare function asyncForEach(array: any[], callback: (item: any, index: number, array: any[]) => void): Promise<void>;
/**
 * Checks whether a string or array of items have any non-undefined or empty values.
 * @param items An array of items.
 * @param all   Whether or not all items need to be present.
 * @return      Returns true or false
 */
export declare function exists(items?: string | any[], all?: boolean): boolean;
/**
 * Iterates through files in a directoy and imports the ones that match a RegExp
 * @param pattern  A string or RegExp to match files to be imported.
 * @param location The location of the directory to be iterated through.
 * @param callback An optional async callback to be performed on each module.
 */
export declare function importPattern(pattern: string | RegExp, callback?: (module: any, filename?: string) => Promise<any>, location?: string): Promise<object>;
/**
 * Tries to parse JSON, returns undefined if input is invalid.
 * @param string  String to be parsed.
 * @return        Returns JSON or undefined.
 */
export declare function jsonTryParse(string?: string): IEnvConfig | undefined;
//# sourceMappingURL=utilities.common.d.ts.map