// Db config

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http"; // Important to use this import

import * as schema from "./schema"

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema }); // To use drizzle query api (see docs)

export default db;