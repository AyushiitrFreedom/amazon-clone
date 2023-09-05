import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import * as schema from './db/schema/Schema';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "postgres-migrations"
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routes/index';

import pkg from 'pg';
import { createContext } from "./context";
import session from "express-session";
const { Client } = pkg;
import genFunc from 'connect-pg-simple';
import passport from "passport";
import { fail } from 'assert';
import jwtMaker from './utils/func/jwtMaker';
import('./middlewares/passport');

const PostgresqlStore = genFunc(session);
const sessionStore = new PostgresqlStore({
    conString: 'postgres://srk:ddlj@localhost:5432/amazon',
    createTableIfMissing: true,
});



const client = new Client({
    host: "127.0.0.1",
    port: 5432,
    user: "srk",
    password: "ddlj",
    database: "amazon",
});

const connectdb = async () => {

    await client.connect();
}
connectdb();
export const db = drizzle(client, { schema });
// await migrate({ client }, './db');trpc


const app = express();





app.use(cors({ origin: "http://localhost:3000", methods: ['GET', 'POST'], credentials: true }));

app.use(express.json());
dotenv.config();
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: sessionStore,
}));

app.use(passport.initialize())
app.use(passport.session())
app.use('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/register',
    // failureFlash: true
}),
    function (req, res) {
        // console.log(failureFlash, "failure flash")
        const user = req.user as any;
        console.log(user, "user")
        console.log(req.session, "session")
        const session = req.session;
        const token = jwtMaker({ id: user.id });
        res.cookie('token', "Bearer" + token)
        res.redirect('http://localhost:3000/')

    }
);
// Available Routes
app.use("/", createExpressMiddleware({ router: appRouter, createContext: createContext }));
// app.use("/api/notes", require("./routes/notes"));


// Web Sockets Implementation 
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
})

io.on('connection', (socket: any) => {
    console.log("what is a socket", socket)
    console.log("socket is active to be connected")

    socket.on('chat', (payload: any) => {
        console.log("what is a payload", payload)
        io.emit('chat', payload)
    });
});

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Example app listening on port ${process.env.EXPRESS_PORT}`);
});

server.listen(5050, () => {
    console.log("socket is active at port 5050")
})
