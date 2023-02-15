const sendResponse = require("../utils/sendResponse");
const User = require("../Models/database_query/user_queries");

exports.checkIfExistsAndSendOTP = async (req, res) => {
  const result = await User.findUserUsingEmail(req.body.email);

  sendResponse(res, 200, result);
};
