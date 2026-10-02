// Creates any missing tables at startup by running server/db/schema.sql.
// Every statement there is CREATE TABLE IF NOT EXISTS, so this is safe to run
// on every start and never changes existing tables or data.
const fs = require("fs");
const path = require("path");
const db = require("./db");

const SCHEMA_FILE = path.join(__dirname, "../db/schema.sql");

const statements = () =>
  fs
    .readFileSync(SCHEMA_FILE, "utf8")
    .split(/;\s*$/m)
    .map((sql) =>
      sql
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim()
    )
    .filter(Boolean);

const ensureSchema = async () => {
  // One connection, so SET NAMES applies to the CREATE TABLEs after it.
  const connection = await db.getConnection();
  try {
    for (const sql of statements()) {
      await connection.query(sql);
    }
  } finally {
    connection.release();
  }
};

module.exports = ensureSchema;
