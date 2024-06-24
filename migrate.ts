import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, queryClient } from "./server/src/db/";

// for migrations
await migrate(db, { migrationsFolder: "./drizzle" });

console.log("Database migration successful!");

// for closing database connections
await queryClient.end();
