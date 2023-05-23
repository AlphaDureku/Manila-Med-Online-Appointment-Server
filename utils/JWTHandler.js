const jwt = require("jsonwebtoken");
const sendResponse = require("./sendResponse");

const jwtMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.data = decodedToken;

    next();
  } catch (err) {
    sendResponse(res, 401, "Invalid token");
  }
};

module.exports = jwtMiddleware;
