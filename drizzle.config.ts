import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit only auto-loads .env, but Next.js convention keeps secrets in
// .env.local — load it so `npm run db:migrate` sees DATABASE_URL.
if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
