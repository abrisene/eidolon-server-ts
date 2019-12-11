/// <reference types="koa-views" />
/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
import Koa from 'koa';
import Router from 'koa-router';
import Server from '../Server';
/**
 * Interface
 */
export interface IEidolonRouteFunction {
    app: Koa;
    router: Router;
    server: Server;
}
export declare const middleware: {
    generateUserToken(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next): Promise<void>;
    clearUserToken(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next): void;
    authenticate: {
        required: (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) => Promise<any>;
        optional: (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) => Promise<any>;
    };
    injectConfig(key: string, value: any): (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) => Promise<any>;
    injectMessage({ msg, type }: {
        msg: string;
        type?: string;
    }): (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) => Promise<any>;
    renderInjected(path: string, options?: {}): (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) => any;
};
export default function (app: Koa, router: Router, server: Server): Promise<void>;
//# sourceMappingURL=index.d.ts.map