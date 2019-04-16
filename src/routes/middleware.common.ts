import { NextFunction, Request, Response } from 'express';

/*
 * middleware.common.ts
 * Common Middleware
 */

/*
 * Module Exports
 */

/* export const asyncRoute = fn => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

export const injectConfig = (key: string, value: any) => (req: Request, res: Response, next: NextFunction) => {
  req[key] = req[key] ? { ...req[key], ...value } : value;
  next();
}; */
