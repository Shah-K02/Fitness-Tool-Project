const mysql = require("mysql2/promise");
require("./config"); // loads and checks server/server/.env

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  waitForConnections: true,
  // Most managed MySQL hosts require TLS. DB_SSL=true verifies the server
  // certificate; DB_SSL_CA can point at the host's CA bundle if needed.
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: true,
          ...(process.env.DB_SSL_CA
            ? { ca: require("fs").readFileSync(process.env.DB_SSL_CA, "utf8") }
            : {}),
        }
      : undefined,
  // Return DATE columns (users_info.birthday) as "YYYY-MM-DD". As JS Dates
  // they were serialised in UTC, so a birthday read back a day early
  // whenever the server was ahead of UTC (e.g. British Summer Time).
  dateStrings: ["DATE"],
});

module.exports = pool;
