const jwt = require("jsonwebtoken");
const config = require("../config");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "fail",
      message: "Sign in to continue.",
    });
  }

  const token = authHeader.slice("Bearer ".length);
  jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "fail",
        message:
          err.name === "TokenExpiredError"
            ? "Your session has expired. Sign in again."
            : "Sign in to continue.",
      });
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = authenticate;
