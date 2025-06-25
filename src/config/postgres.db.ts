import postgres from "postgres";

const sql = postgres(
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres");

// Testovanie spojenia
sql`SELECT 1`
  .then(() => console.log("✅ Connected to Postgres"))
  .catch(err => console.error("❌ Connection failed:", err));
export default sql;