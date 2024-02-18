import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./lib/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DRIZZLE_DATABASE_URL!,
  },
} satisfies Config;
