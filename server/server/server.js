const config = require("./config");
const app = require("./app");
const db = require("./db");
const ensureSchema = require("./schema");

let server;

// Create any missing tables first. If the database is unreachable, log it
// and start anyway so the health check and error responses still work.
ensureSchema()
  .then(() => console.log("Database schema is up to date"))
  .catch((err) => console.error("Could not apply the database schema:", err.message))
  .finally(() => {
    server = app.listen(config.port, () => {
      console.log(
        `Server listening on port ${config.port} (${config.isProduction ? "production" : "development"})`
      );
    });
  });

// Finish in-flight requests and close database connections on shutdown
// (platforms send SIGTERM when redeploying or scaling down).
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down`);
  const closeDb = () => db.end().finally(() => process.exit(0));
  if (server) server.close(closeDb);
  else closeDb();
  setTimeout(() => process.exit(1), 10000).unref();
};
["SIGTERM", "SIGINT"].forEach((signal) => process.on(signal, () => shutdown(signal)));
