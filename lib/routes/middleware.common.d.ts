/// <reference types="koa-views" />
/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
/**
 * Module Dependencies
 */
import { Next, ParameterizedContext } from 'koa';
/**
 * Module Exports
 */
/**
 * Creates a middleware that injects a config into ctx.state.
 * @param key The key for the config to be injected.
 * @param value The value for the config to be injected.
 */
export declare function injectConfig(key: string, value: any): (ctx: ParameterizedContext<import("koa").DefaultState, import("koa").DefaultContext>, next: Next) => Promise<any>;
/**
 * Injects a message into ctx.state.
 * @param msg The key for the config to be injected.
 * @param type The message type. Should correspond to a bootstrap class.
 */
export declare function injectMessage({ msg, type }: {
    msg: string;
    type?: string;
}): (ctx: ParameterizedContext<import("koa").DefaultState, import("koa").DefaultContext>, next: Next) => Promise<any>;
/**
 * Renders a view with the config and user injected.
 * @param path Path to the view to render.
 * @param options Options passed into the renderer.
 */
export declare function renderInjected(path: string, options?: {}): (ctx: ParameterizedContext<import("koa").DefaultState, import("koa").DefaultContext>) => any;
//# sourceMappingURL=middleware.common.d.ts.map