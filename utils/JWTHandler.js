const jwt = require("jsonwebtoken");
const sendResponse = require("./sendResponse");

const verifyJWT = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { verifyJWT };
