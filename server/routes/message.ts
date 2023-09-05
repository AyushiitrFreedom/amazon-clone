import { z } from 'zod';
import { userProcedure } from '../middlewares/protectedroute';
import { publicProcedure, router } from '../trpc';
import { db } from '..';
import { InsertMessage, InsertUser, message, user } from '../db/schema/Schema';
import { eq, or } from 'drizzle-orm';
import { TRPCClientError } from '@trpc/client';
import { v4 as uuidv4 } from 'uuid';

export const messageRouter = router({
    add: userProcedure.input(
        z.object({
            message: z.string().nonempty("message is required"),
            recipient_id: z.string().nonempty("recipient_id is required"),
        })
    ).mutation(async (opts) => {
        //checking for existing user
        try {
            const newMessage = async (t: InsertMessage) => {
                return db.insert(message).values(t);
            }




            const newmessage: InsertMessage = { message: opts.input.message, sender_id: opts.ctx.user.id, recipient_id: opts.input.recipient_id, message_id: uuidv4() };
            const result = await newMessage(newmessage);
            if (result === undefined || result === null) {
                throw new TRPCClientError(result + "agya pakad me ")
            }
            if (result) {
                return {
                    status: "Message Sent",
                    res: { message: opts.input.message, sender_id: opts.ctx.user.id, recipient_id: opts.input.recipient_id, message_id: uuidv4() }
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
            const messages = await db.select().from(message).where(or(
                eq(message.sender_id, opts.ctx.user.id),
                eq(message.recipient_id, opts.ctx.user.id)
            ));
            if (messages === undefined || messages.length == 0 || messages === null) {
                throw new TRPCClientError("No Messages Found")
            }
            // console.log(messages[0].message);
            return messages;
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