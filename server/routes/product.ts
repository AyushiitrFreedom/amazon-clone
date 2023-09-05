import { z } from 'zod';
import { userProcedure } from '../middlewares/protectedroute';
import { router } from '../trpc';
import { db } from '..';
import { InsertProduct, InsertUser, product, user } from '../db/schema/Schema';
import { eq } from 'drizzle-orm';
import { TRPCClientError } from '@trpc/client';
import { v4 as uuidv4 } from 'uuid';

export const productRouter = router({
    add: userProcedure.input(
        z.object({
            name: z.string().min(3, 'minimum length should be 3').max(20).nonempty("name is required"),
            description: z.string().min(3, 'minimum length should be 3').max(50).nonempty('description is required'),
            price: z.number(),
            imageUrl: z.string().url().nonempty('image url is required')
        })
    ).mutation(async (opts) => {
        //checking for existing user
        try {
            if (opts.ctx.user.isSeller === false) {
                throw new TRPCClientError("You are not a seller")
            }
            const newProduct = async (t: InsertProduct) => {
                return db.insert(product).values(t);
            }




            const newproduct: InsertProduct = { name: opts.input.name, description: opts.input.description, price: opts.input.price, product_id: uuidv4(), seller_id: opts.ctx.user.id, imageUrl: opts.input.imageUrl };
            const result = await newProduct(newproduct);
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
    get: userProcedure.input(z.object({
        id: z.string().nonempty("id is required")
    })).query(async (opts) => {
        try {
            const products = await db.select().from(product).where(eq(product.product_id, opts.input.id));
            if (!products[0]) {
                throw new TRPCClientError("product not found")
            }
            return products[0];
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
            const products = await db.select().from(product);
            if (products === undefined) {
                throw new TRPCClientError("No Products Found")
            }
            return products;
        } catch (error) {
            let errorMessage = "Failed to do something exceptional";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            throw new TRPCClientError(errorMessage)
        }
    }),
});