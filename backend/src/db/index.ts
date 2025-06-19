import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schemas from "./schema";
import "dotenv/config";

const sqlite = new Database(process.env.DB_FILE_NAME || "./src/db/sqlite.db");
export const db = drizzle(sqlite, { schema: schemas, logger: true });
