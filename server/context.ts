import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export const createContext = async (opts: CreateExpressContextOptions) => {

    return {
        req: opts.req,
        res: opts.res,
    }
};