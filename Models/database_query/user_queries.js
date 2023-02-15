const Sequelize = require("sequelize");
const model = require("../models");

//For Tracking
exports.findUserUsingEmail = async function (email) {
  return await model.user.findOne({
    raw: true,
    attributes: ["user_ID"],
    where: { user_email: email },
  });
};
