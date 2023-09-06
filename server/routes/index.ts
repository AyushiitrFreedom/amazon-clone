import express from "express";
import { db } from "../index";
import { user } from "../db/schema/Schema";
import { publicProcedure, router } from "../trpc";
import { authRouter } from './auth';

import { productRouter } from './product';
import { orderRouter } from './order';
import { messageRouter } from './message';
import { fileRouter } from './file';
import { string, z } from "zod";
import { TRPCClientError } from "@trpc/client";


export const appRouter = router({

    auth: authRouter,
    product: productRouter,
    order: orderRouter,
    message: messageRouter,
    file: fileRouter


})
export type AppRouter = typeof appRouter;