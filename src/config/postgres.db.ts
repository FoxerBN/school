import postgres from "postgres";

const sql = postgres({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Testovanie spojenia
sql`SELECT 1`
  .then(() => console.log("✅ Connected to Postgres"))
  .catch(err => console.error("❌ Connection failed:", err));
export default sql;