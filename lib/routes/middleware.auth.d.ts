/**
 * Module Dependencies
 */
import { Next, ParameterizedContext } from 'koa';
/**
 * Module Exports
 */
/**
 * Middleware to generate a JWT if the request contains a valid user.
 * @param ctx Koa context.
 * @param next Next function callback.
 */
export declare function generateUserToken(ctx: ParameterizedContext, next: Next): Promise<void>;
/**
 * Middleware to clear the JWT from the current user's cookies.
 * @param ctx Koa context.
 * @param next Next function callback.
 */
export declare function clearUserToken(ctx: ParameterizedContext, next: Next): void;
/**
 * Middleware to require JWT authentication. Injects user into Request.
 * @param ctx Koa context.
 * @param next Next function callback.
 */
declare function authenticateJwtRequired(ctx: ParameterizedContext, next: Next): Promise<any>;
/**
 * Middleware for optional JWT authentication. Injects user into Request.
 * @param ctx Koa context.
 * @param next Next function callback.
 */
declare function authenticateJwtOptional(ctx: ParameterizedContext, next: Next): Promise<any>;
export declare const authenticate: {
    required: typeof authenticateJwtRequired;
    optional: typeof authenticateJwtOptional;
};
export {};
//# sourceMappingURL=middleware.auth.d.ts.map