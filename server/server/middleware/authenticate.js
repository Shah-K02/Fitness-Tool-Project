const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Assumes 'Bearer TOKEN_VALUE'

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Forbidden, invalid token
      }

      req.userId = decoded.userId; // The payload contains the userId
      next(); // Proceed to the next middleware or route handler
    });
  } else {
    res.sendStatus(401); // Unauthorized, no token
  }
};

module.exports = authenticate;
