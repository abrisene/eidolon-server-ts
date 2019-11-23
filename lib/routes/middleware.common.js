"use strict";
/*
 * middleware.common.ts
 * Common Middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Module Exports
 */
function asyncRoute(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };
}
exports.asyncRoute = asyncRoute;
/* export const asyncRoute = fn => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

export const injectConfig = (key: string, value: any) => (req: Request, res: Response, next: NextFunction) => {
  req[key] = req[key] ? { ...req[key], ...value } : value;
  next();
}; */
//# sourceMappingURL=middleware.common.js.map