const asyncHandler = require("express-async-handler");
const config = require("../config");
const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(token, config.Access_token_secret, (err, decoded) => {
        if (err) {
          res.status(401);
          return next(new Error("User is not authorized"));
        }
        req.user = decoded.user;
        next();
      });

      if (!token) {
        res.status(401);
        return next(new Error("User is not authorized or token is missing"));
      }
    }
  } catch (error) {
    console.error("Error in token validation:", error);
    next(error); 
  }
};

module.exports = validateToken;
