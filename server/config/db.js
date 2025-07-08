const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
});

// Testing the connection using promises
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

testConnection();

module.exports = pool;
