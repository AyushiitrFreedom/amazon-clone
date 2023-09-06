import { z } from 'zod';
import { userProcedure } from '../middlewares/protectedroute';
import { publicProcedure, router } from '../trpc';
import { db } from '..';
import { file, InsertFile } from '../db/schema/Schema';
import { eq, or } from 'drizzle-orm';
import { TRPCClientError } from '@trpc/client';
import { v4 as uuidv4 } from 'uuid';

export const fileRouter = router({
    add: userProcedure.input(
        z.object({
            file_path: z.string().nonempty("file is required"),
            recipient_id: z.string().nonempty("recipient_id is required"),
            file_name: z.string().nonempty("file_name is required"),
        })
    ).mutation(async (opts) => {
        //checking for existing user
        try {
            const newMessage = async (t: InsertFile) => {
                return db.insert(file).values(t);
            }




            const newfile: InsertFile = { file_path: opts.input.file_path, sender_id: opts.ctx.user.id, recipient_id: opts.input.recipient_id, file_id: uuidv4(), file_name: opts.input.file_name };
            const result = await newMessage(newfile);
            if (result === undefined || result === null) {
                throw new TRPCClientError(result + "agya pakad me ")
            }
            if (result) {
                return {
                    status: "File Sent",
                };
            }
        } catch (error) {
            let errorMessage = "Failed to do something exceptional";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            throw new TRPCClientError(errorMessage)
        }



    }),
    getall: userProcedure.query(async (opts) => {
        try {
            const files = await db.select().from(file).where(or(
                eq(file.sender_id, opts.ctx.user.id),
                eq(file.recipient_id, opts.ctx.user.id)
            ));
            if (files === undefined || files.length == 0 || files === null) {
                throw new TRPCClientError("No Files Found")
            }
            // console.log(files[0].file);
            return files;
        } catch (error) {
            let errorMessage = "Failed to do something exceptional";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            throw new TRPCClientError(errorMessage)
        }
    }),
    test: publicProcedure.query(async (opts) => {
        return {
            status: "success",
        }
    })
});