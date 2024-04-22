const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Token verification error:", err);
        const statusCode = err.name === "JsonWebTokenError" ? 401 : 403;
        return res.status(statusCode).json({
          status: "fail",
          message: "Failed to authenticate token.",
          error: err.message,
        });
      }
      req.userId = decoded.userId;
      next();
    });
  } else {
    res.status(401).json({
      status: "fail",
      message:
        "No token provided. Authorization header is missing or improperly formatted.",
    });
  }
};

module.exports = authenticate;
