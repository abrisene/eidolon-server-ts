"use strict";
/*
 * middleware.common.ts
 * Common Middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderInjected = exports.injectMessage = exports.injectConfig = void 0;
/**
 * Module Exports
 */
/**
 * Creates a middleware that injects a config into ctx.state.
 * @param key The key for the config to be injected.
 * @param value The value for the config to be injected.
 */
function injectConfig(key, value) {
    return (ctx, next) => {
        ctx.state[key] = ctx.state[key] ? Object.assign(Object.assign({}, ctx.state[key]), value) : value;
        return next();
    };
}
exports.injectConfig = injectConfig;
/**
 * Injects a message into ctx.state.
 * @param msg The key for the config to be injected.
 * @param type The message type. Should correspond to a bootstrap class.
 */
function injectMessage({ msg, type = 'warning' }) {
    return (ctx, next) => {
        ctx.state.messages = ctx.state.messages ? [...ctx.state.messages, { msg, type }] : [{ msg, type }];
        return next();
    };
}
exports.injectMessage = injectMessage;
/**
 * Renders a view with the config and user injected.
 * @param path Path to the view to render.
 * @param options Options passed into the renderer.
 */
function renderInjected(path, options = {}) {
    return (ctx) => {
        return ctx.render(path, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ctx.state.config), ctx.state.messages), { user: ctx.state.user }), options), { url: ctx.url }));
    };
}
exports.renderInjected = renderInjected;
/* export function injectConfig(ctx: ParameterizedContext, next: Next) {
  // const user = ctx.state.user;
  next();
  }
} */
//# sourceMappingURL=middleware.common.js.map