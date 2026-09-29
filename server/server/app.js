const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const config = require("./config");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const postsRoutes = require("./routes/postsRoutes");
const foodLogRoutes = require("./routes/foodLogRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", config.trustProxy);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // Exercise tutorial videos are embedded from YouTube.
        "frame-src": ["'self'", "https://www.youtube-nocookie.com"],
        "img-src": ["'self'", "data:", "blob:"],
      },
    },
    // Uploaded images are loaded by the client from the same site.
    crossOriginResourcePolicy: { policy: "same-site" },
    // YouTube's embedded player refuses to load (error 153) without a
    // referrer. This sends only the site's origin to other sites, never
    // full URLs.
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

if (config.corsOrigins.length > 0) {
  app.use(
    cors({
      origin: config.corsOrigins,
      methods: "GET,HEAD,POST,DELETE",
    })
  );
}

app.use(express.json({ limit: "100kb" }));

// Rate limits. Login and registration are tight to slow password guessing;
// the third-party lookups protect the RapidAPI and USDA quotas.
const limiter = (windowMinutes, limit, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message },
  });

app.use(
  ["/api/login", "/api/register"],
  limiter(15, 20, "Too many attempts. Wait a few minutes and try again.")
);
app.use(
  ["/api/exercises", "/api/food"],
  limiter(1, 60, "Too many searches. Wait a minute and try again.")
);
app.use("/api", limiter(1, 300, "Too many requests. Slow down and try again."));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api", userRoutes);
app.use("/api", foodRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api", foodLogRoutes);
app.use("/api/exercises", exerciseRoutes);

app.use("/api", (req, res) => res.status(404).json({ message: "Not found" }));

app.use(
  "/uploads",
  express.static(config.uploadsDir, {
    maxAge: "7d",
    // Never let an uploaded file be interpreted as anything but an image.
    setHeaders: (res) => res.set("X-Content-Type-Options", "nosniff"),
  })
);

// In production the API also serves the built React app, with every
// non-API route falling back to index.html for client-side routing.
if (config.isProduction && fs.existsSync(config.clientBuildDir)) {
  app.use(
    express.static(config.clientBuildDir, {
      index: false,
      maxAge: "1y",
      immutable: true,
    })
  );
  app.get("*", (req, res) =>
    res.sendFile(path.join(config.clientBuildDir, "index.html"), {
      headers: { "Cache-Control": "no-cache" },
    })
  );
}

// Central error handler: log the detail, return a generic message.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request is too large." });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body isn't valid JSON." });
  }
  if (err.status && err.status < 500 && err.expose) {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

module.exports = app;
