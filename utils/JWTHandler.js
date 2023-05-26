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

const createAccessToken = async (params) => {
  return jwt.sign(params, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = async (params) => {
  return jwt.sign(params, process.env.JWT_SECRET_REFRESH, { expiresIn: "1d" });
};

const sendRefreshToken = async (res, token) => {
  res.cookie("Nurse_ID", token, {
    httpOnly: true,
  });
};
const authorizedUsingCookie = async (res, token) => {
  if (!token) {
    return { authorized: false };
  }
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET_REFRESH);
  } catch (err) {
    console.log(err);
    return { authorized: false };
  }
  const { Nurse_ID } = payload;
  sendRefreshToken(res, await createRefreshToken({ Nurse_ID }));
  return { authorized: true };
};
module.exports = {
  jwtMiddleware,
  createRefreshToken,
  createAccessToken,
  sendRefreshToken,
  authorizedUsingCookie,
};
