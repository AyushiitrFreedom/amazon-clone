import type { Config } from "drizzle-kit";

export default {
    schema: "./db/schema/*",
    out: "./db",
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DATABASE_CONNECTION_URL || "postgres://srk:ddlj@localhost:5432/amazon",
    }
} satisfies Config;