/*
 * middleware.common.ts
 * Common Middleware
 */

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
export function injectConfig(key: string, value: any) {
  return (ctx: ParameterizedContext, next: Next) => {
    ctx.state[key] = ctx.state[key] ? { ...ctx.state[key], ...value } : value;
    return next();
  };
}

/**
 * Injects a message into ctx.state.
 * @param msg The key for the config to be injected.
 * @param type The message type. Should correspond to a bootstrap class.
 */
export function injectMessage({ msg, type = 'warning' }: { msg: string, type?: string }) {
  return (ctx: ParameterizedContext, next: Next) => {
    ctx.state.messages = ctx.state.messages ? [...ctx.state.messages, { msg, type }] : [{ msg, type }];
    return next();
  };
}

/**
 * Renders a view with the config and user injected.
 * @param path Path to the view to render.
 * @param options Options passed into the renderer.
 */
export function renderInjected(path: string, options = {}) {
  return (ctx: ParameterizedContext) => {
    return ctx.render(path, { ...ctx.state.config, ...ctx.state.messages, user: ctx.state.user, ...options, url: ctx.url });
  };
}
/* export function injectConfig(ctx: ParameterizedContext, next: Next) {
  // const user = ctx.state.user;
  next();
  }
} */
