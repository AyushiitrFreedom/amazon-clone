import { z } from 'zod';
import { userProcedure } from '../middlewares/protectedroute';
import { router } from '../trpc';
import { db } from '..';
import { and, eq } from 'drizzle-orm';
import { TRPCClientError } from '@trpc/client';
import { v4 as uuidv4 } from 'uuid';
import { InsertOrder, Order, order } from '../db/schema/Schema';

export const orderRouter = router({
    add: userProcedure.input(
        z.object({
            id: z.string().nonempty("id is required"),
        })
    ).mutation(async (opts) => {
        //checking for existing user
        try {

            const newOrder = async (t: InsertOrder) => {
                return db.insert(order).values(t);
            }



            const neworder: InsertOrder = { is_bought: false, order_id: uuidv4(), buyer_id: opts.ctx.user.id, product_id: opts.input.id };
            const result = await newOrder(neworder);
            if (result) {
                return {
                    status: "success",
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
    getallcart: userProcedure.query(async (opts) => {
        try {
            const orders = await db.query.order.findMany({
                where: and(eq(order.buyer_id, opts.ctx.user.id), eq(order.is_bought, false)),
                with: {
                    product: true
                }
            })
            // if (!orders[0]) {

            //     throw new TRPCClientError("Cart is Empty")

            // }
            return orders;
        } catch (error) {
            let errorMessage = "Failed to do something exceptional";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            throw new TRPCClientError(errorMessage)
        }
    }),
    getallorders: userProcedure.query(async (opts) => {
        try {
            const orders = await db.query.order.findMany({
                where: and(eq(order.buyer_id, opts.ctx.user.id), eq(order.is_bought, true)),
                with: {
                    product: true
                }
            })
            // if (!orders[0]) {
            //     throw new TRPCClientError("No orders Found")
            // }
            console.log(orders + "orders")
            return orders;
        } catch (error) {
            let errorMessage = "Failed to do something exceptional";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            throw new TRPCClientError(errorMessage)
        }
    }),
    delete: userProcedure
        .input(
            z.object({
                orderId: z.string().nonempty("orderId is required"),
            })
        ).mutation(async (opts) => {
            try {
                // Find the order based on orderId and buyer_id


                // Delete the order
                const deletedOrder = await db.delete(order).where(eq(order.order_id, opts.input.orderId))

                if (deletedOrder) {
                    return {
                        status: "Removed from cart",
                    };
                }
            } catch (error) {
                let errorMessage = "Failed to do something exceptional";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                throw new TRPCClientError(errorMessage);
            }
        }),

    updateorder: userProcedure
        .input(
            z.object({
                orderId: z.string().nonempty("orderId is required"),
            })
        ).mutation(async (opts) => {
            try {
                // Find the order based on orderId and buyer_id


                // Delete the order
                const deletedOrder = await db.update(order).set({ is_bought: true }).where(eq(order.order_id, opts.input.orderId))

                if (deletedOrder) {
                    return {
                        status: "Successfully Bought",
                    };
                }
            } catch (error) {
                let errorMessage = "Failed to do something exceptional";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                throw new TRPCClientError(errorMessage);
            }
        }),


});
