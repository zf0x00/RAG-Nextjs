import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

console.log(`index.ts', ${process.env.DRIZZLE_DATABASE_URL}`);

if (!process.env.DRIZZLE_DATABASE_URL) {
  throw new Error("database url not found");
}

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);

// export const db = drizzle(sql, { schema: schema });

export const db = drizzle(sql, { schema: schema });
