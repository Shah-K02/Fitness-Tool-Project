const config = require("./config");
const app = require("./app");
const db = require("./db");

const server = app.listen(config.port, () => {
  console.log(
    `Server listening on port ${config.port} (${config.isProduction ? "production" : "development"})`
  );
});

// Finish in-flight requests and close database connections on shutdown
// (platforms send SIGTERM when redeploying or scaling down).
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    db.end().finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 10000).unref();
};
["SIGTERM", "SIGINT"].forEach((signal) => process.on(signal, () => shutdown(signal)));
