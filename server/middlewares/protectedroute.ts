import { TRPCError } from '@trpc/server';
import { middleware, publicProcedure } from '../trpc';
import passport from 'passport';
import { get } from 'http';
import jsonwebtoken, { JwtPayload, Secret } from 'jsonwebtoken';
import { User, user } from '../db/schema/Schema';
import { db, upload } from '..';
import { eq } from 'drizzle-orm';


// const IsUser = middleware(async () => {
//     return passport.authenticate('jwt', { session: false })
// });

const IsUser = middleware(async (opts) => {
    upload.single('file')
    let result: User[] = [];
    let token = ' ';
    // console.log(opts.ctx.req.headers. + "cookie") // undefined is being printed
    let response = opts.ctx.req.headers.cookie as string
    // Use a regular expression to extract the 'token' part
    const match = response.match(/token=([^;]*)/);

    // Check if the match was found
    if (match && match.length > 1) {
        token = match[1].substring(6);
        console.log(token + 'this is the fucking token');
    } else {
        console.log("Token not found in the input string");
    }

    console.log(opts.ctx.req.headers.cookie + "ab maja aega n bidu")
    if (token !== " ") {

        try {
            const verify = jsonwebtoken.verify(token as string, process.env.JWT_SECRET as string);
            if (typeof verify !== 'string') {
                result = await db.select().from(user).where(eq(user.id, verify.id));

            }

        } catch (error) {
            console.log('le tu bhi le ye error' + error.message)
        }
    }

    if (!opts.ctx.req.isAuthenticated() && !result[0]) {
        console.log("yue kya hua")
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to do this',
        });

    }

    opts.ctx.req.user = result[0]
    return opts.next({
        ctx: {
            user: result[0]
        }
    });

}
);

export const userProcedure = publicProcedure.use(IsUser);


