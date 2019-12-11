/// <reference types="koa-views" />
/// <reference types="koa-passport" />
/// <reference types="koa-bodyparser" />
/**
 * Module Dependencies
 */
import Koa from 'koa';
import Router from 'koa-router';
import { ApolloServer } from 'apollo-server-koa';
import { Config } from '../configs';
import Server from '../Server';
import * as models from '../models';
/**
 * Interfaces
 */
export interface IGraphQLContext {
    ctx: Koa.Context;
    req: Koa.Request;
    res: Koa.Response;
    user: any;
    Configs: Config;
    models: typeof models;
}
/**
 * Module Exports
 */
export default function routes(app: Koa, router: Router, server: Server): Promise<ApolloServer>;
//# sourceMappingURL=routes.graphql.d.ts.map