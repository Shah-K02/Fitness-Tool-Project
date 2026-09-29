// Environment configuration, read and checked once at startup.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const REQUIRED = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];

const missing = REQUIRED.filter((name) => !process.env[name]);
if (missing.length > 0 && process.env.NODE_ENV !== "test") {
  console.error(
    `Missing required environment variables: ${missing.join(", ")}. ` +
      "Copy server/server/.env.example to .env and fill them in."
  );
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === "production";

if (isProduction && (process.env.JWT_SECRET || "").length < 32) {
  console.error("JWT_SECRET must be at least 32 characters in production.");
  process.exit(1);
}

module.exports = {
  isProduction,
  port: Number(process.env.PORT) || 8081,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  // Comma-separated origins allowed to call the API from another domain.
  // Not needed when the API also serves the built client (same origin).
  corsOrigins: (process.env.CORS_ORIGINS || (isProduction ? "" : "http://localhost:3000"))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  // Where uploaded post images are stored.
  uploadsDir: path.resolve(__dirname, process.env.UPLOADS_DIR || "uploads"),
  // Built React app to serve in production (client/build).
  clientBuildDir: path.resolve(__dirname, process.env.CLIENT_BUILD_DIR || "../../client/build"),
  // Number of reverse proxies in front of the app (for correct client IPs
  // in rate limiting), e.g. 1 behind Render, Railway, Heroku or nginx.
  trustProxy: Number(process.env.TRUST_PROXY || (isProduction ? 1 : 0)),
};
