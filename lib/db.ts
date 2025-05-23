// lib/db.ts
import { Pool } from "pg";

export const db = new Pool({
  host: "localhost",
  user: "postgres",
  password: "venki",
  database: "postgres",
  port: 5432,
});
